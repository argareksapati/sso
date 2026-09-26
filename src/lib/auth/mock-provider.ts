import "server-only";

import { createHash, timingSafeEqual } from "node:crypto";

import type { AuthIdentity, AuthProvider, LoginCredentials } from "./contracts";

function digest(value: string) {
  return createHash("sha256").update(value, "utf8").digest();
}

function equalSecret(left: string, right: string) {
  return timingSafeEqual(digest(left), digest(right));
}

export class DevelopmentMockProvider implements AuthProvider {
  readonly kind = "mock" as const;

  constructor() {
    if (process.env.NODE_ENV === "production") {
      throw new Error("DevelopmentMockProvider tidak boleh digunakan di production.");
    }
  }

  async authenticate(credentials: LoginCredentials): Promise<AuthIdentity | null> {
    const expectedIdentifier = process.env.AUTH_MOCK_IDENTIFIER;
    const expectedPassword = process.env.AUTH_MOCK_PASSWORD;

    if (!expectedIdentifier || !expectedPassword) {
      throw new Error("Kredensial mock belum dikonfigurasi.");
    }

    const identifierMatches = equalSecret(
      credentials.identifier.trim().toLocaleLowerCase("id-ID"),
      expectedIdentifier.trim().toLocaleLowerCase("id-ID"),
    );
    const passwordMatches = equalSecret(credentials.password, expectedPassword);

    if (!identifierMatches || !passwordMatches) return null;

    const subject = createHash("sha256")
      .update(`sso-bandung-development:${expectedIdentifier}`, "utf8")
      .digest("hex")
      .slice(0, 32);

    return {
      subject: `development-${subject}`,
      displayName: process.env.AUTH_MOCK_DISPLAY_NAME?.trim() || "Pengguna Uji",
      roles: ["citizen"],
    };
  }

  async requestPasswordRecovery(): Promise<void> {
    // Development adapter deliberately sends no email, SMS, or WhatsApp message.
  }
}
