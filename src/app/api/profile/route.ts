import { NextRequest, NextResponse } from "next/server";

import { recordAuditEvent } from "@/lib/audit";
import { getSession } from "@/lib/auth/session";
import { isSameOriginRequest } from "@/lib/auth/same-origin";
import { encodeProfile, profileCookieOptions, PROFILE_COOKIE, profileSchema } from "@/lib/profile/profile-store";

export async function PUT(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ message: "Sesi Anda telah berakhir." }, { status: 401 });
  if (!isSameOriginRequest(request)) return NextResponse.json({ message: "Permintaan tidak dapat diproses." }, { status: 403 });
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    return NextResponse.json({ message: "Format permintaan tidak didukung." }, { status: 415 });
  }

  const parsed = profileSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ message: parsed.error.issues[0]?.message || "Data profil belum valid." }, { status: 400 });
  }

  const response = NextResponse.json({ profile: parsed.data, message: "Perubahan profil berhasil disimpan." });
  response.cookies.set(PROFILE_COOKIE, encodeProfile(session.subject, parsed.data), profileCookieOptions());
  response.headers.set("Cache-Control", "no-store");
  await recordAuditEvent("PROFILE_UPDATED");
  return response;
}
