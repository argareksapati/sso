"use client";

import Image from "next/image";
import { ArrowRight, Grid2X2, Search, ShieldCheck } from "lucide-react";
import { useMemo, useState } from "react";

import type { ExistingCatalogEntry, ServiceCategory } from "@/lib/services/repository";
import styles from "@/app/portal/portal.module.css";

type CategoryFilter = "ALL" | ServiceCategory;

const categories: { value: CategoryFilter; label: string }[] = [
  { value: "ALL", label: "Semua" },
  { value: "PUBLIC", label: "Pelayanan Publik" },
  { value: "INTERNAL", label: "Internal Pemkot" },
  { value: "INNOVATION", label: "Inovasi & Data" },
];

const categoryLabels: Record<ServiceCategory, string> = {
  PUBLIC: "Publik",
  INTERNAL: "Internal",
  INNOVATION: "Inovasi & Data",
};

function initials(name: string) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
}

export function ServiceCatalog({ services, initialQuery = "" }: {
  services: ExistingCatalogEntry[];
  initialQuery?: string;
}) {
  const [query, setQuery] = useState(initialQuery.slice(0, 120));
  const [category, setCategory] = useState<CategoryFilter>("ALL");

  const visibleServices = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("id-ID");
    return services.filter((service) => {
      const matchesCategory = category === "ALL" || service.category === category;
      const matchesQuery = !normalized || [service.name, service.description, service.owner]
        .some((value) => value.toLocaleLowerCase("id-ID").includes(normalized));
      return matchesCategory && matchesQuery;
    });
  }, [category, query, services]);

  return (
    <>
      <section className={styles.catalogHero} aria-labelledby="services-title">
        <div className={styles.colorRail} aria-hidden="true"><span /><span /><span /></div>
        <div className={styles.catalogHeading}>
          <div>
            <span className={styles.ecosystemBadge}><i /> Ekosistem Terintegrasi SSO Kota Bandung</span>
            <h1 id="services-title">Daftar Layanan Aplikasi SSO</h1>
            <p>Akses portal pelayanan publik, data terbuka, dan aplikasi operasional Pemerintah Kota Bandung dari satu tempat.</p>
          </div>
          <div className={styles.totalServices}><small>Total Layanan</small><strong>{services.length} Aplikasi</strong></div>
        </div>

        <div className={styles.catalogTools}>
          <label className={styles.searchField}>
            <span className="sr-only">Cari layanan</span>
            <Search size={20} aria-hidden="true" />
            <input
              value={query}
              maxLength={120}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Cari nama aplikasi atau deskripsi layanan..."
              type="search"
            />
          </label>
          <div className={styles.filters} aria-label="Filter kategori layanan">
            {categories.map((item) => (
              <button
                type="button"
                key={item.value}
                aria-pressed={category === item.value}
                onClick={() => setCategory(item.value)}
              >
                {item.label}{item.value === "ALL" ? ` (${services.length})` : ""}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className={styles.resultsSummary} role="status" aria-live="polite">
        <span>{visibleServices.length} layanan ditemukan</span>
        {(query || category !== "ALL") && <button type="button" onClick={() => { setQuery(""); setCategory("ALL"); }}>Reset filter</button>}
      </div>

      {visibleServices.length > 0 ? (
        <section className={styles.serviceGrid} aria-label="Daftar aplikasi SSO">
          {visibleServices.map((service) => (
            <article className={styles.serviceCard} key={service.id}>
              <div>
                <div className={styles.serviceTop}>
                  <span className={styles.serviceLogo} aria-hidden="true">
                    {service.logoPath
                      ? <Image src={service.logoPath} alt="" width={48} height={48} sizes="48px" />
                      : <span>{initials(service.name)}</span>}
                  </span>
                  <span className={styles.categoryBadge} data-category={service.category}>{categoryLabels[service.category]}</span>
                </div>
                <h2>{service.name}</h2>
                <p>{service.description}</p>
              </div>
              <footer className={styles.serviceFooter}>
                <span className={service.sourceUrl ? styles.connected : styles.pending}>
                  <i /> {service.sourceUrl ? "Portal terverifikasi" : "Menunggu integrasi"}
                </span>
                {service.sourceUrl ? (
                  <a href={service.sourceUrl} target="_blank" rel="noopener noreferrer">
                    Buka <ArrowRight size={14} aria-hidden="true" />
                  </a>
                ) : <span className={styles.soon}>Segera</span>}
              </footer>
            </article>
          ))}
        </section>
      ) : (
        <section className={styles.catalogEmpty}>
          <Grid2X2 size={34} aria-hidden="true" />
          <h2>Layanan tidak ditemukan</h2>
          <p>Coba gunakan kata kunci lain atau tampilkan kembali seluruh kategori.</p>
          <button type="button" onClick={() => { setQuery(""); setCategory("ALL"); }}>Tampilkan semua layanan</button>
        </section>
      )}

      <aside className={styles.catalogSecurity}>
        <ShieldCheck size={20} aria-hidden="true" />
        <p>Tautan keluar hanya menggunakan alamat layanan resmi yang sudah tercatat pada katalog server.</p>
      </aside>
    </>
  );
}
