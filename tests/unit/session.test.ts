import { beforeAll, describe, expect, it } from "vitest";

import { createSessionToken, verifySessionToken } from "@/lib/auth/session-token";

beforeAll(() => {
  process.env.AUTH_SESSION_SECRET = "unit-test-session-secret-with-at-least-32-characters";
});

describe("application session", () => {
  it("creates and verifies a signed session", () => {
    const { token } = createSessionToken({ subject: "test-subject", displayName: "Pengguna Uji", roles: ["citizen"] }, false);
    expect(verifySessionToken(token)).toMatchObject({ subject: "test-subject", roles: ["citizen"] });
  });

  it("rejects a tampered session", () => {
    const { token } = createSessionToken({ subject: "test-subject", displayName: "Pengguna Uji", roles: ["citizen"] }, false);
    expect(verifySessionToken(`${token}x`)).toBeNull();
  });
});
