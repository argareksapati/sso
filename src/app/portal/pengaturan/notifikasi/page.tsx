import type { Metadata } from "next";
import { Bell, Info, Mail, MessageSquare, SlidersHorizontal } from "lucide-react";

import { AccountHero, AccountPage, Panel, accountStyles as styles } from "@/components/account/account-ui";

export const metadata: Metadata = { title: "Preferensi Notifikasi" };

const notifications = [
  ["Email login alerts", "Peringatan email saat login baru terdeteksi."],
  ["Email security alerts", "Notifikasi reset password dan perubahan sensitif."],
  ["WhatsApp login alerts", "Peringatan login baru melalui WhatsApp."],
  ["In-app notifications", "Notifikasi langsung di dalam aplikasi."],
  ["Weekly digest", "Ringkasan aktivitas mingguan."],
] as const;

export default function NotificationsPage() {
  return (
    <AccountPage settings title="Preferensi Notifikasi" description="Kelola detail profil, pengaturan keamanan, dan lihat riwayat aktivitas penggunaan akun.">
      <AccountHero eyebrow="Komunikasi & peringatan" title="Preferensi Notifikasi" description="Atur saluran penerimaan notifikasi setelah provider komunikasi disetujui." icon={Bell} stat={<><span>Saluran aktif</span><strong>0 saluran</strong></>} />
      <Panel title="Ringkasan Saluran" description="Saluran berikut masih berupa rancangan integrasi.">
        <div className={styles.channelGrid}>
          <div className={styles.channel}><Mail size={20} aria-hidden="true" /><small>Email</small><span>Menunggu provider</span></div>
          <div className={styles.channel}><MessageSquare size={20} aria-hidden="true" /><small>WhatsApp</small><span>Menunggu provider</span></div>
          <div className={styles.channel}><Bell size={20} aria-hidden="true" /><small>In-app</small><span>Menunggu penyimpanan preferensi</span></div>
        </div>
      </Panel>
      <Panel title="Channels" description="Atur channel notifikasi sesuai kebutuhan setelah integrasi tersedia." icon={SlidersHorizontal}>
        <div>
          {notifications.map(([title, description]) => <div className={styles.switchRow} key={title}><div><h3>{title}</h3><p>{description}</p></div><button className={styles.switch} type="button" role="switch" aria-checked="false" aria-label={title} disabled /></div>)}
        </div>
        <div className={styles.callout} style={{ marginTop: 18 }}><Info size={18} aria-hidden="true" /><p>Kontrol dinonaktifkan agar portal tidak mengklaim telah mengirim notifikasi sebelum provider tersedia.</p></div>
        <div className={styles.actions}><button className={styles.button} type="button" disabled>Simpan Preferensi</button></div>
      </Panel>
    </AccountPage>
  );
}
