import "server-only";

import type { AuthProvider } from "./contracts";
import { DevelopmentMockProvider } from "./mock-provider";

export function getAuthProvider(): AuthProvider {
  const provider = process.env.AUTH_PROVIDER;

  if (provider === "mock") return new DevelopmentMockProvider();

  if (provider === "oidc") {
    throw new Error("Adapter OIDC menunggu keputusan Identity Provider dan metadata staging.");
  }

  throw new Error("AUTH_PROVIDER belum dikonfigurasi.");
}
