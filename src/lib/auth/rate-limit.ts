import { createHash } from "node:crypto";

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();
const WINDOW_MS = 60_000;
const MAX_ATTEMPTS = 8;

function privacyKey(value: string) {
  return createHash("sha256").update(value, "utf8").digest("hex");
}

export function consumeAuthAttempt(identifier: string, forwardedFor: string | null) {
  const now = Date.now();
  const clientHint = forwardedFor?.split(",")[0]?.trim() || "unknown";
  const key = privacyKey(`${clientHint}:${identifier.trim().toLocaleLowerCase("id-ID")}`);
  const current = buckets.get(key);

  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  current.count += 1;
  if (current.count <= MAX_ATTEMPTS) return { allowed: true, retryAfterSeconds: 0 };

  return {
    allowed: false,
    retryAfterSeconds: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
  };
}
