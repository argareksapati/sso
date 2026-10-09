import { NextResponse } from "next/server";
import { z } from "zod";

import { recordAuditEvent } from "@/lib/audit";
import { consumeAuthAttempt } from "@/lib/auth/rate-limit";
import { isSameOriginRequest } from "@/lib/auth/same-origin";
import { createSessionToken, SESSION_COOKIE, sessionCookieOptions } from "@/lib/auth/session";
import { registerSupabaseAccount, RegistrationError } from "@/lib/auth/supabase-registration";

const schema = z.object({
  fullName: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(254),
  password: z.string().min(8).max(256),
  passwordConfirmation: z.string().min(1).max(256),
}).refine((value) => value.password === value.passwordConfirmation, {
  path: ["passwordConfirmation"],
});

const invalidFormMessage = "Periksa nama, alamat email, dan konfirmasi kata sandi Anda.";

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ message: "Permintaan tidak dapat diproses." }, { status: 403 });
  }

  if (process.env.AUTH_PROVIDER !== "supabase") {
    return NextResponse.json({ message: "Pendaftaran akun belum tersedia pada lingkungan ini." }, { status: 503 });
  }

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ message: invalidFormMessage }, { status: 400 });
  }

  const rate = consumeAuthAttempt(`register:${parsed.data.email}`, request.headers.get("x-forwarded-for"));
  if (!rate.allowed) {
    await recordAuditEvent("REGISTER_RATE_LIMITED");
    return NextResponse.json(
      { message: "Terlalu banyak percobaan pendaftaran. Tunggu sebentar lalu coba lagi." },
      { status: 429, headers: { "Retry-After": String(rate.retryAfterSeconds) } },
    );
  }

  try {
    const result = await registerSupabaseAccount(parsed.data);
    if (result.status === "confirmation_required") {
      await recordAuditEvent("REGISTER_CONFIRMATION_REQUIRED");
      return NextResponse.json({ redirectTo: "/daftar/berhasil" });
    }

    const { token, expiresAt } = createSessionToken(result.identity, false);
    const response = NextResponse.json({ redirectTo: "/portal" });
    response.cookies.set(SESSION_COOKIE, token, sessionCookieOptions(expiresAt));
    await recordAuditEvent("REGISTER_SUCCESS");
    return response;
  } catch (error) {
    await recordAuditEvent("REGISTER_FAILURE");
    if (error instanceof RegistrationError) {
      const messages = {
        invalid_email: "Alamat email tidak valid.",
        weak_password: "Kata sandi belum memenuhi persyaratan keamanan.",
        rate_limited: "Email verifikasi baru saja dikirim. Tunggu sebentar sebelum mencoba lagi.",
        email_delivery_unavailable: "Email verifikasi belum dapat dikirim ke alamat ini. Coba masuk dengan Gmail atau hubungi pengelola layanan.",
        unavailable: "Pendaftaran akun sedang tidak tersedia. Coba kembali beberapa saat lagi.",
      } as const;
      const status = error.code === "rate_limited" ? 429 : error.code === "unavailable" ? 503 : 400;
      return NextResponse.json({ message: messages[error.code] }, { status });
    }
    return NextResponse.json(
      { message: "Pendaftaran akun sedang tidak tersedia. Coba kembali beberapa saat lagi." },
      { status: 503 },
    );
  }
}
