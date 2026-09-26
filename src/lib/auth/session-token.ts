import { createHmac, timingSafeEqual } from "node:crypto";

import type { AuthIdentity } from "./contracts";

export type AppSession = AuthIdentity & {
  issuedAt: number;
  expiresAt: number;
};

function sessionSecret() {
  const secret = process.env.AUTH_SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("AUTH_SESSION_SECRET minimal 32 karakter belum dikonfigurasi.");
  }
  return secret;
}

function encode(value: string) {
  return Buffer.from(value, "utf8").toString("base64url");
}

function sign(payload: string) {
  return createHmac("sha256", sessionSecret()).update(payload, "utf8").digest("base64url");
}

export function createSessionToken(identity: AuthIdentity, remember: boolean) {
  const issuedAt = Math.floor(Date.now() / 1000);
  const expiresAt = issuedAt + (remember ? 60 * 60 * 24 * 7 : 60 * 60 * 2);
  const payload = encode(JSON.stringify({ ...identity, issuedAt, expiresAt } satisfies AppSession));
  return { token: `${payload}.${sign(payload)}`, expiresAt };
}

export function verifySessionToken(token: string | undefined): AppSession | null {
  if (!token) return null;
  const [payload, signature, extra] = token.split(".");
  if (!payload || !signature || extra) return null;

  const expected = Buffer.from(sign(payload), "utf8");
  const received = Buffer.from(signature, "utf8");
  if (expected.length !== received.length || !timingSafeEqual(expected, received)) return null;

  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as AppSession;
    if (
      typeof session.subject !== "string" ||
      typeof session.displayName !== "string" ||
      !Array.isArray(session.roles) ||
      typeof session.expiresAt !== "number" ||
      session.expiresAt <= Math.floor(Date.now() / 1000)
    ) return null;
    return session;
  } catch {
    return null;
  }
}
