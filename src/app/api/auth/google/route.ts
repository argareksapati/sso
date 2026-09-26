import { NextRequest, NextResponse } from "next/server";

import { recordAuditEvent } from "@/lib/audit";
import { OAUTH_REMEMBER, OAUTH_RETURN_TO } from "@/lib/auth/oauth-context";
import { normalizeReturnUrl } from "@/lib/auth/return-url";
import { getAppOrigin, isSupabaseGoogleEnabled } from "@/lib/auth/supabase-config";
import { createSupabaseOAuthClient } from "@/lib/auth/supabase-oauth";

export const dynamic = "force-dynamic";

function loginError(code: "unavailable" | "not_configured" | "start_failed") {
  const url = new URL("/login", getAppOrigin());
  url.searchParams.set("oauthError", code);
  return NextResponse.redirect(url);
}

export async function GET(request: NextRequest) {
  if (process.env.AUTH_PROVIDER !== "supabase") {
    return loginError("unavailable");
  }

  try {
    if (!await isSupabaseGoogleEnabled()) {
      await recordAuditEvent("LOGIN_GOOGLE_FAILURE");
      return loginError("not_configured");
    }

    const returnTo = normalizeReturnUrl(request.nextUrl.searchParams.get("returnTo"));
    const remember = request.nextUrl.searchParams.get("remember") === "true";
    const callback = new URL("/api/auth/callback/google", getAppOrigin());
    const oauth = createSupabaseOAuthClient(request);
    const { data, error } = await oauth.client.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: callback.toString(),
        skipBrowserRedirect: true,
      },
    });

    if (error || !data.url) {
      await recordAuditEvent("LOGIN_GOOGLE_FAILURE");
      return loginError("start_failed");
    }

    const response = NextResponse.redirect(data.url);
    oauth.applyPendingCookies(response);
    response.cookies.set(OAUTH_RETURN_TO, Buffer.from(returnTo, "utf8").toString("base64url"), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/api/auth/callback/google",
      maxAge: 10 * 60,
    });
    response.cookies.set(OAUTH_REMEMBER, remember ? "1" : "0", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/api/auth/callback/google",
      maxAge: 10 * 60,
    });
    return response;
  } catch {
    await recordAuditEvent("LOGIN_GOOGLE_FAILURE");
    return loginError("start_failed");
  }
}
