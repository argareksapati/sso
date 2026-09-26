import "server-only";

import { createServerClient, type CookieOptions } from "@supabase/ssr";
import type { NextRequest, NextResponse } from "next/server";

import { getSupabasePublicConfig } from "./supabase-config";

type PendingCookie = {
  name: string;
  value: string;
  options: CookieOptions;
};

export function createSupabaseOAuthClient(request: NextRequest) {
  const config = getSupabasePublicConfig();
  const pendingCookies: PendingCookie[] = [];
  const client = createServerClient(config.url, config.publishableKey, {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      flowType: "pkce",
    },
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        pendingCookies.push(...cookiesToSet);
      },
    },
  });

  return {
    client,
    applyPendingCookies(response: NextResponse) {
      for (const cookie of pendingCookies) {
        response.cookies.set(cookie.name, cookie.value, cookie.options);
      }
    },
    clearAuthCookies(response: NextResponse) {
      const prefix = `sb-${config.projectRef}-auth-token`;
      const names = new Set([
        ...request.cookies.getAll().map((cookie) => cookie.name),
        ...pendingCookies.map((cookie) => cookie.name),
      ]);
      for (const name of names) {
        if (name.startsWith(prefix)) {
          response.cookies.set(name, "", { path: "/", maxAge: 0 });
        }
      }
    },
  };
}
