import { NextRequest, NextResponse } from "next/server";

import { recordAuditEvent } from "@/lib/audit";
import { OAUTH_REMEMBER, OAUTH_RETURN_TO } from "@/lib/auth/oauth-context";
import { normalizeReturnUrl } from "@/lib/auth/return-url";
import { createSessionToken, SESSION_COOKIE, sessionCookieOptions } from "@/lib/auth/session";
import { getAppOrigin } from "@/lib/auth/supabase-config";
import { mapSupabaseIdentity } from "@/lib/auth/supabase-identity";
import { createSupabaseOAuthClient } from "@/lib/auth/supabase-oauth";

export const dynamic = "force-dynamic";

function readReturnTo(request: NextRequest) {
  const encoded = request.cookies.get(OAUTH_RETURN_TO)?.value;
  if (!encoded) return normalizeReturnUrl(undefined);
  try {
    return normalizeReturnUrl(Buffer.from(encoded, "base64url").toString("utf8"));
  } catch {
    return normalizeReturnUrl(undefined);
  }
}

function clearOAuthContext(response: NextResponse) {
  const options = { path: "/api/auth/callback/google", maxAge: 0 };
  response.cookies.set(OAUTH_RETURN_TO, "", options);
  response.cookies.set(OAUTH_REMEMBER, "", options);
}

function errorResponse(code: "cancelled" | "callback_failed") {
  const url = new URL("/login", getAppOrigin());
  url.searchParams.set("oauthError", code);
  return NextResponse.redirect(url);
}

export async function GET(request: NextRequest) {
  if (process.env.AUTH_PROVIDER !== "supabase") {
    return errorResponse("callback_failed");
  }

  const code = request.nextUrl.searchParams.get("code");
  const providerError = request.nextUrl.searchParams.get("error");
  if (!code || providerError) {
    await recordAuditEvent("LOGIN_GOOGLE_FAILURE");
    const response = errorResponse(providerError ? "cancelled" : "callback_failed");
    clearOAuthContext(response);
    return response;
  }

  try {
    const oauth = createSupabaseOAuthClient(request);
    const { data, error } = await oauth.client.auth.exchangeCodeForSession(code);
    if (error || !data.user) {
      await recordAuditEvent("LOGIN_GOOGLE_FAILURE");
      const response = errorResponse("callback_failed");
      oauth.clearAuthCookies(response);
      clearOAuthContext(response);
      return response;
    }

    const identity = mapSupabaseIdentity(data.user);
    const remember = request.cookies.get(OAUTH_REMEMBER)?.value === "1";
    const { token, expiresAt } = createSessionToken(identity, remember);
    const destination = new URL(readReturnTo(request), getAppOrigin());
    const response = NextResponse.redirect(destination);
    response.cookies.set(SESSION_COOKIE, token, sessionCookieOptions(expiresAt));
    oauth.clearAuthCookies(response);
    clearOAuthContext(response);
    await recordAuditEvent("LOGIN_GOOGLE_SUCCESS");
    return response;
  } catch {
    await recordAuditEvent("LOGIN_GOOGLE_FAILURE");
    const response = errorResponse("callback_failed");
    clearOAuthContext(response);
    return response;
  }
}
