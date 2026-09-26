import type { Metadata } from "next";
import { BellOff, Info } from "lucide-react";

import { AccountPage, Panel, accountStyles as styles } from "@/components/account/account-ui";

export const metadata: Metadata = { title: "Notifikasi" };

const notifications = [
  ["Aktivitas keamanan", "Pemberitahuan saat ada proses masuk atau perubahan keamanan penting."],
  ["Sesi perangkat baru", "Pemberitahuan saat akun digunakan pada perangkat yang belum dikenali."],
  ["Perubahan profil", "Konfirmasi ketika data profil akun berhasil diperbarui."],
  ["Informasi layanan", "Informasi perubahan status pada aplikasi layanan yang terhubung."],
] as const;

export default function NotificationsPage() {
  return (
    <AccountPage title="Notifikasi" description="Atur jenis pemberitahuan keamanan dan layanan yang ingin Anda terima.">
      <Panel title="Preferensi notifikasi" description="Channel pengiriman dan penyimpanan preferensi masih menunggu integrasi IdP.">
        <div className={styles.stack}>
          <div className={styles.callout}><Info size={19} aria-hidden="true" /><p>Kontrol ditampilkan sebagai rancangan final, tetapi belum aktif agar portal tidak mengklaim mengirim email, SMS, atau WhatsApp.</p></div>
          <div>
            {notifications.map(([title, description]) => (
              <div className={styles.switchRow} key={title}>
                <div><h3>{title}</h3><p>{description}</p></div>
                <button className={styles.switch} type="button" role="switch" aria-checked="false" aria-label={title} disabled />
              </div>
            ))}
          </div>
          <div className={styles.actions}>
            <button className={styles.button} type="button" disabled><BellOff size={17} aria-hidden="true" /> Simpan preferensi</button>
          </div>
        </div>
      </Panel>
    </AccountPage>
  );
}
