import { NextResponse } from "next/server";

import { challengeCookieOptions, createLoginChallenge, LOGIN_CHALLENGE_COOKIE } from "@/lib/auth/login-challenge";
import { isSameOriginRequest } from "@/lib/auth/same-origin";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ message: "Permintaan tidak dapat diproses." }, { status: 403 });
  }

  try {
    const challenge = createLoginChallenge();
    const response = NextResponse.json(
      { left: challenge.left, right: challenge.right },
      { headers: { "Cache-Control": "no-store" } },
    );
    response.cookies.set(LOGIN_CHALLENGE_COOKIE, challenge.token, challengeCookieOptions());
    return response;
  } catch {
    return NextResponse.json(
      { message: "Verifikasi keamanan sedang tidak tersedia." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
