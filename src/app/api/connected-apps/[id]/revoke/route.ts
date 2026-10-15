import { NextRequest, NextResponse } from "next/server";

import { recordAuditEvent } from "@/lib/audit";
import {
  connectedAppsCookieOptions,
  CONNECTED_APPS_COOKIE,
  encodeRevokedApplicationIds,
  getRevokedApplicationIds,
} from "@/lib/auth/connected-app-store";
import { isSameOriginRequest } from "@/lib/auth/same-origin";
import { getSession } from "@/lib/auth/session";
import { listExistingSsoCatalog } from "@/lib/services/repository";

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ message: "Sesi Anda telah berakhir." }, { status: 401 });
  if (!isSameOriginRequest(request)) return NextResponse.json({ message: "Permintaan tidak dapat diproses." }, { status: 403 });

  const { id } = await context.params;
  const catalog = await listExistingSsoCatalog();
  if (!catalog.some((application) => application.id === id)) {
    return NextResponse.json({ message: "Aplikasi tidak ditemukan." }, { status: 404 });
  }

  const revokedIds = await getRevokedApplicationIds(session);
  const response = NextResponse.json({ message: "Akses aplikasi berhasil dicabut.", id });
  response.cookies.set(
    CONNECTED_APPS_COOKIE,
    encodeRevokedApplicationIds(session.subject, [...revokedIds, id]),
    connectedAppsCookieOptions(),
  );
  response.headers.set("Cache-Control", "no-store");
  await recordAuditEvent("CONNECTED_APP_REVOKED");
  return response;
}
