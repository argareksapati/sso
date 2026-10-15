import { createHmac, randomInt, randomUUID, timingSafeEqual } from "node:crypto";

type ChallengePayload = {
  answer: number;
  expiresAt: number;
  nonce: string;
};

export const LOGIN_CHALLENGE_COOKIE = "sso_login_challenge";
const CHALLENGE_TTL_SECONDS = 5 * 60;

function secret() {
  const value = process.env.AUTH_SESSION_SECRET;
  if (!value || value.length < 32) {
    throw new Error("AUTH_SESSION_SECRET minimal 32 karakter belum dikonfigurasi.");
  }
  return value;
}

function sign(payload: string) {
  return createHmac("sha256", secret()).update(`login-challenge:${payload}`, "utf8").digest("base64url");
}

export function challengeCookieOptions(maxAge = CHALLENGE_TTL_SECONDS) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/api/auth/login",
    maxAge,
  };
}

export function createLoginChallenge(now = Date.now()) {
  const left = randomInt(1, 10);
  const right = randomInt(1, 10);
  const expiresAt = Math.floor(now / 1000) + CHALLENGE_TTL_SECONDS;
  const payload = Buffer.from(JSON.stringify({ answer: left + right, expiresAt, nonce: randomUUID() } satisfies ChallengePayload), "utf8").toString("base64url");
  return { left, right, token: `${payload}.${sign(payload)}` };
}

export function verifyLoginChallenge(token: string | undefined, answer: number, now = Date.now()) {
  if (!token || !Number.isInteger(answer)) return false;
  const [payload, signature, extra] = token.split(".");
  if (!payload || !signature || extra) return false;

  const expected = Buffer.from(sign(payload), "utf8");
  const received = Buffer.from(signature, "utf8");
  if (expected.length !== received.length || !timingSafeEqual(expected, received)) return false;

  try {
    const challenge = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as ChallengePayload;
    return (
      typeof challenge.nonce === "string" &&
      typeof challenge.expiresAt === "number" &&
      challenge.expiresAt >= Math.floor(now / 1000) &&
      challenge.answer === answer
    );
  } catch {
    return false;
  }
}
