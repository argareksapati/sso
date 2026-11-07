import { afterEach, describe, expect, it } from "vitest";

import { isAdministrativeIdentity } from "@/lib/auth/authorization";

afterEach(() => {
  delete process.env.SSO_ADMIN_EMAILS;
});

describe("administrative authorization", () => {
  it("menerima peran administratif yang didukung", () => {
    expect(isAdministrativeIdentity({ roles: ["admin"] })).toBe(true);
    expect(isAdministrativeIdentity({ roles: ["operator"] })).toBe(true);
    expect(isAdministrativeIdentity({ roles: ["sso_admin"] })).toBe(true);
  });

  it("menerima email yang sama persis dengan allowlist server", () => {
    process.env.SSO_ADMIN_EMAILS = "m.argareksapati21@gmail.com, adminssobandung@gmail.com";

    expect(isAdministrativeIdentity({ email: "M.Argareksapati21@gmail.com", roles: ["authenticated"] })).toBe(true);
    expect(isAdministrativeIdentity({ email: "adminssobandung@gmail.com", roles: ["authenticated"] })).toBe(true);
    expect(isAdministrativeIdentity({ email: "lain@gmail.com", roles: ["authenticated"] })).toBe(false);
    expect(isAdministrativeIdentity({ email: "m.argareksapati21@gmail.com.attacker.test", roles: ["authenticated"] })).toBe(false);
  });

  it("menjadikan allowlist sebagai satu-satunya sumber akses saat dikonfigurasi", () => {
    process.env.SSO_ADMIN_EMAILS = "m.argareksapati21@gmail.com";

    expect(isAdministrativeIdentity({ email: "akun.lain@gmail.com", roles: ["admin"] })).toBe(false);
    expect(isAdministrativeIdentity({ email: "m.argareksapati21@gmail.com", roles: ["authenticated"] })).toBe(true);
  });
});
