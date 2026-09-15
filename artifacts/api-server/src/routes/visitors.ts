import { ReplitConnectors } from "@replit/connectors-sdk";
import {
  Router,
  type IRouter,
  type Request,
  type Response as ExpressResponse,
} from "express";
import {
  clearOAuthStateCookie,
  clearSessionCookie,
  createOAuthState,
  getAdminEmail,
  getSupabaseConfig,
  getSupabaseRedirectUri,
  isSafeReturnTo,
  readOAuthStateCookie,
  readSessionCookie,
  setOAuthStateCookie,
  setSessionCookie,
} from "../lib/visitor-auth";

const router: IRouter = Router();
const VISITOR_SELECT = "email,name,visited_at,user_agent";

type SupabaseUser = {
  id?: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
    name?: string;
  };
};

type SupabaseSessionResponse = {
  user?: SupabaseUser;
  access_token?: string;
};

type VisitorRow = {
  email: string;
  name: string;
  visited_at: string;
  user_agent: string;
};

function redirectWithError(returnTo: string, error: string): string {
  const separator = returnTo.includes("?") ? "&" : "?";
  return `${returnTo}${separator}authError=${encodeURIComponent(error)}`;
}

function getServiceRoleConfig(): { url: string; key: string } | null {
  const url = (process.env.SUPABASE_URL || process.env.supabase_url)
    ?.trim()
    .replace(/\/+$/, "");

  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  return url && key ? { url, key } : null;
}

async function supabaseRequest(
  path: string,
  init: RequestInit = {},
): Promise<globalThis.Response> {
  const serviceConfig = getServiceRoleConfig();

  if (serviceConfig) {
    const headers = new Headers(init.headers);

    headers.set("apikey", serviceConfig.key);
    headers.set("Authorization", `Bearer ${serviceConfig.key}`);

    return fetch(`${serviceConfig.url}${path}`, {
      ...init,
      headers,
    });
  }

  const connectors = new ReplitConnectors();

  return connectors.proxy("supabase", path, {
    method: init.method,
    headers: Object.fromEntries(new Headers(init.headers).entries()),
    body: typeof init.body === "string" ? init.body : undefined,
  });
}

async function supabaseAuthenticatedRequest(
  path: string,
  accessToken: string,
  init: RequestInit = {},
): Promise<globalThis.Response> {
  const config = getSupabaseConfig();

  const headers = new Headers(init.headers);

  headers.set("apikey", config.anonKey);
  headers.set("Authorization", `Bearer ${accessToken}`);

  return fetch(`${config.url}${path}`, {
    ...init,
    headers,
  });
}

async function parseSupabaseError(
  response: globalThis.Response,
): Promise<string> {
  try {
    const body = (await response.clone().json()) as {
      message?: string;
      error?: string;
      error_description?: string;
    };

    return (
      body.message ||
      body.error_description ||
      body.error ||
      `Supabase request failed with status ${response.status}`
    );
  } catch {
    return `Supabase request failed with status ${response.status}`;
  }
}

async function requireVisitor(
  req: Request,
  res: ExpressResponse,
): Promise<ReturnType<typeof readSessionCookie> | null> {
  const session = readSessionCookie(req);

  if (!session) {
    res.status(401).json({
      error: "Authentication required",
    });

    return null;
  }

  return session;
}

async function recordVisitor(
  user: SupabaseUser,
  accessToken: string,
  userAgent: string,
): Promise<void> {
  if (!user.id || !user.email) {
    throw new Error("Supabase did not return a complete user profile");
  }

  const email = user.email.trim().toLowerCase();

  const name =
    user.user_metadata?.full_name?.trim() ||
    user.user_metadata?.name?.trim() ||
    email.split("@")[0];

  const response = await supabaseAuthenticatedRequest(
    "/rest/v1/visitors",
    accessToken,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        email,
        name,
        visited_at: new Date().toISOString(),
        user_agent: userAgent.slice(0, 1000),
      }),
    },
  );

  if (!response.ok) {
    throw new Error(await parseSupabaseError(response));
  }
}

/*
 * GOOGLE LOGIN
 *
 * Supabase manages its own OAuth state.
 * We only keep our own PKCE verifier and return URL.
 */
