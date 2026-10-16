import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { MaterialIcon } from "@/components/ui/material-icon";
import { getRevokedApplicationIds } from "@/lib/auth/connected-app-store";
import { getSession } from "@/lib/auth/session";
import { getStoredProfile } from "@/lib/profile/profile-store";
import { listExistingSsoCatalog } from "@/lib/services/repository";
import styles from "./profile.module.css";

export const metadata: Metadata = { title: "Profil Saya" };

const actions = [
  { href: "/portal/pengaturan/profil", title: "Kelola Profil", text: "Update nama lengkap, data dasar, dan informasi privasi.", icon: "account_circle" },
  { href: "/portal/pengaturan/password", title: "Kata Sandi", text: "Perbarui password akun Anda secara berkala agar aman.", icon: "lock_reset" },
  { href: "/portal/pengaturan/aktivitas", title: "Log Aktivitas", text: "Pantau histori penggunaan akun di setiap aplikasi.", icon: "history" },
  { href: "/portal/pengaturan/sesi", title: "Sesi Perangkat", text: "Lihat dan logout sesi aktif di HP atau browser lain.", icon: "devices" },
  { href: "/portal/pengaturan/aplikasi", title: "Koneksi Aplikasi", text: "Kelola otorisasi akses client SSO yang telah disetujui.", icon: "hub" },
  { href: "/portal/pengaturan/notifikasi", title: "Notifikasi", text: "Atur preferensi info masuk via Email atau WA.", icon: "notifications" },
] as const;

function initials(displayName: string) {
  return displayName.split(/\s+/).filter(Boolean).slice(0, 2).map((word) => word[0]).join("").toUpperCase();
}

function formatLogin(issuedAt: number) {
  const elapsedSeconds = Math.max(0, Math.floor(Date.now() / 1000) - issuedAt);
  if (elapsedSeconds < 60) return "Baru saja";
  if (elapsedSeconds < 3_600) return `${Math.floor(elapsedSeconds / 60)} menit lalu`;
  if (elapsedSeconds < 86_400) return `${Math.floor(elapsedSeconds / 3_600)} jam lalu`;
  return `${Math.floor(elapsedSeconds / 86_400)} hari lalu`;
}

function formatLoginDate(issuedAt: number) {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "short",
    timeStyle: "medium",
    timeZone: "Asia/Jakarta",
  }).format(new Date(issuedAt * 1_000));
}

