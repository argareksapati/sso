import type { Metadata } from "next";
import Link from "next/link";

import { listIntegrationCandidates } from "@/lib/services/repository";
import styles from "./portal.module.css";

export const metadata: Metadata = { title: "Portal layanan" };

export default async function PortalPage() {
  const services = await listIntegrationCandidates();
  return (
    <div className={styles.content}>
      <header className={styles.pageHeader}>
        <p className={styles.eyebrow}>Portal layanan</p>
        <h1>Pilih layanan yang Anda perlukan</h1>
        <p>
          Daftar awal ini berasal dari arahan integrasi. Akses baru diaktifkan setelah aplikasi
          didaftarkan sebagai client dan seluruh pengujian selesai.
        </p>
      </header>

      <section className={styles.directory} aria-labelledby="service-heading">
        <div className={styles.sectionHeader}>
          <div>
            <h2 id="service-heading">Kandidat integrasi</h2>
            <p>{services.length} aplikasi tercatat untuk tahap discovery.</p>
          </div>
          <p className={styles.notice}>Belum terhubung ke production</p>
        </div>

        <ul className={styles.services}>
          {services.map((service) => (
            <li key={service.id}>
              <div className={styles.serviceMeta}>
                <span>{service.category}</span>
                <strong>{service.owner}</strong>
              </div>
              <div className={styles.serviceBody}>
                <div>
                  <h3>{service.name}</h3>
                  <p>{service.description}</p>
                </div>
                <span className={styles.status} data-state={service.integrationState}>
                  {service.integrationState === "DISCOVERY" ? "Discovery" : "Review eksternal"}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <aside className={styles.help}>
        <div><h2>Aplikasi Anda belum tercatat?</h2><p>Nama aplikasi, URL resmi, owner, dan PIC teknis perlu masuk ke inventaris integrasi.</p></div>
        <Link href="/bantuan">Lihat bantuan</Link>
      </aside>
    </div>
  );
}
