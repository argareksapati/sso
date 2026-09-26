import { describe, expect, it } from "vitest";

import { sessionCookieOptions } from "@/lib/auth/session-cookie";

describe("sessionCookieOptions", () => {
  it("mengaktifkan flag cookie untuk production", () => {
    expect(sessionCookieOptions(undefined, true)).toEqual({
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
    });
  });

  it("mempertahankan expiry eksplisit", () => {
    expect(sessionCookieOptions(1_800_000_000, true).expires).toEqual(
      new Date(1_800_000_000 * 1000),
    );
  });
});
