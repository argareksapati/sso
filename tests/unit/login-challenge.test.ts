import { beforeEach, describe, expect, it } from "vitest";

import { createLoginChallenge, verifyLoginChallenge } from "@/lib/auth/login-challenge";

describe("login challenge", () => {
  beforeEach(() => {
    process.env.AUTH_SESSION_SECRET = "rahasia-pengujian-minimal-tiga-puluh-dua-karakter";
  });

  it("menerima jawaban benar selama challenge masih berlaku", () => {
    const now = Date.now();
    const challenge = createLoginChallenge(now);
    expect(verifyLoginChallenge(challenge.token, challenge.left + challenge.right, now + 1_000)).toBe(true);
  });

  it("menolak jawaban salah, token yang diubah, dan challenge kedaluwarsa", () => {
    const now = Date.now();
    const challenge = createLoginChallenge(now);
    expect(verifyLoginChallenge(challenge.token, challenge.left + challenge.right + 1, now)).toBe(false);
    expect(verifyLoginChallenge(`${challenge.token}x`, challenge.left + challenge.right, now)).toBe(false);
    expect(verifyLoginChallenge(challenge.token, challenge.left + challenge.right, now + 6 * 60_000)).toBe(false);
  });
});
