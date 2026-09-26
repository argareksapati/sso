import type { Metadata } from "next";
import Link from "next/link";
import { Activity, AppWindow, ArrowRight, Bell, KeyRound, MonitorSmartphone, ShieldCheck, UserRound } from "lucide-react";

import { AccountPage, Panel, Status, accountStyles as styles } from "@/components/account/account-ui";
import { ServiceIdentity } from "@/components/services/service-identity";
import { getSession } from "@/lib/auth/session";
import { listExistingSsoCatalog } from "@/lib/services/repository";

export const metadata: Metadata = { title: "Profil Saya" };

function initials(displayName: string) {
  return displayName.split(/\s+/).slice(0, 2).map((word) => word[0]).join("").toUpperCase();
}
const actions = [
  { href: "/portal/pengaturan/profil", title: "Kelola Profil", text: "Lihat data dasar dan informasi identitas akun.", icon: UserRound },
  { href: "/portal/pengaturan/password", title: "Kata Sandi", text: "Tinjau status integrasi pengelolaan kredensial.", icon: KeyRound },
  { href: "/portal/pengaturan/aktivitas", title: "Log Aktivitas", text: "Pantau histori autentikasi yang tersedia.", icon: Activity },
  { href: "/portal/pengaturan/sesi", title: "Sesi Perangkat", text: "Lihat dan akhiri sesi aktif pada browser ini.", icon: MonitorSmartphone },
  { href: "/portal/pengaturan/aplikasi", title: "Koneksi Aplikasi", text: "Kelola otorisasi client SSO yang tercatat.", icon: AppWindow },
  { href: "/portal/pengaturan/notifikasi", title: "Notifikasi", text: "Tinjau rancangan preferensi pemberitahuan.", icon: Bell },
] as const;

export default async function PortalPage() {
  const session = await getSession();
  const catalog = await listExistingSsoCatalog();
  if (!session) return null;
  const example = catalog[0];

  return (
    <AccountPage title="Profil Saya" description="Kelola detail profil, pengaturan keamanan, dan lihat riwayat aktivitas penggunaan akun.">
      <section className={`${styles.hero} ${styles.profileHero}`}>
        <div className={styles.profileIdentity}>
          <span className={styles.profileAvatar} aria-hidden="true">{initials(session.displayName)}</span>
          <div className={styles.profileName}>
            <small>Akun pengguna</small>
            <strong>{session.displayName}</strong>
            <span>Identitas Google · sesi terverifikasi</span>
          </div>
        </div>
        <div className={styles.profileStats}>
          <div><small>Login terakhir</small><strong>Sesi ini</strong></div>
          <div><small>Layanan</small><strong>0 aktif</strong></div>
          <div><small>Aktivitas</small><strong>1 catatan</strong></div>
        </div>
      </section>

      <div className={styles.dashboardGrid}>
        <div className={styles.dashboardColumn}>
          <Panel title="Aksi Cepat" description="Buka pengaturan akun tanpa navigasi manual.">
            <div className={styles.quickGrid}>
              {actions.map(({ href, title, text, icon: Icon }) => (
                <Link className={styles.quickAction} href={href} key={href}>
                  <Icon size={20} aria-hidden="true" /><ArrowRight size={17} aria-hidden="true" />
                  <strong>{title}</strong><span>{text}</span>
                </Link>
              ))}
            </div>
          </Panel>

          <Panel title="Terakhir Login" description="Histori Single Sign On paling baru pada lingkungan ini.">
            <div className={styles.loginItem}>
              <ServiceIdentity name={example.name} detail="Referensi katalog · belum menjadi client aktif" logoPath={example.logoPath} />
              <Status tone="info">Sesi ini</Status>
            </div>
          </Panel>
        </div>

        <div className={styles.dashboardColumn}>
          <Panel title="Frekuensi Penggunaan" description="Distribusi aplikasi yang pernah diakses.">
            <div className={styles.donut}><div className={styles.donutLabel}><strong>0%</strong><span>0 akses client</span></div></div>
            <div className={styles.usageItem}><span>Belum ada client layanan terhubung</span><Status tone="success">Google OAuth aktif</Status></div>
          </Panel>
          <div className={styles.callout}><ShieldCheck size={20} aria-hidden="true" /><p><strong>Autentikasi Google aktif.</strong><br />Sesi masuk diproses melalui Supabase OAuth dan dilindungi token aplikasi.</p></div>
        </div>
      </div>

      <section className={styles.cta}>
        <div><span className={styles.eyebrow}>Langkah berikutnya</span><h2>Lengkapi sumber profil dan kebijakan akun</h2><p>Data kependudukan, email, serta autentikasi tambahan akan mengikuti keputusan master identity.</p></div>
        <div className={styles.actions}><Link className={styles.buttonSecondary} href="/portal/pengaturan/profil">Kelola Profil</Link><Link className={styles.button} href="/portal/pengaturan/password">Kata Sandi</Link></div>
      </section>
    </AccountPage>
  );
}
