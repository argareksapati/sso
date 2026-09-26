import type { Metadata } from "next";
import Link from "next/link";
import { Search } from "lucide-react";

import { AccountPage, Panel, Status, accountStyles as styles } from "@/components/account/account-ui";
import { listIntegrationCandidates } from "@/lib/services/repository";

export const metadata: Metadata = { title: "Semua layanan" };

export default async function ServicesPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const services = await listIntegrationCandidates();
  const { q = "" } = await searchParams;
  const query = q.trim().toLocaleLowerCase("id-ID");
  const visibleServices = query
    ? services.filter((service) => [service.name, service.description, service.category, service.owner]
      .some((value) => value.toLocaleLowerCase("id-ID").includes(query)))
    : services;
  return (
    <AccountPage
      eyebrow="Portal layanan"
      title="Pilih layanan yang Anda perlukan"
      description="Aplikasi akan dapat dibuka dari portal setelah pendaftaran client dan pengujian integrasi selesai."
    >
      <Panel>
        <div className={styles.stack}>
          <form action="/portal/layanan" method="get" role="search">
            <label className={styles.field}>
              <span className={styles.label}>Cari layanan</span>
              <span style={{ position: "relative", display: "block" }}>
                <Search size={18} aria-hidden="true" style={{ position: "absolute", left: 13, top: 14, color: "var(--ink-muted)" }} />
                <input name="q" type="search" defaultValue={q} placeholder="Nama layanan, instansi, atau kategori" style={{ paddingLeft: 42 }} />
              </span>
            </label>
          </form>
          <ul className={styles.list}>
            {visibleServices.map((service) => (
              <li className={styles.listItem} key={service.id}>
                <div>
                  <h3>{service.name}</h3>
                  <p>{service.description}</p>
                  <div className={styles.meta}><span>{service.category}</span><span>{service.owner}</span></div>
                </div>
                <Status tone={service.integrationState === "DISCOVERY" ? "info" : "warning"}>
                  {service.integrationState === "DISCOVERY" ? "Discovery" : "Review eksternal"}
                </Status>
              </li>
            ))}
          </ul>
          {visibleServices.length === 0 && (
            <div className={styles.empty}>
              <div><h3>Layanan tidak ditemukan</h3><p>Coba kata kunci lain atau hapus pencarian untuk melihat seluruh inventaris.</p></div>
            </div>
          )}
        </div>
      </Panel>
      <div className={styles.callout}>
        <p>Aplikasi Anda belum tercatat? Siapkan nama aplikasi, URL resmi, owner, dan PIC teknis lalu <Link href="/bantuan">lihat informasi bantuan</Link>.</p>
      </div>
    </AccountPage>
  );
}
