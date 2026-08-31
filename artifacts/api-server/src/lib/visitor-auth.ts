import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import type { Request, Response } from "express";

export const SESSION_COOKIE = "birthday_session";
export const OAUTH_STATE_COOKIE = "birthday_oauth_state";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;
const OAUTH_STATE_MAX_AGE_SECONDS = 10 * 60;

type OAuthState = {
  state: string;
  codeVerifier: string;
  codeChallenge: string;
  returnTo: string;
  createdAt: number;
};

export type Session = {
  userId: string;
  email: string;
  displayName: string;
  expiresAt: number;
};

function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET must be configured");
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

  const expected = Buffer.from(signature(value));
  const provided = Buffer.from(providedSignature);
  if (expected.length !== provided.length || !timingSafeEqual(expected, provided)) return null;
  return value;
}

function cookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "lax" as const,
    path: "/",
    maxAge: maxAge * 1000,
  };
}

export function getSupabaseConfig(): { url: string; anonKey: string } {
  const url = process.env.SUPABASE_URL?.trim().replace(/\/+$/, "");
  const anonKey = process.env.SUPABASE_ANON_KEY?.trim();
  if (!url || !anonKey) {
    throw new Error("Supabase is not configured. Set SUPABASE_URL and SUPABASE_ANON_KEY.");
  }
  return { url, anonKey };
}

export function getAdminEmail(): string {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  if (!email) throw new Error("ADMIN_EMAIL must be configured");
  return email;
}

export function getSupabaseRedirectUri(req: Request): string {
  const forwardedProto = req.header("x-forwarded-proto")?.split(",")[0]?.trim();
  const forwardedHost = req.header("x-forwarded-host")?.split(",")[0]?.trim();
  const protocol = forwardedProto || (process.env.NODE_ENV === "development" ? "http" : "https");
  const host = forwardedHost || req.get("host");
  if (!host) throw new Error("Unable to determine the application host");
  return `${protocol}://${host}/api/auth/google/callback`;
}

export function createOAuthState(returnTo: string): OAuthState {
  const codeVerifier = randomBytes(32).toString("base64url");
  const codeChallenge = createHash("sha256").update(codeVerifier).digest("base64url");
  return {
    state: randomBytes(32).toString("base64url"),
    codeVerifier,
    codeChallenge,
    returnTo,
    createdAt: Date.now(),
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
      typeof parsed.codeVerifier !== "string" ||
      typeof parsed.codeChallenge !== "string" ||
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

export function setSessionCookie(
  res: Response,
  session: Omit<Session, "expiresAt">,
): void {
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
      typeof parsed.userId !== "string" ||
      typeof parsed.email !== "string" ||
      typeof parsed.displayName !== "string" ||
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
    !value.includes("\r") &&
    !value.includes("\n")
  );
}