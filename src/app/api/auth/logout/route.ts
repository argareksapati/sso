import { NextResponse } from "next/server";

import { recordAuditEvent } from "@/lib/audit";
import { isSameOriginRequest } from "@/lib/auth/same-origin";
import { SESSION_COOKIE, sessionCookieOptions } from "@/lib/auth/session";

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ message: "Permintaan tidak dapat diproses." }, { status: 403 });
  }

  const response = NextResponse.json({ redirectTo: "/login" });
  response.cookies.set(SESSION_COOKIE, "", { ...sessionCookieOptions(), maxAge: 0 });
  await recordAuditEvent("LOGOUT");
  return response;
}
