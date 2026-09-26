import "server-only";

import type { AuthProvider } from "./contracts";
import { DevelopmentMockProvider } from "./mock-provider";
import { SupabaseAuthProvider } from "./supabase-provider";

export function getAuthProvider(): AuthProvider {
  const provider = process.env.AUTH_PROVIDER;

  if (provider === "mock") return new DevelopmentMockProvider();
  if (provider === "supabase") return new SupabaseAuthProvider();

  if (provider === "oidc") {
    throw new Error("Adapter OIDC menunggu keputusan Identity Provider dan metadata staging.");
  }

  throw new Error("AUTH_PROVIDER belum dikonfigurasi.");
}
