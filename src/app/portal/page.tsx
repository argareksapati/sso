import type { Metadata } from "next";
import Link from "next/link";
import {
  Activity,
  AppWindow,
  ArrowRight,
  Bell,
  Check,
  KeyRound,
  MonitorSmartphone,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import { ServiceIdentity } from "@/components/services/service-identity";
import { getSession } from "@/lib/auth/session";
import { listExistingSsoCatalog } from "@/lib/services/repository";
import styles from "./portal.module.css";

export const metadata: Metadata = { title: "Profil Saya" };

const actions = [
  { href: "/portal/pengaturan/profil", title: "Kelola Profil", text: "Perbarui data dasar dan informasi identitas akun.", icon: UserRound },
  { href: "/portal/pengaturan/password", title: "Kata Sandi", text: "Tinjau dan perbarui keamanan kredensial Anda.", icon: KeyRound },
  { href: "/portal/pengaturan/aktivitas", title: "Log Aktivitas", text: "Pantau histori autentikasi dan penggunaan akun.", icon: Activity },
  { href: "/portal/pengaturan/sesi", title: "Sesi Perangkat", text: "Lihat dan akhiri sesi pada perangkat yang aktif.", icon: MonitorSmartphone },
  { href: "/portal/pengaturan/aplikasi", title: "Koneksi Aplikasi", text: "Kelola otorisasi client SSO yang Anda setujui.", icon: AppWindow },
  { href: "/portal/pengaturan/notifikasi", title: "Notifikasi", text: "Atur preferensi pemberitahuan keamanan akun.", icon: Bell },
] as const;

function initials(displayName: string) {
  return displayName.split(/\s+/).filter(Boolean).slice(0, 2).map((word) => word[0]).join("").toUpperCase();
}

function safeAccountId(subject: string) {
  const normalized = subject.replace(/[^a-zA-Z0-9]/g, "");
  return `SSO-${normalized.slice(-10).toUpperCase() || "PENGGUNA"}`;
}

function formatLogin(issuedAt: number) {
  const elapsedSeconds = Math.max(0, Math.floor(Date.now() / 1000) - issuedAt);
  if (elapsedSeconds < 60) return "Baru saja";
  if (elapsedSeconds < 3_600) return `${Math.floor(elapsedSeconds / 60)} menit lalu`;
  if (elapsedSeconds < 86_400) return `${Math.floor(elapsedSeconds / 3_600)} jam lalu`;
  return `${Math.floor(elapsedSeconds / 86_400)} hari lalu`;
}

export default async function PortalPage() {
  const session = await getSession();
  const catalog = await listExistingSsoCatalog();
  if (!session) return null;

  const example = catalog[0];

  return (
    <div className={styles.profilePage}>
      <section className={styles.identityCard} aria-labelledby="profile-title">
        <div className={styles.colorRail} aria-hidden="true"><span /><span /><span /></div>
        <div className={styles.identityMain}>
          <span className={styles.avatar} aria-hidden="true">
            <span>{initials(session.displayName)}</span>
            <small><Check size={14} /></small>
          </span>
          <div className={styles.identityCopy}>
            <h1 id="profile-title">{session.displayName}</h1>
            <p>ID Pengguna: <strong>{safeAccountId(session.subject)}</strong></p>
            <div className={styles.identityBadges}>
              <span>Identitas akun SSO</span>
              <span className={styles.verified}><ShieldCheck size={15} /> Sesi terverifikasi</span>
            </div>
          </div>
        </div>
        <div className={styles.identityStats}>
          <div><small>Sesi Login</small><strong>Saat ini</strong></div>
          <div><small>Layanan SSO</small><strong>{catalog.length} tersedia</strong></div>
        </div>
      </section>

      <div className={styles.dashboardGrid}>
        <div className={styles.dashboardColumn}>
          <section className={styles.surfaceCard} aria-labelledby="quick-actions-title">
            <header className={styles.sectionHeader}>
              <h2 id="quick-actions-title">Pengaturan &amp; Layanan Profil</h2>
              <p>Akses cepat pengelolaan akun dan preferensi Anda.</p>
            </header>
            <div className={styles.quickGrid}>
              {actions.map(({ href, title, text, icon: Icon }) => (
                <Link className={styles.quickAction} href={href} key={href}>
                  <span className={styles.quickIcon}><Icon size={21} aria-hidden="true" /></span>
                  <span><strong>{title}</strong><small>{text}</small></span>
                  <ArrowRight className={styles.quickArrow} size={17} aria-hidden="true" />
                </Link>
              ))}
            </div>
          </section>

          <section className={styles.surfaceCard} aria-labelledby="latest-login-title">
            <header className={styles.sectionHeaderInline}>
              <div><h2 id="latest-login-title">Terakhir Login</h2><p>Histori Single Sign On paling baru pada lingkungan ini.</p></div>
              <span className={styles.greenPill}>Sesi aktif</span>
            </header>
            <div className={styles.latestLogin}>
              <ServiceIdentity name={example.name} detail="Portal layanan referensi SSO Kota Bandung" logoPath={example.logoPath} />
              <div className={styles.loginMeta}><strong>{formatLogin(session.issuedAt)}</strong><span>Sesi portal saat ini</span></div>
            </div>
          </section>
        </div>

        <div className={styles.dashboardColumn}>
          <section className={styles.surfaceCard} aria-labelledby="usage-title">
            <header className={styles.sectionHeader}>
              <h2 id="usage-title">Frekuensi Penggunaan Layanan</h2>
              <p>Statistik aplikasi terintegrasi yang pernah diakses.</p>
            </header>
            <div className={styles.donut} aria-label="Belum ada akses aplikasi tercatat">
              <div><strong>0%</strong><span>0 akses client</span></div>
            </div>
            <div className={styles.usageRow}><span>Belum ada client aktif</span><strong>{catalog.length} layanan tersedia</strong></div>
          </section>

          <aside className={styles.securityNote}>
            <ShieldCheck size={22} aria-hidden="true" />
            <p><strong>Sesi SSO terlindungi.</strong><br />Autentikasi menggunakan cookie aman, validasi origin, dan kebijakan CSP.</p>
          </aside>
        </div>
      </div>

      <section className={styles.nextStep}>
        <div><small>Langkah berikutnya</small><h2>Lengkapi profil dan tingkatkan keamanan akun Anda</h2><p>Tinjau data identitas, sesi perangkat, dan akses aplikasi secara berkala.</p></div>
        <div><Link className={styles.secondaryButton} href="/portal/pengaturan/profil">Kelola Profil</Link><Link className={styles.primaryButton} href="/portal/pengaturan/password">Kata Sandi</Link></div>
      </section>
    </div>
  );
}
