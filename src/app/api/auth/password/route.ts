import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { recordAuditEvent } from "@/lib/audit";
import { changePassword, PasswordChangeError } from "@/lib/auth/password-change";
import { consumeAuthAttempt } from "@/lib/auth/rate-limit";
import { isSameOriginRequest } from "@/lib/auth/same-origin";
import { getSession, SESSION_COOKIE, sessionCookieOptions } from "@/lib/auth/session";

const schema = z.object({
  identifier: z.string().trim().email().max(254),
  currentPassword: z.string().min(1).max(256),
  newPassword: z.string().min(8).max(128),
  confirmPassword: z.string().min(1).max(128),
}).refine((value) => value.newPassword === value.confirmPassword, {
  message: "Konfirmasi kata sandi baru belum sama.",
  path: ["confirmPassword"],
}).refine((value) => value.currentPassword !== value.newPassword, {
  message: "Kata sandi baru harus berbeda dari kata sandi saat ini.",
  path: ["newPassword"],
});

const messages: Record<PasswordChangeError["code"], string> = {
  invalid_current: "Email akun atau kata sandi saat ini tidak sesuai.",
  weak_password: "Kata sandi baru belum memenuhi persyaratan keamanan atau pernah digunakan.",
  unsupported: "Perubahan kata sandi belum didukung oleh penyedia identitas akun ini.",
  unavailable: "Layanan perubahan kata sandi sedang tidak tersedia. Coba kembali beberapa saat lagi.",
};

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ message: "Sesi Anda telah berakhir." }, { status: 401 });
  if (!isSameOriginRequest(request)) return NextResponse.json({ message: "Permintaan tidak dapat diproses." }, { status: 403 });
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    return NextResponse.json({ message: "Format permintaan tidak didukung." }, { status: 415 });
  }

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ message: parsed.error.issues[0]?.message || "Data kata sandi belum valid." }, { status: 400 });
  }

  const rate = consumeAuthAttempt(`password:${session.subject}`, request.headers.get("x-forwarded-for"));
  if (!rate.allowed) {
    await recordAuditEvent("PASSWORD_CHANGE_RATE_LIMITED");
    return NextResponse.json(
      { message: "Terlalu banyak percobaan. Tunggu sebentar lalu coba lagi." },
      { status: 429, headers: { "Retry-After": String(rate.retryAfterSeconds) } },
    );
  }

  try {
    await changePassword({ session, ...parsed.data });
    await recordAuditEvent("PASSWORD_CHANGED");
    const response = NextResponse.json({
      message: "Kata sandi berhasil diubah. Silakan masuk kembali.",
      redirectTo: "/login?passwordChanged=1",
    });
    response.cookies.set(SESSION_COOKIE, "", { ...sessionCookieOptions(), maxAge: 0 });
    response.headers.set("Cache-Control", "no-store");
    return response;
  } catch (error) {
    await recordAuditEvent("PASSWORD_CHANGE_FAILURE");
    if (error instanceof PasswordChangeError) {
      const status = error.code === "unavailable" ? 503 : error.code === "unsupported" ? 501 : 400;
      return NextResponse.json({ message: messages[error.code] }, { status });
    }
    return NextResponse.json({ message: messages.unavailable }, { status: 503 });
  }
}
