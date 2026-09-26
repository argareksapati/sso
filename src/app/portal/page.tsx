import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";

import { listConfiguredServices } from "@/lib/services/repository";
import styles from "./portal.module.css";

export const metadata: Metadata = { title: "Portal layanan" };

export default async function PortalPage() {
  const services = await listConfiguredServices();
  return (
    <div className={styles.content}>
      <header className={styles.pageHeader}>
        <p className={styles.eyebrow}>Portal layanan</p>
        <h1>Pilih layanan yang Anda perlukan</h1>
        <p>Layanan akan ditampilkan berdasarkan integrasi dan akses akun yang telah disetujui.</p>
      </header>

      <section className={styles.directory} aria-labelledby="service-heading">
        <div className={styles.sectionHeader}>
          <div>
            <h2 id="service-heading">Layanan terhubung</h2>
            <p>{services.length} layanan tersedia pada lingkungan ini.</p>
          </div>
          <label className={styles.search}>
            <Search size={19} aria-hidden="true" />
            <span className="sr-only">Cari layanan</span>
            <input type="search" placeholder="Cari layanan" disabled={services.length === 0} />
          </label>
        </div>

        {services.length === 0 ? (
          <div className={styles.empty}>
            <h3>Belum ada layanan yang dikonfigurasi</h3>
            <p>Daftar layanan akan tersedia setelah inventory dan aplikasi pilot disetujui oleh PIC.</p>
          </div>
        ) : (
          <ul className={styles.services}>
            {services.map((service) => (
              <li key={service.id}>
                <div><span>{service.category}</span><h3>{service.name}</h3><p>{service.description}</p></div>
                <Link href={service.href}>Buka layanan <ArrowRight size={17} aria-hidden="true" /></Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <aside className={styles.help}>
        <div><h2>Kesulitan menemukan layanan?</h2><p>Informasi bantuan resmi dan kontak dukungan masih menunggu konfirmasi PIC.</p></div>
        <Link href="/bantuan">Lihat bantuan</Link>
      </aside>
    </div>
  );
}
