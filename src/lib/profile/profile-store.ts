import "server-only";

import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { z } from "zod";

import type { AppSession } from "@/lib/auth/session";

export const PROFILE_COOKIE = "sso_bandung_profile";

export const profileSchema = z.object({
  contactEmail: z.string().trim().max(254).refine((value) => value === "" || z.email().safeParse(value).success, "Alamat email belum valid."),
  username: z.string().trim().min(3, "Username minimal 3 karakter.").max(40).regex(/^[a-zA-Z0-9._-]+$/, "Username hanya boleh berisi huruf, angka, titik, garis bawah, atau tanda hubung."),
  nickname: z.string().trim().min(1, "Nama panggilan wajib diisi.").max(60),
  whatsapp: z.string().trim().max(32),
  firstName: z.string().trim().min(1, "Nama depan wajib diisi.").max(80),
  lastName: z.string().trim().max(80),
  birthPlace: z.string().trim().max(100),
  about: z.string().trim().max(160),
  address: z.string().trim().max(500),
});

export type EditableProfile = z.infer<typeof profileSchema>;

type StoredProfile = {
  version: 1;
  subject: string;
  updatedAt: number;
  profile: EditableProfile;
};

function encryptionKey() {
  const secret = process.env.AUTH_SESSION_SECRET;
  if (!secret || secret.length < 32) throw new Error("AUTH_SESSION_SECRET minimal 32 karakter belum dikonfigurasi.");
  return createHash("sha256").update(`profile:${secret}`, "utf8").digest();
}

function displayNameParts(displayName: string) {
  const parts = displayName.trim().split(/\s+/).filter(Boolean);
  return { firstName: parts[0] || "Pengguna", lastName: parts.slice(1).join(" ") };
}

function profileUsername(displayName: string) {
  const normalized = displayName.toLocaleLowerCase("id-ID").replace(/[^a-z0-9]+/g, ".").replace(/^\.|\.$/g, "");
  return normalized.slice(0, 40) || "pengguna.sso";
}

export function defaultProfile(session: AppSession): EditableProfile {
  const { firstName, lastName } = displayNameParts(session.displayName);
  return {
    contactEmail: session.email || "",
    username: profileUsername(session.displayName),
    nickname: firstName,
    whatsapp: "",
    firstName,
    lastName,
    birthPlace: "",
    about: "Pengguna Single Sign On Kota Bandung",
    address: "",
  };
}

export function encodeProfile(subject: string, profile: EditableProfile) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", encryptionKey(), iv);
  const payload: StoredProfile = { version: 1, subject, updatedAt: Date.now(), profile };
  const encrypted = Buffer.concat([cipher.update(JSON.stringify(payload), "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return [iv, tag, encrypted].map((value) => value.toString("base64url")).join(".");
}

function decodeProfile(value: string | undefined): StoredProfile | null {
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
    const parsed = JSON.parse(decrypted) as Partial<StoredProfile>;
    const profile = profileSchema.safeParse(parsed.profile);
    if (parsed.version !== 1 || typeof parsed.subject !== "string" || !profile.success) return null;
    return { version: 1, subject: parsed.subject, updatedAt: Number(parsed.updatedAt) || 0, profile: profile.data };
  } catch {
    return null;
  }
}

export async function getStoredProfile(session: AppSession) {
  const store = await cookies();
  const stored = decodeProfile(store.get(PROFILE_COOKIE)?.value);
  return stored?.subject === session.subject ? stored.profile : defaultProfile(session);
}

export function profileCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  };
}
