import { describe, expect, it } from "vitest";

import { listIntegrationCandidates } from "@/lib/services/repository";

describe("integration inventory", () => {
  it("memuat kandidat yang diberikan tanpa mengaktifkan launch URL", async () => {
    const services = await listIntegrationCandidates();

    expect(services).toHaveLength(6);
    expect(services.map((service) => service.id)).toContain("sipetruk");
    expect(services.map((service) => service.id)).toContain("simpelman");
    expect(services.every((service) => !("href" in service))).toBe(true);
  });

  it("memiliki identifier unik", async () => {
    const services = await listIntegrationCandidates();
    expect(new Set(services.map((service) => service.id)).size).toBe(services.length);
  });
});
