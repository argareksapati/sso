import type { Metadata } from "next";
import { AccountHero, AccountPage, Panel, accountStyles as styles } from "@/components/account/account-ui";
import { NotificationPreferences } from "@/components/account/notification-preferences";
import { MaterialIcon } from "@/components/ui/material-icon";

export const metadata: Metadata = { title: "Preferensi Notifikasi" };

export default function NotificationsPage() {
  return (
    <AccountPage settings title="Preferensi Notifikasi" description="Kelola detail profil, pengaturan keamanan, dan lihat riwayat aktivitas penggunaan akun SSO Anda.">
      <AccountHero className={styles.notificationHero} eyebrow="Komunikasi & peringatan" title="Preferensi Notifikasi" description="Atur saluran penerimaan notifikasi seperti Email dan WhatsApp untuk aktivitas keamanan dan pembaruan sistem SSO." materialIcon="notifications_active" stat={<div className={styles.protectionStat}><MaterialIcon name="notifications_active" size={20} /><span>Saluran aktif</span><strong>3 Saluran Aktif</strong></div>} />
      <Panel className={styles.notificationSummaryPanel} title="Ringkasan Saluran" description="Ringkasan saluran komunikasi yang terhubung dengan akun Anda." materialIcon="notifications">
        <div className={styles.channelGrid}>
          <div className={styles.channel}><small>Email</small><span>Login, keamanan, &amp; pembaruan.</span><span className={styles.channelState}><MaterialIcon name="mail" size={15} /> Aktif</span></div>
          <div className={styles.channel}><small>WhatsApp</small><span>Peringatan penting ke nomor aktif.</span><span className={styles.channelState}><MaterialIcon name="chat" size={15} /> Terhubung</span></div>
          <div className={styles.channel}><small>In-app</small><span>Notifikasi langsung di portal SSO.</span><span className={styles.channelState}><MaterialIcon name="notifications" size={15} /> Aktif</span></div>
        </div>
      </Panel>
      <Panel className={styles.notificationPreferencesPanel} title="Pengaturan Saluran" description="Atur jenis notifikasi spesifik sesuai preferensi Anda." materialIcon="tune">
        <NotificationPreferences />
      </Panel>
    </AccountPage>
  );
}
