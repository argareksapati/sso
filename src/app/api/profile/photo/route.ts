import { NextRequest, NextResponse } from "next/server";

import { recordAuditEvent } from "@/lib/audit";
import { getSession } from "@/lib/auth/session";
import { isSameOriginRequest } from "@/lib/auth/same-origin";
import {
  deleteProfilePhoto,
  readProfilePhoto,
  saveProfilePhoto,
} from "@/lib/profile/profile-photo-store";

const privateImageHeaders = {
  "Cache-Control": "private, no-store, max-age=0",
  "Content-Security-Policy": "default-src 'none'; sandbox",
  "Content-Type": "image/webp",
  "X-Content-Type-Options": "nosniff",
};

export async function GET() {
  const session = await getSession();
  if (!session) return new NextResponse(null, { status: 401 });

  const photo = await readProfilePhoto(session.subject);
  if (!photo) return new NextResponse(null, { status: 404, headers: { "Cache-Control": "private, no-store" } });

  return new NextResponse(new Uint8Array(photo.bytes), {
    status: 200,
    headers: {
      ...privateImageHeaders,
      "Content-Disposition": "inline; filename=foto-profil.webp",
      "Last-Modified": new Date(photo.updatedAt).toUTCString(),
    },
  });
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ message: "Sesi Anda telah berakhir." }, { status: 401 });
  if (!isSameOriginRequest(request)) return NextResponse.json({ message: "Permintaan tidak dapat diproses." }, { status: 403 });
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("multipart/form-data")) {
    return NextResponse.json({ message: "Format unggahan tidak didukung." }, { status: 415 });
  }

  try {
    const form = await request.formData();
    const photo = form.get("photo");
    if (!(photo instanceof File)) {
      return NextResponse.json({ message: "Pilih foto yang ingin digunakan." }, { status: 400 });
    }
    const saved = await saveProfilePhoto(session.subject, photo);
    await recordAuditEvent("PROFILE_PHOTO_UPDATED");
    return NextResponse.json({ message: "Foto profil berhasil disimpan.", version: saved.updatedAt });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Foto profil belum dapat disimpan.";
    return NextResponse.json({ message }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ message: "Sesi Anda telah berakhir." }, { status: 401 });
  if (!isSameOriginRequest(request)) return NextResponse.json({ message: "Permintaan tidak dapat diproses." }, { status: 403 });

  await deleteProfilePhoto(session.subject);
  await recordAuditEvent("PROFILE_PHOTO_DELETED");
  return NextResponse.json({ message: "Foto profil berhasil dihapus." });
}
