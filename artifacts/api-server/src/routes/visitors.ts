import { Router, type IRouter, type Request, type Response } from "express";
import { and, desc, eq, ilike, or, sql } from "drizzle-orm";
import { db, visitorsTable } from "@workspace/db";
import {
  clearOAuthStateCookie,
  clearSessionCookie,
  createOAuthState,
  getGoogleConfig,
  getGoogleRedirectUri,
  isSafeReturnTo,
  readOAuthStateCookie,
  readSessionCookie,
  setOAuthStateCookie,
  setSessionCookie,
} from "../lib/visitor-auth";

const router: IRouter = Router();

type GoogleTokenResponse = {
  access_token?: string;
  token_type?: string;
  error?: string;
};

type GoogleUserInfo = {
  sub?: string;
  email?: string;
  email_verified?: boolean;
  name?: string;
};

function redirectWithError(returnTo: string, error: string): string {
  const separator = returnTo.includes("?") ? "&" : "?";
  return `${returnTo}${separator}authError=${encodeURIComponent(error)}`;
}

async function requireAdmin(req: Request, res: Response): Promise<{ id: number; email: string } | null> {
  const session = readSessionCookie(req);
  if (!session) {
    res.status(401).json({ error: "Authentication required" });
    return null;
  }

  let config: ReturnType<typeof getGoogleConfig>;
  try {
    config = getGoogleConfig();
  } catch {
    res.status(503).json({ error: "Google visitor tracking is not configured yet." });
    return null;
  }
  const [visitor] = await db
    .select({ id: visitorsTable.id, email: visitorsTable.email })
    .from(visitorsTable)
    .where(and(eq(visitorsTable.id, session.visitorId), eq(visitorsTable.googleSubject, session.googleSubject)))
    .limit(1);

  if (!visitor || visitor.email.toLowerCase() !== config.adminEmail) {
    res.status(403).json({ error: "Admin access required" });
    return null;
  }
  return visitor;
}

router.get("/auth/google/login", (req, res): void => {
  try {
    const config = getGoogleConfig();
    const returnTo = isSafeReturnTo(req.query.returnTo) ? req.query.returnTo : "/";
    const oauthState = createOAuthState(returnTo);
    setOAuthStateCookie(res, oauthState);

    const params = new URLSearchParams({
      client_id: config.clientId,
      redirect_uri: getGoogleRedirectUri(req),
      response_type: "code",
      scope: "openid email profile",
      access_type: "online",
      prompt: "consent",
      state: oauthState.state,
    });
    res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`);
  } catch (error) {
    req.log.error({ err: error }, "Google login configuration is unavailable");
    res.status(503).json({ error: "Google sign-in is not configured yet." });
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

    const config = getGoogleConfig();
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: config.clientId,
        client_secret: config.clientSecret,
        redirect_uri: getGoogleRedirectUri(req),
        grant_type: "authorization_code",
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error(`Google token exchange failed with status ${tokenResponse.status}`);
    }
    const tokenData = (await tokenResponse.json()) as GoogleTokenResponse;
    if (!tokenData.access_token) throw new Error("Google did not return an access token");

    const userResponse = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    if (!userResponse.ok) {
      throw new Error(`Google user-info request failed with status ${userResponse.status}`);
    }
    const user = (await userResponse.json()) as GoogleUserInfo;
    if (!user.sub || !user.email || user.email_verified !== true) {
      throw new Error("Google account did not provide a verified email address");
    }

    const now = new Date();
    const [visitor] = await db
      .insert(visitorsTable)
      .values({
        googleSubject: user.sub,
        email: user.email.toLowerCase(),
        displayName: user.name?.trim() || user.email.split("@")[0],
        firstVisitAt: now,
        lastVisitAt: now,
        visitCount: 1,
      })
      .onConflictDoUpdate({
        target: visitorsTable.googleSubject,
        set: {
          email: user.email.toLowerCase(),
          displayName: user.name?.trim() || user.email.split("@")[0],
          lastVisitAt: now,
          visitCount: sql`${visitorsTable.visitCount} + 1`,
          updatedAt: now,
        },
      })
      .returning({
        id: visitorsTable.id,
        googleSubject: visitorsTable.googleSubject,
      });

    if (!visitor) throw new Error("Visitor record could not be saved");
    setSessionCookie(res, { visitorId: visitor.id, googleSubject: visitor.googleSubject });
    res.redirect(returnTo);
  } catch (error) {
    req.log.error({ err: error }, "Google sign-in failed");
    res.redirect(redirectWithError(returnTo, "Google sign-in could not be completed."));
  }
});

router.get("/auth/me", async (req, res): Promise<void> => {
  const session = readSessionCookie(req);
  if (!session) {
    res.json({ authenticated: false, isAdmin: false });
    return;
  }

  const [visitor] = await db
    .select({
      id: visitorsTable.id,
      googleSubject: visitorsTable.googleSubject,
      email: visitorsTable.email,
      displayName: visitorsTable.displayName,
    })
    .from(visitorsTable)
    .where(and(eq(visitorsTable.id, session.visitorId), eq(visitorsTable.googleSubject, session.googleSubject)))
    .limit(1);

  if (!visitor) {
    clearSessionCookie(res);
    res.json({ authenticated: false, isAdmin: false });
    return;
  }

  let isAdmin = false;
  try {
    isAdmin = visitor.email.toLowerCase() === getGoogleConfig().adminEmail;
  } catch {
    isAdmin = false;
  }
  res.json({
    authenticated: true,
    isAdmin,
    email: visitor.email,
    displayName: visitor.displayName,
  });
});

router.post("/auth/logout", (_req, res): void => {
  clearSessionCookie(res);
  res.status(204).send();
});

router.get("/admin/visitors", async (req, res): Promise<void> => {
  if (!(await requireAdmin(req, res))) return;

  const rawQuery = typeof req.query.q === "string" ? req.query.q.trim() : "";
  const query = rawQuery.slice(0, 100);
  const filter = query
    ? or(ilike(visitorsTable.displayName, `%${query}%`), ilike(visitorsTable.email, `%${query}%`))
    : undefined;
  const visitors = await db
    .select({
      id: visitorsTable.id,
      displayName: visitorsTable.displayName,
      email: visitorsTable.email,
      firstVisitAt: visitorsTable.firstVisitAt,
      lastVisitAt: visitorsTable.lastVisitAt,
      visitCount: visitorsTable.visitCount,
    })
    .from(visitorsTable)
    .where(filter)
    .orderBy(desc(visitorsTable.lastVisitAt))
    .limit(1000);

  res.json({ visitors });
});

export default router;