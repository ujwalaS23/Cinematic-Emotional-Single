import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import type { Request, Response } from "express";

export const SESSION_COOKIE = "birthday_session";
export const OAUTH_STATE_COOKIE = "birthday_oauth_state";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;
const OAUTH_STATE_MAX_AGE_SECONDS = 10 * 60;

type OAuthState = {
  state: string;
  returnTo: string;
  createdAt: number;
};

type Session = {
  visitorId: number;
  googleSubject: string;
  expiresAt: number;
};

function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET must be configured");
  }
  return secret;
}

function encode(value: string): string {
  return Buffer.from(value, "utf8").toString("base64url");
}

function decode(value: string): string | null {
  try {
    return Buffer.from(value, "base64url").toString("utf8");
  } catch {
    return null;
  }
}

function signature(value: string): string {
  return createHmac("sha256", getSessionSecret()).update(value).digest("base64url");
}

function sign(value: string): string {
  return `${encode(value)}.${signature(value)}`;
}

function verify(token: string): string | null {
  const [encoded, providedSignature] = token.split(".");
  if (!encoded || !providedSignature) return null;
  const value = decode(encoded);
  if (!value) return null;

  const expectedSignature = signature(value);
  const expected = Buffer.from(expectedSignature);
  const provided = Buffer.from(providedSignature);
  if (expected.length !== provided.length || !timingSafeEqual(expected, provided)) {
    return null;
  }
  return value;
}

function cookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: true,
    sameSite: "lax" as const,
    path: "/",
    maxAge: maxAge * 1000,
  };
}

export function setOAuthStateCookie(res: Response, state: OAuthState): void {
  res.cookie(
    OAUTH_STATE_COOKIE,
    sign(JSON.stringify(state)),
    { ...cookieOptions(OAUTH_STATE_MAX_AGE_SECONDS), path: "/api/auth/google" },
  );
}

export function readOAuthStateCookie(req: Request): OAuthState | null {
  const raw = req.cookies?.[OAUTH_STATE_COOKIE];
  if (!raw) return null;
  const value = verify(raw);
  if (!value) return null;
  try {
    const parsed = JSON.parse(value) as OAuthState;
    if (
      typeof parsed.state !== "string" ||
      typeof parsed.returnTo !== "string" ||
      typeof parsed.createdAt !== "number" ||
      Date.now() - parsed.createdAt > OAUTH_STATE_MAX_AGE_SECONDS * 1000
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function clearOAuthStateCookie(res: Response): void {
  res.clearCookie(OAUTH_STATE_COOKIE, { path: "/api/auth/google" });
}

export function setSessionCookie(res: Response, session: Omit<Session, "expiresAt">): void {
  const payload: Session = {
    ...session,
    expiresAt: Date.now() + SESSION_MAX_AGE_SECONDS * 1000,
  };
  res.cookie(SESSION_COOKIE, sign(JSON.stringify(payload)), cookieOptions(SESSION_MAX_AGE_SECONDS));
}

export function readSessionCookie(req: Request): Session | null {
  const raw = req.cookies?.[SESSION_COOKIE];
  if (!raw) return null;
  const value = verify(raw);
  if (!value) return null;
  try {
    const parsed = JSON.parse(value) as Session;
    if (
      !Number.isInteger(parsed.visitorId) ||
      typeof parsed.googleSubject !== "string" ||
      typeof parsed.expiresAt !== "number" ||
      parsed.expiresAt <= Date.now()
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function clearSessionCookie(res: Response): void {
  res.clearCookie(SESSION_COOKIE, { path: "/" });
}

export function isSafeReturnTo(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value.startsWith("/") &&
    !value.startsWith("//") &&
    !value.includes("\\") &&
    !value.includes("\n") &&
    !value.includes("\r")
  );
}

export function getGoogleConfig(): { clientId: string; clientSecret: string; adminEmail: string } {
  const clientId = process.env.GOOGLE_CLIENT_ID?.trim();
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  if (!clientId || !clientSecret || !adminEmail) {
    throw new Error(
      "Google visitor tracking is not configured. Set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and ADMIN_EMAIL.",
    );
  }
  return { clientId, clientSecret, adminEmail };
}

export function getGoogleRedirectUri(req: Request): string {
  const configured = process.env.GOOGLE_REDIRECT_URI?.trim();
  if (configured) return configured;

  const forwardedProto = req.get("x-forwarded-proto")?.split(",")[0]?.trim();
  const forwardedHost = req.get("x-forwarded-host")?.split(",")[0]?.trim();
  const protocol = forwardedProto || req.protocol;
  const host = forwardedHost || req.get("host");
  if (!host) throw new Error("Unable to determine the Google OAuth redirect URI");
  return `${protocol}://${host}/api/auth/google/callback`;
}

export function createOAuthState(returnTo: string): OAuthState {
  return {
    state: randomBytes(32).toString("hex"),
    returnTo,
    createdAt: Date.now(),
  };
}