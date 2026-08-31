import { ReplitConnectors } from "@replit/connectors-sdk";
import { Router, type IRouter, type Request, type Response as ExpressResponse } from "express";
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
const VISITOR_SELECT = "id,name,email,first_visit_at,last_visit_at,visit_count,created_at,updated_at";
const AUTH_VISITOR_SELECT = `id,user_id,${VISITOR_SELECT.slice(3)}`;

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
  id: string | number;
  user_id: string;
  name: string;
  email: string;
  first_visit_at: string;
  last_visit_at: string;
  visit_count: number;
  created_at?: string;
  updated_at?: string;
};

function redirectWithError(returnTo: string, error: string): string {
  const separator = returnTo.includes("?") ? "&" : "?";
  return `${returnTo}${separator}authError=${encodeURIComponent(error)}`;
}

function getServiceRoleConfig(): { url: string; key: string } | null {
  const url = process.env.SUPABASE_URL?.trim().replace(/\/+$/, "");
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  return url && key ? { url, key } : null;
}

async function supabaseRequest(path: string, init: RequestInit = {}): Promise<globalThis.Response> {
  const serviceConfig = getServiceRoleConfig();
  if (serviceConfig) {
    const headers = new Headers(init.headers);
    headers.set("apikey", serviceConfig.key);
    headers.set("Authorization", `Bearer ${serviceConfig.key}`);
    return fetch(`${serviceConfig.url}${path}`, { ...init, headers });
  }

  const connectors = new ReplitConnectors();
  return connectors.proxy("supabase", path, {
    method: init.method,
    headers: Object.fromEntries(new Headers(init.headers).entries()),
    body: typeof init.body === "string" ? init.body : undefined,
  });
}

async function parseSupabaseError(response: globalThis.Response): Promise<string> {
  try {
    const body = (await response.clone().json()) as { message?: string; error?: string };
    return body.message || body.error || `Supabase request failed with status ${response.status}`;
  } catch {
    return `Supabase request failed with status ${response.status}`;
  }
}

async function requireVisitor(req: Request, res: ExpressResponse): Promise<{ session: ReturnType<typeof readSessionCookie>; visitor: VisitorRow } | null> {
  const session = readSessionCookie(req);
  if (!session) {
    res.status(401).json({ error: "Authentication required" });
    return null;
  }

  const response = await supabaseRequest(
    `/rest/v1/visitors?select=${AUTH_VISITOR_SELECT}&user_id=eq.${encodeURIComponent(session.userId)}&limit=1`,
  );
  if (!response.ok) {
    res.status(503).json({ error: "Visitor records are temporarily unavailable." });
    return null;
  }
  const visitors = (await response.json()) as VisitorRow[];
  const visitor = visitors[0];
  if (!visitor) {
    clearSessionCookie(res);
    res.status(401).json({ error: "Your session has expired. Please sign in again." });
    return null;
  }
  return { session, visitor };
}

