import type { Metadata } from "next";
import { Activity, CheckCircle2, Clock3, Monitor } from "lucide-react";

import { AccountHero, AccountPage, Panel, Status, accountStyles as styles } from "@/components/account/account-ui";
import { getSession } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Log Aktivitas" };

function formatDate(epoch: number) {
  return new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Jakarta" }).format(new Date(epoch * 1000));
}
export default async function ActivityPage() {
  const session = await getSession();
  if (!session) return null;
  return (
    <AccountPage settings title="Log Aktivitas" description="Kelola detail profil, pengaturan keamanan, dan lihat riwayat aktivitas penggunaan akun.">
      <AccountHero eyebrow="Keamanan & audit" title="Log Aktivitas SSO" description="Ringkasan layanan yang pernah dibuka dan aktivitas autentikasi akun." icon={Activity} stat={<><span>Aktivitas tercatat</span><strong>1 kunjungan</strong></>} />
      <div className={styles.grid2}>
        <Panel title="Total Kunjungan" description="Frekuensi akses yang dapat diverifikasi saat ini.">
          <div className={styles.usageItem}><div><strong>Portal Single Sign On</strong><br /><span>Sesi lokal pengembangan</span></div><Status tone="info">1 kali</Status></div>
        </Panel>
        <Panel title="Histori Akses" description="Catatan login dan verifikasi sesi.">
          <div className={styles.loginItem}><div><Status tone="info">Portal web</Status><h3>Autentikasi akun</h3><div className={styles.meta}><span><Clock3 size={13} aria-hidden="true" /> {formatDate(session.issuedAt)}</span><span><Monitor size={13} aria-hidden="true" /> IP tidak disimpan</span></div></div><Status tone="success"><CheckCircle2 size={13} aria-hidden="true" /> Berhasil</Status></div>
        </Panel>
      </div>
      <div className={styles.callout}><Activity size={18} aria-hidden="true" /><p>Audit lintas aplikasi dan perangkat akan berasal dari audit store pusat setelah identity provider final tersedia.</p></div>
    </AccountPage>
  );
}
