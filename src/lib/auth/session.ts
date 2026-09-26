import "server-only";

import { cookies } from "next/headers";

import { verifySessionToken } from "./session-token";

export { createSessionToken, verifySessionToken } from "./session-token";
export { sessionCookieOptions } from "./session-cookie";
export type { AppSession } from "./session-token";

export const SESSION_COOKIE = "sso_bandung_session";

export async function getSession() {
  const store = await cookies();
  return verifySessionToken(store.get(SESSION_COOKIE)?.value);
}