async function recordVisitor(user: SupabaseUser): Promise<VisitorRow> {
  if (!user.id || !user.email) throw new Error("Supabase did not return a complete user profile");
  const email = user.email.trim().toLowerCase();
  const name = user.user_metadata?.full_name?.trim() || user.user_metadata?.name?.trim() || email.split("@")[0];

  const rpcResponse = await supabaseRequest("/rest/v1/rpc/record_visitor_visit", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ p_user_id: user.id, p_name: name, p_email: email }),
  });
  if (rpcResponse.ok) {
    const result = (await rpcResponse.json()) as VisitorRow | VisitorRow[];
    return Array.isArray(result) ? result[0] : result;
  }

  // The SQL helper is recommended for atomic increments. This fallback keeps
  // the app usable if the table exists before the helper function is created.
  const existingResponse = await supabaseRequest(
    `/rest/v1/visitors?select=${AUTH_VISITOR_SELECT}&user_id=eq.${encodeURIComponent(user.id)}&limit=1`,
  );
  if (!existingResponse.ok) throw new Error(await parseSupabaseError(existingResponse));
  const existing = ((await existingResponse.json()) as VisitorRow[])[0];

  if (!existing) {
    const insertResponse = await supabaseRequest("/rest/v1/visitors", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Prefer: "return=representation,resolution=ignore-duplicates",
      },
      body: JSON.stringify({ user_id: user.id, name, email, visit_count: 1 }),
    });
    if (!insertResponse.ok) throw new Error(await parseSupabaseError(insertResponse));
    const inserted = (await insertResponse.json()) as VisitorRow[];
    if (inserted[0]) return inserted[0];
  }

  const visitor = existing || ((await supabaseRequest(
    `/rest/v1/visitors?select=${AUTH_VISITOR_SELECT}&user_id=eq.${encodeURIComponent(user.id)}&limit=1`,
  ).then((response) => response.json())) as VisitorRow[])[0];
  if (!visitor) throw new Error("Visitor record could not be saved");

  const updateResponse = await supabaseRequest(
    `/rest/v1/visitors?user_id=eq.${encodeURIComponent(user.id)}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Accept: "application/json", Prefer: "return=representation" },
      body: JSON.stringify({
        name,
        email,
        last_visit_at: new Date().toISOString(),
        visit_count: visitor.visit_count + 1,
        updated_at: new Date().toISOString(),
      }),
    },
  );
  if (!updateResponse.ok) throw new Error(await parseSupabaseError(updateResponse));
  return ((await updateResponse.json()) as VisitorRow[])[0] || visitor;
}

router.get("/auth/google/login", async (req, res): Promise<void> => {
  try {
    const config = getSupabaseConfig();
    const returnTo = isSafeReturnTo(req.query.returnTo) ? req.query.returnTo : "/";
    const oauthState = createOAuthState(returnTo);
    setOAuthStateCookie(res, oauthState);

    const authorizeUrl = new URL(`${config.url}/auth/v1/authorize`);
    authorizeUrl.searchParams.set("provider", "google");
    authorizeUrl.searchParams.set("redirect_to", getSupabaseRedirectUri(req));
    authorizeUrl.searchParams.set("flow_type", "pkce");
    authorizeUrl.searchParams.set("code_challenge", oauthState.codeChallenge);
    authorizeUrl.searchParams.set("code_challenge_method", "s256");
    authorizeUrl.searchParams.set("state", oauthState.state);
    res.redirect(authorizeUrl.toString());
  } catch (error) {
    req.log.error({ err: error }, "Supabase Google login configuration is unavailable");
    res.status(503).json({ error: "Google sign-in is not configured yet. Please finish the Supabase setup." });
  }
});

router.get("/auth/google/callback", async (req, res): Promise<void> => {
  const oauthState = readOAuthStateCookie(req);
  const returnTo = oauthState?.returnTo || "/";
  clearOAuthStateCookie(res);

  try {
    if (req.query.error) {
      res.redirect(redirectWithError(returnTo, "Google sign-in was cancelled."));
      return;
    }

    const code = typeof req.query.code === "string" ? req.query.code : null;
    const state = typeof req.query.state === "string" ? req.query.state : null;
    if (!oauthState || !state || state !== oauthState.state || !code) {
      res.redirect(redirectWithError(returnTo, "The Google sign-in session expired. Please try again."));
      return;
    }

    const config = getSupabaseConfig();
    const tokenResponse = await fetch(`${config.url}/auth/v1/token?grant_type=pkce`, {
      method: "POST",
      headers: {
        apikey: config.anonKey,
        Authorization: `Bearer ${config.anonKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ auth_code: code, code_verifier: oauthState.codeVerifier }),
    });
    if (!tokenResponse.ok) {
      throw new Error(await parseSupabaseError(tokenResponse));
    }

    const auth = (await tokenResponse.json()) as SupabaseSessionResponse;
    if (!auth.access_token || !auth.user?.id || !auth.user.email) {
      throw new Error("Supabase did not return a complete authenticated user");
    }

    const visitor = await recordVisitor(auth.user);
    setSessionCookie(res, {
      userId: auth.user.id,
      email: visitor.email,
      displayName: visitor.name,
    });
    res.redirect(returnTo);
  } catch (error) {
    req.log.error({ err: error }, "Supabase Google sign-in failed");
    res.redirect(redirectWithError(returnTo, "Google sign-in could not be completed. Please try again."));
  }
});

router.get("/auth/me", async (req, res): Promise<void> => {
  if (!readSessionCookie(req)) {
    res.json({ authenticated: false, isAdmin: false });
    return;
  }
  const result = await requireVisitor(req, res);
  if (!result) return;

  let isAdmin = false;
  try {
    isAdmin = result.visitor.email.trim().toLowerCase() === getAdminEmail();
  } catch {
    isAdmin = false;
  }
  res.json({
    authenticated: true,
    isAdmin,
    email: result.visitor.email,
    displayName: result.visitor.name,
  });
});

router.post("/auth/logout", (_req, res): void => {
  clearSessionCookie(res);
  res.status(204).send();
});

router.get("/admin/visitors", async (req, res): Promise<void> => {
  const result = await requireVisitor(req, res);
  if (!result) return;

  let adminEmail: string;
  try {
    adminEmail = getAdminEmail();
  } catch {
    res.status(503).json({ error: "The administrator account is not configured yet." });
    return;
  }
  if (result.visitor.email.trim().toLowerCase() !== adminEmail) {
    res.status(403).json({ error: "Admin access required" });
    return;
  }

  const response = await supabaseRequest(
    `/rest/v1/visitors?select=${VISITOR_SELECT}&order=last_visit_at.desc&limit=1000`,
  );
  if (!response.ok) {
    res.status(503).json({ error: "Visitor records could not be loaded right now." });
    return;
  }

  const allVisitors = (await response.json()) as VisitorRow[];
  const rawQuery = typeof req.query.q === "string" ? req.query.q.trim().slice(0, 100) : "";
  const query = rawQuery.toLocaleLowerCase();
  const visitors = query
    ? allVisitors.filter((visitor) => `${visitor.name} ${visitor.email}`.toLocaleLowerCase().includes(query))
    : allVisitors;

  res.json({
    visitors,
    totalVisitors: allVisitors.length,
    totalVisits: allVisitors.reduce((total, visitor) => total + Number(visitor.visit_count || 0), 0),
    recentVisitors: allVisitors.slice(0, 5),
  });
});

export default router;