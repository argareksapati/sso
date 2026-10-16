import type { Metadata } from "next";
import Image from "next/image";

import { AccountPage, accountStyles as styles } from "@/components/account/account-ui";
import { MaterialIcon } from "@/components/ui/material-icon";
import { getSession } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Log Aktivitas" };

export default async function ActivityPage() {
  const session = await getSession();
  if (!session) return null;

  return (
    <AccountPage settings title="Log Aktivitas" description="Kelola detail profil, pengaturan keamanan, dan lihat riwayat aktivitas penggunaan akun SSO Anda.">
      <section className={styles.activityHero}>
        <span className={styles.accentLine} aria-hidden="true"><i /><i /><i /></span>
        <div className={styles.activityHeroCopy}>
          <span className={styles.activityEyebrow}><MaterialIcon name="shield" size={14} />Keamanan &amp; audit</span>
          <h2>Log Aktivitas OAuth</h2>
          <p>Ringkasan layanan yang pernah Anda buka, aktivitas akses terbaru, dan statistik frekuensi otentikasi akun SSO.</p>
        </div>
        <div className={styles.activityStats}>
          <span>1 Layanan</span>
          <span>1 Kunjungan</span>
          <span><MaterialIcon name="schedule" size={14} />Aktif: 07 Sep 2026, 05.04</span>
        </div>
      </section>

      <div className={styles.activityGrid}>
        <section className={styles.activityCard}>
          <header className={styles.activityCardHeader}>
            <span><MaterialIcon name="bar_chart" size={20} /></span>
            <div><h2>Total Kunjungan</h2><p>Frekuensi akses layanan terhubung</p></div>
          </header>
          <div className={styles.activityEntry}>
            <div className={styles.activityServiceRow}>
              <div className={styles.activityServiceIdentity}>
                <span className={styles.activityLogo}><Image src="/services/bcj.png" alt="Logo BCJ" width={28} height={28} /></span>
                <strong>Bandung Citizen Journalism</strong>
                <small>SSO</small>
              </div>
              <b>1 kali</b>
            </div>
            <div className={styles.activityProgress}><i /></div>
            <div className={styles.activityProgressMeta}><span>100% dari total akses</span><strong>1 / 1</strong></div>
          </div>
        </section>

        <section className={styles.activityCard}>
          <header className={styles.activityCardHeader}>
            <span><MaterialIcon name="history_edu" size={20} /></span>
            <div><h2>Histori Akses</h2><p>Catatan aktivitas login dan verifikasi client</p></div>
          </header>
          <div className={styles.activityEntry}>
            <div className={styles.activityAuditRow}>
              <div><small>OAuth client</small><code>IP: 182.10.98.193</code></div>
              <strong><MaterialIcon name="check_circle" size={14} />Otorisasi berhasil</strong>
            </div>
            <div className={styles.activityAuditService}>
              <span className={styles.activityLogo}><Image src="/services/bcj.png" alt="Logo BCJ" width={24} height={24} /></span>
              <strong>Bandung Citizen Journalism</strong>
            </div>
            <div className={styles.activityDate}><MaterialIcon name="calendar_today" size={14} /><span>07 Sep 2026, 05.04</span></div>
          </div>
        </section>
      </div>

      <div className={styles.activityPagination}>
        <span><MaterialIcon name="sync" size={16} />Halaman aktivitas SSO</span>
        <div><button type="button" disabled>« Sebelumnya</button><button type="button" aria-current="page">1</button><button type="button" disabled>Selanjutnya »</button></div>
      </div>
    </AccountPage>
  );
}
