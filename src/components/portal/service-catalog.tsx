"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

import { MaterialIcon } from "@/components/ui/material-icon";
import type { ExistingCatalogEntry, ServiceCategory } from "@/lib/services/repository";
import styles from "@/app/portal/layanan/catalog.module.css";

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

function CatalogIcon({ id }: { id: string }) {
  if (id === "bandung-smart-map-plus") return <MaterialIcon name="map" size={24} />;
  if (id === "bandung-kita") return <MaterialIcon name="newspaper" size={24} />;
  return <MaterialIcon name="account_balance" size={24} />;
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
            <p>Akses seluruh portal resmi pelayanan publik, informasi data terbuka, dan aplikasi operasional Pemerintah Kota Bandung menggunakan satu akun terverifikasi.</p>
          </div>
          <div className={styles.totalServices}><small>Total Layanan</small><strong>{services.length} Aplikasi</strong></div>
        </div>

        <div className={styles.catalogTools}>
          <label className={styles.searchField}>
            <span className="sr-only">Cari layanan</span>
            <MaterialIcon name="search" size={20} />
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

      <span className="sr-only" role="status" aria-live="polite">{visibleServices.length} layanan ditemukan</span>

      {visibleServices.length > 0 ? (
        <section className={styles.serviceGrid} aria-label="Daftar aplikasi SSO">
          {visibleServices.map((service) => (
            <article className={styles.serviceCard} key={service.id}>
              <div>
                <div className={styles.serviceTop}>
                  <span className={styles.serviceLogo} data-service-id={service.id} aria-hidden="true">
                    {service.logoPath
                      ? <Image src={service.logoPath} alt="" width={48} height={48} sizes="48px" />
                      : <CatalogIcon id={service.id} />}
                  </span>
                  <span className={styles.categoryBadge} data-category={service.category}>{categoryLabels[service.category]}</span>
                </div>
                <h2>{service.name}</h2>
                <p>{service.description}</p>
              </div>
              <footer className={styles.serviceFooter}>
                <span className={styles.connected}><i /> Terhubung SSO</span>
                <a
                  href={service.sourceUrl ?? "#"}
                  target={service.sourceUrl ? "_blank" : undefined}
                  rel={service.sourceUrl ? "noopener noreferrer" : undefined}
                  onClick={service.sourceUrl ? undefined : (event) => event.preventDefault()}
                >
                  Buka <MaterialIcon name="arrow_forward" size={14} />
                </a>
              </footer>
            </article>
          ))}
        </section>
      ) : (
        <section className={styles.catalogEmpty}>
          <MaterialIcon name="search_off" size={34} />
          <h2>Layanan Tidak Ditemukan</h2>
          <p>Coba gunakan kata kunci pencarian lain atau ganti kategori filter.</p>
        </section>
      )}
    </>
  );
}
