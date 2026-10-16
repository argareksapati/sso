import type { Metadata } from "next";

import { AccountPage, accountStyles as styles } from "@/components/account/account-ui";
import { LogoutButton } from "@/components/portal/logout-button";
import { MaterialIcon } from "@/components/ui/material-icon";
import { getSession } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Sesi Perangkat" };

export default async function SessionsPage() {
  const session = await getSession();
  if (!session) return null;

  return (
    <AccountPage settings title="Sesi Perangkat" description="Kelola detail profil, pengaturan keamanan, dan lihat riwayat aktivitas penggunaan akun SSO Anda.">
      <section className={styles.sessionHero}>
        <span className={styles.accentLine} aria-hidden="true"><i /><i /><i /></span>
        <div className={styles.sessionHeroCopy}>
          <span className={styles.activityEyebrow}><MaterialIcon name="devices" size={14} />Manajemen perangkat</span>
          <h2>Sesi &amp; Perangkat Aktif</h2>
          <p>Pantau daftar perangkat dan peramban yang saat ini terhubung ke akun Anda. Segera putuskan sesi yang mencurigakan untuk keamanan.</p>
        </div>
        <div className={styles.sessionHeroStat}>
          <span><MaterialIcon name="devices" size={20} /></span>
          <div><small>Perangkat terhubung</small><strong>1 Perangkat Aktif</strong></div>
        </div>
      </section>

      <section className={styles.sessionPanel}>
        <header className={styles.sessionSummaryHeader}>
          <h2><MaterialIcon name="monitor" size={20} />Ringkasan Sesi</h2>
          <p>Lihat status perangkat terhubung dan perlindungan sesi Anda.</p>
        </header>
        <div className={styles.sessionMetrics}>
          <div><small>Total sesi</small><strong>1</strong><span><MaterialIcon name="check_circle" size={15} />1 sesi terverifikasi</span></div>
          <div><small>Sesi saat ini</small><strong>1</strong><span><i />Sedang digunakan</span></div>
          <div><small>Keamanan</small><strong><MaterialIcon name="shield" size={18} />Perlindungan Akun</strong><span>Cabut sesi asing segera.</span></div>
        </div>
      </section>

      <section className={styles.sessionPanel}>
        <header className={styles.sessionListHeader}>
          <h2><MaterialIcon name="laptop_mac" size={20} />Daftar Perangkat Aktif</h2>
          <span>1 perangkat ditemukan</span>
        </header>
        <div className={styles.sessionDevice}>
          <div className={styles.sessionDeviceIdentity}>
            <span className={styles.sessionDeviceIcon}><MaterialIcon name="desktop_windows" size={24} /></span>
            <div>
              <div className={styles.sessionDeviceTitle}><strong>Windows — Google Chrome</strong><span><i />Sesi Saat Ini</span></div>
              <p><MaterialIcon name="public" size={14} />IP: 182.10.100.55</p>
              <p><MaterialIcon name="schedule" size={14} />Terakhir aktif: 24/9/2026, 08.55.34 (Kota Bandung)</p>
            </div>
          </div>
          <LogoutButton label="Cabut Sesi" loadingLabel="Mencabut…" iconSize={16} className={styles.sessionRevoke} />
        </div>
        <div className={styles.sessionNotice}><MaterialIcon name="info" size={18} /><p>Jika Anda melihat perangkat atau aktivitas yang tidak Anda kenali, segera tekan <strong>Cabut Sesi</strong> dan ubah kata sandi SSO Anda untuk memastikan perlindungan penuh.</p></div>
      </section>
    </AccountPage>
  );
}
