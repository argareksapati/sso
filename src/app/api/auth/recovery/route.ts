import { NextResponse } from "next/server";
import { z } from "zod";

import { recordAuditEvent } from "@/lib/audit";
import { getAuthProvider } from "@/lib/auth/provider";
import { consumeAuthAttempt } from "@/lib/auth/rate-limit";
import { isSameOriginRequest } from "@/lib/auth/same-origin";

const schema = z.object({ identifier: z.string().trim().min(1).max(254) });
const genericMessage = "Jika akun dapat dipulihkan, petunjuk berikutnya akan dikirim melalui channel yang terdaftar.";

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ message: "Permintaan tidak dapat diproses." }, { status: 403 });
  }

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ message: genericMessage });

  const rate = consumeAuthAttempt(`recovery:${parsed.data.identifier}`, request.headers.get("x-forwarded-for"));
  if (!rate.allowed) {
    return NextResponse.json(
      { message: "Terlalu banyak permintaan. Tunggu sebentar lalu coba lagi." },
      { status: 429, headers: { "Retry-After": String(rate.retryAfterSeconds) } },
    );
  }

  try {
    await getAuthProvider().requestPasswordRecovery(parsed.data.identifier);
    await recordAuditEvent("RECOVERY_REQUESTED");
  } catch {
    // Preserve the generic response so account/provider state is never disclosed.
  }

  return NextResponse.json({ message: genericMessage });
}
