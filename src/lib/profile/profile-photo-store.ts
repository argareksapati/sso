import "server-only";

import { createHash } from "node:crypto";
import { mkdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

export const MAX_PROFILE_PHOTO_BYTES = 2 * 1024 * 1024;
export const PROFILE_PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;

function mediaDirectory() {
  const configured = process.env.PROFILE_MEDIA_DIR?.trim();
  return configured ? path.resolve(configured) : path.join(process.cwd(), ".data", "profile-media");
}

function photoPath(subject: string) {
  const key = createHash("sha256").update(subject, "utf8").digest("hex");
  return path.join(mediaDirectory(), `${key}.webp`);
}

export async function hasProfilePhoto(subject: string) {
  try {
    await stat(photoPath(subject));
    return true;
  } catch {
    return false;
  }
}

export async function readProfilePhoto(subject: string) {
  try {
    const filePath = photoPath(subject);
    const [bytes, details] = await Promise.all([readFile(filePath), stat(filePath)]);
    return { bytes, updatedAt: details.mtimeMs };
  } catch {
    return null;
  }
}

export async function saveProfilePhoto(subject: string, file: File) {
  if (!PROFILE_PHOTO_TYPES.includes(file.type as (typeof PROFILE_PHOTO_TYPES)[number])) {
    throw new Error("Gunakan foto dengan format JPG, PNG, atau WEBP.");
  }
  if (file.size < 1 || file.size > MAX_PROFILE_PHOTO_BYTES) {
    throw new Error("Ukuran foto maksimal 2 MB.");
  }

  const input = Buffer.from(await file.arrayBuffer());
  let output: Buffer;
  try {
    output = await sharp(input, { failOn: "warning", limitInputPixels: 40_000_000 })
      .rotate()
      .resize(512, 512, { fit: "cover", position: "attention" })
      .webp({ quality: 84, effort: 4 })
      .toBuffer();
  } catch {
    throw new Error("Berkas foto rusak atau formatnya tidak didukung.");
  }

  await mkdir(mediaDirectory(), { recursive: true });
  await writeFile(photoPath(subject), output, { mode: 0o600 });
  return { updatedAt: Date.now() };
}

export async function deleteProfilePhoto(subject: string) {
  await rm(photoPath(subject), { force: true });
}
