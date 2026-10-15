import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { recordAuditEvent } from "@/lib/audit";
import { getAuthProvider } from "@/lib/auth/provider";
import { challengeCookieOptions, LOGIN_CHALLENGE_COOKIE, verifyLoginChallenge } from "@/lib/auth/login-challenge";
import { consumeAuthAttempt } from "@/lib/auth/rate-limit";
import { normalizeReturnUrl } from "@/lib/auth/return-url";
import { isSameOriginRequest } from "@/lib/auth/same-origin";
import { createSessionToken, SESSION_COOKIE, sessionCookieOptions } from "@/lib/auth/session";

const schema = z.object({
  identifier: z.string().trim().min(1).max(254),
  password: z.string().min(1).max(256),
  captchaAnswer: z.coerce.number().int().min(-999).max(999),
  remember: z.boolean().default(false),
  returnTo: z.string().optional(),
});

const genericError = "Identitas akun atau kata sandi tidak sesuai. Periksa kembali dan coba lagi.";

function clearChallenge(response: NextResponse) {
  response.cookies.set(LOGIN_CHALLENGE_COOKIE, "", challengeCookieOptions(0));
  response.headers.set("Cache-Control", "no-store");
  return response;
}

export async function POST(request: NextRequest) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ message: "Permintaan tidak dapat diproses." }, { status: 403 });
  }

  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    return clearChallenge(NextResponse.json({ message: "Format permintaan tidak didukung." }, { status: 415 }));
  }

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return clearChallenge(NextResponse.json({ message: genericError }, { status: 400 }));
  }

  const rate = consumeAuthAttempt(parsed.data.identifier, request.headers.get("x-forwarded-for"));
  if (!rate.allowed) {
    await recordAuditEvent("LOGIN_RATE_LIMITED");
    return clearChallenge(NextResponse.json(
      { message: "Terlalu banyak percobaan. Tunggu sebentar lalu coba lagi." },
      { status: 429, headers: { "Retry-After": String(rate.retryAfterSeconds) } },
    ));
  }

  const challengeValid = verifyLoginChallenge(
    request.cookies.get(LOGIN_CHALLENGE_COOKIE)?.value,
    parsed.data.captchaAnswer,
  );
  if (!challengeValid) {
    await recordAuditEvent("LOGIN_CHALLENGE_FAILURE");
    return clearChallenge(NextResponse.json(
      {
        code: "invalid_challenge",
        message: "Jawaban verifikasi keamanan belum tepat atau sudah kedaluwarsa.",
      },
      { status: 400 },
    ));
  }

  try {
    const identity = await getAuthProvider().authenticate(parsed.data);
    if (!identity) {
      await recordAuditEvent("LOGIN_FAILURE");
      return clearChallenge(NextResponse.json({ message: genericError }, { status: 401 }));
    }

    const { token, expiresAt } = createSessionToken(identity, parsed.data.remember);
    const response = NextResponse.json({ redirectTo: normalizeReturnUrl(parsed.data.returnTo) });
    response.cookies.set(SESSION_COOKIE, token, sessionCookieOptions(expiresAt));
    await recordAuditEvent("LOGIN_SUCCESS");
    return clearChallenge(response);
  } catch {
    return clearChallenge(NextResponse.json(
      { message: "Layanan masuk sedang tidak tersedia. Coba kembali beberapa saat lagi." },
      { status: 503 },
    ));
  }
}
