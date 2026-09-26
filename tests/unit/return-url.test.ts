import { describe, expect, it } from "vitest";

import { normalizeReturnUrl } from "@/lib/auth/return-url";

describe("normalizeReturnUrl", () => {
  it("keeps a local application path", () => {
    expect(normalizeReturnUrl("/portal/layanan?category=publik")).toBe("/portal/layanan?category=publik");
  });

  it.each([
    "https://evil.example/path",
    "//evil.example/path",
    "/\\evil.example",
    "/api/auth/logout",
    "/login",
    "javascript:alert(1)",
    undefined,
  ])("rejects unsafe return URL %s", (value) => {
    expect(normalizeReturnUrl(value)).toBe("/portal");
  });
});
