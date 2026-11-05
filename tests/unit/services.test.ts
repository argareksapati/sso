import { describe, expect, it } from "vitest";

import { listExistingSsoCatalog, listIntegrationCandidates } from "@/lib/services/repository";

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

  it("memuat katalog pengguna tanpa layanan ganda dan kandidat yang tidak diperlukan", async () => {
    const catalog = await listExistingSsoCatalog();

    expect(catalog).toHaveLength(10);
    expect(catalog.map((service) => service.id)).toContain("arimbi-bandung");
    expect(catalog.map((service) => service.id)).toContain("bsm-pro");
    expect(catalog.map((service) => service.id)).not.toContain("bandung-smart-map-plus");
    expect(catalog.map((service) => service.id)).not.toContain("perizinan-bandung");
    expect(catalog.map((service) => service.id)).not.toContain("ai-asisten-bandung");
    expect(catalog.map((service) => service.id)).not.toContain("management-pemdi");
    expect(new Set(catalog.map((service) => service.id)).size).toBe(catalog.length);
  });
});
