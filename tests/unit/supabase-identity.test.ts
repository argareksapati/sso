import { describe, expect, it } from "vitest";

import { mapSupabaseIdentity } from "../../src/lib/auth/supabase-identity";

describe("mapSupabaseIdentity", () => {
  it("memetakan subject, nama, dan role yang dipercaya dari app metadata", () => {
    expect(mapSupabaseIdentity({
      id: "user-123",
      email: "pengguna@example.test",
      user_metadata: { full_name: "Pengguna Bandung", roles: ["admin"] },
      app_metadata: { roles: ["citizen", "operator"] },
    })).toEqual({
      subject: "supabase:user-123",
      displayName: "Pengguna Bandung",
      roles: ["citizen", "operator"],
    });
  });

  it("tidak memakai role dari metadata yang dapat diubah pengguna", () => {
    expect(mapSupabaseIdentity({
      id: "user-456",
      email: "warga@example.test",
      user_metadata: { roles: ["admin"] },
    })).toEqual({
      subject: "supabase:user-456",
      displayName: "warga",
      roles: ["authenticated"],
    });
  });

  it("menolak user id kosong", () => {
    expect(() => mapSupabaseIdentity({ id: " " })).toThrow("Supabase user id tidak valid");
  });
});