router.get("/auth/google/login", async (req, res): Promise<void> => {
  try {
    const config = getSupabaseConfig();

    const returnTo = isSafeReturnTo(req.query.returnTo)
      ? req.query.returnTo
      : "/";

    const oauthState = createOAuthState(returnTo);

    setOAuthStateCookie(res, oauthState);

    const authorizeUrl = new URL(
      `${config.url}/auth/v1/authorize`,
    );

    authorizeUrl.searchParams.set("provider", "google");
    authorizeUrl.searchParams.set(
      "redirect_to",
      getSupabaseRedirectUri(req),
    );
    authorizeUrl.searchParams.set("flow_type", "pkce");
    authorizeUrl.searchParams.set(
      "code_challenge",
      oauthState.codeChallenge,
    );
    authorizeUrl.searchParams.set(
      "code_challenge_method",
      "s256",
    );

    res.redirect(authorizeUrl.toString());
  } catch (error) {
    req.log.error(
      { err: error },
      "Supabase Google login configuration is unavailable",
    );

    res.status(503).json({
      error:
        "Google sign-in is not configured yet. Please finish the Supabase setup.",
    });
  }
});

/*
 * GOOGLE CALLBACK
 *
 * This is retained for the authorization-code/PKCE flow.
 */
router.get("/auth/google/callback", async (req, res): Promise<void> => {
  const oauthState = readOAuthStateCookie(req);

  const returnTo = oauthState?.returnTo || "/";

  clearOAuthStateCookie(res);

  res.setHeader("Cache-Control", "no-store");

  try {
    if (req.query.error) {
      const description =
        typeof req.query.error_description === "string"
          ? req.query.error_description
          : "Google sign-in was cancelled.";

      res.redirect(
        redirectWithError(returnTo, description),
      );

      return;
    }

    const code =
      typeof req.query.code === "string"
        ? req.query.code
        : null;

    if (!oauthState || !code) {
      res.redirect(
        redirectWithError(
          returnTo,
          "The Google sign-in session expired. Please try again.",
        ),
      );

      return;
    }

    const config = getSupabaseConfig();

    const tokenResponse = await fetch(
      `${config.url}/auth/v1/token?grant_type=pkce`,
      {
        method: "POST",
        headers: {
          apikey: config.anonKey,
          Authorization: `Bearer ${config.anonKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          auth_code: code,
          code_verifier: oauthState.codeVerifier,
        }),
      },
    );

    if (!tokenResponse.ok) {
      throw new Error(
        await parseSupabaseError(tokenResponse),
      );
    }

    const auth =
      (await tokenResponse.json()) as SupabaseSessionResponse;

    if (
      !auth.access_token ||
      !auth.user?.id ||
      !auth.user.email
    ) {
      throw new Error(
        "Supabase did not return a complete authenticated user",
      );
    }

    const displayName =
      auth.user.user_metadata?.full_name?.trim() ||
      auth.user.user_metadata?.name?.trim() ||
      auth.user.email;

    setSessionCookie(res, {
      userId: auth.user.id,
      email: auth.user.email,
      displayName,
      supabaseAccessToken: auth.access_token,
    });

    try {
      await recordVisitor(
        auth.user,
        auth.access_token,
        req.get("user-agent") || "unknown",
      );
    } catch (error) {
      req.log.error(
        { err: error },
        "Authenticated visitor could not be recorded",
      );
    }

    res.redirect(returnTo);
  } catch (error) {
    req.log.error(
      { err: error },
      "Supabase Google sign-in failed",
    );

    const message =
      error instanceof Error
        ? error.message
        : "Google sign-in could not be completed.";

    res.redirect(
      redirectWithError(
        returnTo,
        `Google sign-in failed: ${message}`,
      ),
    );
  }
});

/*
 * CREATE OUR APPLICATION SESSION
 *
 * Supabase is currently returning the authenticated session
 * in the URL hash:
 *
 * #access_token=...
 *
 * App.tsx sends that access token here.
 *
 * We validate it with Supabase and then create our own
 * secure birthday_session cookie.
 */
router.post("/auth/session", async (req, res): Promise<void> => {
  try {
    const accessToken =
      typeof req.body?.access_token === "string"
        ? req.body.access_token.trim()
        : "";

    if (!accessToken) {
      res.status(400).json({
        error: "Access token is required",
      });

      return;
    }

    const config = getSupabaseConfig();

    const response = await fetch(
      `${config.url}/auth/v1/user`,
      {
        method: "GET",
        headers: {
          apikey: config.anonKey,
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
        },
      },
    );

    if (!response.ok) {
      const errorText = await response.text();

      req.log.error(
        {
          status: response.status,
          error: errorText,
        },
        "Supabase rejected the access token",
      );

      res.status(401).json({
        error: "Invalid Supabase session",
        details: errorText,
      });

      return;
    }

    const user =
      (await response.json()) as SupabaseUser;

    if (!user.id || !user.email) {
      res.status(401).json({
        error: "Supabase returned an incomplete user profile",
      });

      return;
    }

    const email = user.email.trim().toLowerCase();

    const displayName =
      user.user_metadata?.full_name?.trim() ||
      user.user_metadata?.name?.trim() ||
      email;

    /*
     * Create the application's normal session cookie.
     */
    setSessionCookie(res, {
      userId: user.id,
      email,
      displayName,
      supabaseAccessToken: accessToken,
    });

    /*
     * Record the visitor.
     * Failure here must NOT prevent login.
     */
    try {
      await recordVisitor(
        user,
        accessToken,
        req.get("user-agent") || "unknown",
      );
    } catch (error) {
      req.log.error(
        { err: error },
        "Visitor could not be recorded after Supabase login",
      );
    }

    res.status(200).json({
      authenticated: true,
      email,
      displayName,
    });
  } catch (error) {
    req.log.error(
      { err: error },
      "Could not create application session",
    );

    res.status(500).json({
      error: "Could not create application session",
    });
  }
});

/*
 * CURRENT AUTH SESSION
 */
router.get("/auth/me", async (req, res): Promise<void> => {
  res.setHeader("Cache-Control", "no-store");

  if (!readSessionCookie(req)) {
    res.json({
      authenticated: false,
      isAdmin: false,
    });

    return;
  }

  const result = await requireVisitor(req, res);

  if (!result) return;

  let isAdmin = false;

  try {
    isAdmin =
      result.email.trim().toLowerCase() ===
      getAdminEmail();
  } catch {
    isAdmin = false;
  }

  res.json({
    authenticated: true,
    isAdmin,
    email: result.email,
    displayName: result.displayName,
  });
});

/*
 * LOGOUT
 */
router.post("/auth/logout", (_req, res): void => {
  clearSessionCookie(res);
  res.status(204).send();
});

/*
 * ADMIN VISITOR DASHBOARD
 */
router.get("/admin/visitors", async (req, res): Promise<void> => {
  res.setHeader("Cache-Control", "no-store");

  const result = await requireVisitor(req, res);

  if (!result) return;

  let adminEmail: string;

  try {
    adminEmail = getAdminEmail();
  } catch {
    res.status(503).json({
      error: "The administrator account is not configured yet.",
    });

    return;
  }

  if (
    result.email.trim().toLowerCase() !==
    adminEmail
  ) {
    res.status(403).json({
      error: "Admin access required",
    });

    return;
  }

  const visitorQuery =
    `/rest/v1/visitors?select=${VISITOR_SELECT}&order=visited_at.desc&limit=1000`;
  const response = result.supabaseAccessToken
    ? await supabaseAuthenticatedRequest(
        visitorQuery,
        result.supabaseAccessToken,
      )
    : await supabaseRequest(visitorQuery);

  if (!response.ok) {
    req.log.error(
      {
        status: response.status,
        error: await parseSupabaseError(response),
      },
      "Visitor records could not be loaded from Supabase",
    );

    res.status(503).json({
      error: "Visitor records could not be loaded right now.",
    });

    return;
  }

  const allVisitors =
    (await response.json()) as VisitorRow[];

  const rawQuery =
    typeof req.query.q === "string"
      ? req.query.q.trim().slice(0, 100)
      : "";

  const query = rawQuery.toLocaleLowerCase();

  const visitors = query
    ? allVisitors.filter((visitor) =>
        `${visitor.name} ${visitor.email}`
          .toLocaleLowerCase()
          .includes(query),
      )
    : allVisitors;

  res.json({
    visitors,
    totalVisitors: new Set(
      allVisitors.map(
        (visitor) => visitor.email.toLowerCase(),
      ),
    ).size,
    totalVisits: allVisitors.length,
    recentVisitors: allVisitors.slice(0, 5),
  });
});

export default router;