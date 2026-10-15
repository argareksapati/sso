import "server-only";

import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";

import type { AppSession } from "./session";

export const CONNECTED_APPS_COOKIE = "sso_bandung_connected_apps";

type StoredAuthorizations = {
  version: 1;
  subject: string;
  revokedIds: string[];
};

function encryptionKey() {
  const secret = process.env.AUTH_SESSION_SECRET;
  if (!secret || secret.length < 32) throw new Error("AUTH_SESSION_SECRET minimal 32 karakter belum dikonfigurasi.");
  return createHash("sha256").update(`connected-apps:${secret}`, "utf8").digest();
}

function encode(value: StoredAuthorizations) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", encryptionKey(), iv);
  const encrypted = Buffer.concat([cipher.update(JSON.stringify(value), "utf8"), cipher.final()]);
  return [iv, cipher.getAuthTag(), encrypted].map((part) => part.toString("base64url")).join(".");
}

function decode(value: string | undefined): StoredAuthorizations | null {
  if (!value) return null;
  try {
    const [ivPart, tagPart, encryptedPart, extra] = value.split(".");
    if (!ivPart || !tagPart || !encryptedPart || extra) return null;
    const decipher = createDecipheriv("aes-256-gcm", encryptionKey(), Buffer.from(ivPart, "base64url"));
    decipher.setAuthTag(Buffer.from(tagPart, "base64url"));
    const decrypted = Buffer.concat([
      decipher.update(Buffer.from(encryptedPart, "base64url")),
      decipher.final(),
    ]).toString("utf8");
    const parsed = JSON.parse(decrypted) as Partial<StoredAuthorizations>;
    if (parsed.version !== 1 || typeof parsed.subject !== "string" || !Array.isArray(parsed.revokedIds)) return null;
    const revokedIds = parsed.revokedIds.filter((id): id is string => typeof id === "string").slice(0, 100);
    return { version: 1, subject: parsed.subject, revokedIds };
  } catch {
    return null;
  }
}

export async function getRevokedApplicationIds(session: AppSession) {
  const store = await cookies();
  const saved = decode(store.get(CONNECTED_APPS_COOKIE)?.value);
  return saved?.subject === session.subject ? saved.revokedIds : [];
}

export function encodeRevokedApplicationIds(subject: string, revokedIds: string[]) {
  return encode({ version: 1, subject, revokedIds: [...new Set(revokedIds)].slice(0, 100) });
}

export function connectedAppsCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  };
}