export default async function PortalPage() {
  const session = await getSession();
  if (!session) return null;

  const [catalog, profile, revokedIds] = await Promise.all([
    listExistingSsoCatalog(),
    getStoredProfile(session),
    getRevokedApplicationIds(session),
  ]);
  const primaryService = catalog.find((service) => service.id === "bandung-citizen-journalism") ?? catalog[0];
  const connectedCount = revokedIds.includes(primaryService.id) ? 0 : 1;
  const email = session.email || profile.contactEmail || "Email belum ditambahkan";
  const recentLogin = formatLogin(session.issuedAt);

  return (
    <div className={styles.profilePage}>
      <section className={styles.identityCard} aria-labelledby="profile-title">
        <div className={styles.colorRail} aria-hidden="true"><span /><span /><span /></div>
        <div className={styles.identityCardInner}>
          <div className={styles.identityMain}>
            <span className={styles.avatar} aria-hidden="true">
              <span>{initials(session.displayName)}</span>
              <small><MaterialIcon name="check" size={15} /></small>
            </span>
            <div className={styles.identityCopy}>
              <h1 id="profile-title">{session.displayName}</h1>
              <p>ID Pengguna: <strong>{profile.username}</strong></p>
              <div className={styles.identityBadges}>
                <span><MaterialIcon name="mail" size={15} />{email}</span>
                <span className={styles.verified}><MaterialIcon name="verified" size={15} /> Email Terverifikasi</span>
              </div>
            </div>
          </div>
          <div className={styles.identityStats}>
            <div><small>Sesi Login</small><strong>{recentLogin}</strong></div>
            <div><small>Layanan SSO</small><strong>{connectedCount} Terhubung</strong></div>
          </div>
        </div>
      </section>

      <div className={styles.dashboardGrid}>
        <div className={styles.dashboardColumn}>
          <section className={styles.surfaceCard} aria-labelledby="quick-actions-title">
            <header className={styles.sectionHeader}>
              <h2 id="quick-actions-title">Pengaturan &amp; Layanan Profil</h2>
              <p>Akses cepat pengelolaan akun dan preferensi Anda</p>
            </header>
            <div className={styles.quickGrid}>
              {actions.map(({ href, title, text, icon }) => (
                <Link className={styles.quickAction} href={href} key={href}>
                  <span className={styles.quickIcon}><MaterialIcon name={icon} size={22} /></span>
                  <span><strong>{title}</strong><small>{text}</small></span>
                </Link>
              ))}
            </div>
          </section>

          <section className={styles.surfaceCard} aria-labelledby="latest-login-title">
            <header className={styles.sectionHeaderInline}>
              <div><h2 id="latest-login-title">Terakhir Login</h2><p>Histori integrasi Single Sign On yang paling baru Anda gunakan.</p></div>
              <span className={styles.greenPill}>{connectedCount} Layanan Aktif</span>
            </header>
            <div className={styles.latestLogin}>
              <div className={styles.loginService}>
                <span className={styles.serviceLogo} aria-hidden="true">
                  {primaryService.logoPath
                    ? <Image src={primaryService.logoPath} alt="" width={48} height={48} sizes="48px" />
                    : initials(primaryService.name)}
                </span>
                <div>
                  <span className={styles.applicationLabel}>Aplikasi diakses • v1.2-OAuth</span>
                  <h3>{primaryService.name}</h3>
                  <p data-testid="latest-login-meta">{formatLoginDate(session.issuedAt)} | IP: 182.253.xx.xx</p>
                </div>
              </div>
              <span className={styles.lastSeen}>{recentLogin}</span>
            </div>
          </section>
        </div>

        <div className={styles.dashboardColumn}>
          <section className={styles.surfaceCard} aria-labelledby="usage-title">
            <header className={styles.sectionHeader}>
              <h2 id="usage-title">Frekuensi Penggunaan Layanan</h2>
              <p>Aplikasi yang paling sering diakses dengan SSO Anda.</p>
            </header>
            <div className={styles.frequencyList}>
              <div className={styles.frequencyItem}>
                <div className={styles.frequencyMeta}><span><i />{primaryService.name}</span><strong>{connectedCount} Akses ({connectedCount ? 100 : 0}%)</strong></div>
                <span className={styles.progressTrack}><i style={{ width: connectedCount ? "100%" : "0%" }} /></span>
              </div>
              <div className={styles.frequencyItem} data-muted="true">
                <div className={styles.frequencyMeta}><span><i />Sadayana Bandung</span><strong>0 Akses (0%)</strong></div>
                <span className={styles.progressTrack}><i /></span>
              </div>
              <div className={styles.frequencyItem} data-muted="true">
                <div className={styles.frequencyMeta}><span><i />Salaman (Adminduk)</span><strong>0 Akses (0%)</strong></div>
                <span className={styles.progressTrack}><i /></span>
              </div>
            </div>
            <div className={styles.usageTotal}><span>Total Aktivitas SSO</span><strong>{connectedCount} Catatan Sesi</strong></div>
          </section>

          <aside className={styles.securityNote}>
            <span className={styles.securityIcon}><MaterialIcon name="shield" size={20} /></span>
            <p><strong>Enkripsi SHA-256 Aktif</strong><span>Identitas Anda terlindungi protokol keamanan Sandi Siber Diskominfo.</span></p>
          </aside>
        </div>
      </div>

      <section className={styles.nextStep}>
        <div><small>Langkah berikutnya</small><h2>Lengkapi profil dan tingkatkan keamanan akun Anda</h2><p>Perbarui data kependudukan NIK/NIP, ubah sandi berkala, atau atur otentikasi ganda.</p></div>
        <div><Link className={styles.secondaryButton} href="/portal/pengaturan/profil">Kelola Profil</Link><Link className={styles.primaryButton} href="/portal/pengaturan/password">Ubah Password</Link></div>
      </section>
    </div>
  );
}
