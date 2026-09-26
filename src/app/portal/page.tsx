import type { Metadata } from "next";
import Link from "next/link";
import { AppWindow, ArrowRight, CircleCheck, Clock3, ShieldCheck } from "lucide-react";

import { AccountPage, Panel, Status, accountStyles as styles } from "@/components/account/account-ui";
import { getSession } from "@/lib/auth/session";
import { listIntegrationCandidates } from "@/lib/services/repository";

export const metadata: Metadata = { title: "Beranda akun" };

function firstName(displayName: string) {
  return displayName.trim().split(/\s+/)[0] || displayName;
}

export default async function PortalPage() {
  const session = await getSession();
  const services = await listIntegrationCandidates();
  if (!session) return null;

  return (
    <AccountPage
      eyebrow="Beranda akun"
      title={`Selamat datang, ${firstName(session.displayName)}`}
      description="Kelola profil, keamanan akun, dan aplikasi layanan Kota Bandung dari satu tempat."
      action={<Link className={styles.button} href="/portal/layanan">Lihat semua layanan <ArrowRight size={17} aria-hidden="true" /></Link>}
    >
      <div className={styles.grid3}>
        <div className={styles.metric}>
          <span className={styles.metricIcon}><AppWindow size={20} aria-hidden="true" /></span>
          <strong>{services.length}</strong>
          <span>Kandidat aplikasi dalam inventaris integrasi</span>
        </div>
        <div className={styles.metric}>
          <span className={styles.metricIcon}><ShieldCheck size={20} aria-hidden="true" /></span>
          <strong>Aktif</strong>
          <span>Status sesi akun pada perangkat ini</span>
        </div>
        <div className={styles.metric}>
          <span className={styles.metricIcon}><Clock3 size={20} aria-hidden="true" /></span>
          <strong>1</strong>
          <span>Sesi terverifikasi yang dapat dilihat saat ini</span>
        </div>
      </div>

      <div className={styles.grid2}>
        <Panel title="Profil saya" description="Ringkasan identitas dari sesi autentikasi aktif.">
          <div className={styles.stack}>
            <div>
              <p className={styles.label}>Nama tampilan</p>
              <strong>{session.displayName}</strong>
            </div>
            <div>
              <p className={styles.label}>Status akun</p>
              <Status tone="success"><CircleCheck size={13} aria-hidden="true" /> Terautentikasi</Status>
            </div>
            <div>
              <p className={styles.label}>Sumber profil</p>
              <p style={{ margin: "4px 0 0", color: "var(--ink-muted)", fontSize: ".86rem" }}>
                Informasi lengkap akan mengikuti master identity setelah IdP final tersambung.
              </p>
            </div>
            <div className={styles.actions}>
              <Link className={styles.buttonSecondary} href="/portal/pengaturan/profil">Buka profil</Link>
            </div>
          </div>
        </Panel>

        <Panel title="Keamanan akun" description="Periksa sesi dan aktivitas akses akun Anda.">
          <ul className={styles.list}>
            <li className={styles.listItem}>
              <div><h3>Sesi perangkat</h3><p>Satu sesi aktif terdeteksi pada portal ini.</p></div>
              <Link href="/portal/pengaturan/sesi">Lihat</Link>
            </li>
            <li className={styles.listItem}>
              <div><h3>Log aktivitas</h3><p>Periksa waktu penerbitan sesi terakhir.</p></div>
              <Link href="/portal/pengaturan/aktivitas">Lihat</Link>
            </li>
            <li className={styles.listItem}>
              <div><h3>Kata sandi</h3><p>Dikelola oleh identity provider yang akan dipilih.</p></div>
              <Link href="/portal/pengaturan/password">Detail</Link>
            </li>
          </ul>
        </Panel>
      </div>

      <Panel title="Aplikasi layanan" description="Daftar awal dari inventaris integrasi; belum ada client production yang diaktifkan.">
        <ul className={styles.list}>
          {services.slice(0, 3).map((service) => (
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
      </Panel>
    </AccountPage>
  );
}
