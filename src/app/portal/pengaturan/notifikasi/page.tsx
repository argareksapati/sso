import type { Metadata } from "next";
import { Bell, Mail, MessageSquare, SlidersHorizontal } from "lucide-react";

import { AccountHero, AccountPage, Panel, accountStyles as styles } from "@/components/account/account-ui";
import { NotificationPreferences } from "@/components/account/notification-preferences";

export const metadata: Metadata = { title: "Preferensi Notifikasi" };

export default function NotificationsPage() {
  return (
    <AccountPage settings title="Preferensi Notifikasi" description="Atur peringatan keamanan dan pembaruan sistem untuk akun SSO Anda.">
      <AccountHero eyebrow="Komunikasi & peringatan" title="Preferensi Notifikasi" description="Pilih saluran penerimaan notifikasi untuk aktivitas keamanan dan pembaruan sistem SSO." icon={Bell} stat={<><span>Saluran aktif</span><strong>3 saluran</strong></>} />
      <Panel title="Ringkasan Saluran" description="Ringkasan saluran komunikasi yang terhubung dengan akun Anda." icon={Bell}>
        <div className={styles.channelGrid}>
          <div className={styles.channel}><small>Email</small><span>Login, keamanan, dan pembaruan.</span><span className={styles.channelState}><Mail size={15} aria-hidden="true" /> Aktif</span></div>
          <div className={styles.channel}><small>WhatsApp</small><span>Peringatan penting ke nomor aktif.</span><span className={styles.channelState}><MessageSquare size={15} aria-hidden="true" /> Terhubung</span></div>
          <div className={styles.channel}><small>In-app</small><span>Notifikasi langsung di portal SSO.</span><span className={styles.channelState}><Bell size={15} aria-hidden="true" /> Aktif</span></div>
        </div>
      </Panel>
      <Panel title="Pengaturan Saluran" description="Atur jenis notifikasi sesuai preferensi Anda." icon={SlidersHorizontal}>
        <NotificationPreferences />
      </Panel>
    </AccountPage>
  );
}
