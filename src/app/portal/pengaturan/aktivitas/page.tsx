import type { Metadata } from "next";
import { Activity, BarChart3, CalendarDays, CheckCircle2, Clock3, ShieldCheck } from "lucide-react";

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
    <AccountPage settings title="Log Aktivitas" description="Pantau riwayat autentikasi dan penggunaan layanan pada akun SSO Anda.">
      <AccountHero eyebrow="Keamanan & audit" title="Log Aktivitas OAuth" description="Ringkasan layanan yang pernah Anda buka, aktivitas akses terbaru, dan statistik autentikasi akun." icon={ShieldCheck} stat={<><span>Aktivitas tercatat</span><strong>1 kunjungan</strong></>} />
      <div className={styles.grid2}>
        <Panel title="Total Kunjungan" description="Frekuensi akses layanan terhubung." icon={BarChart3}>
          <div className={styles.usageItem}><div><strong>Portal Single Sign On Kota Bandung</strong><br /><span>Autentikasi akun pusat</span></div><Status tone="info">1 kali</Status></div>
          <div style={{ marginTop: 14 }} className={styles.progressTrack}><div className={styles.progressFill} style={{ width: "100%" }} /></div>
          <div style={{ marginTop: 7 }} className={styles.progressMeta}><span>100% dari total akses</span><strong>1 / 1</strong></div>
        </Panel>
        <Panel title="Histori Akses" description="Catatan aktivitas login dan verifikasi sesi." icon={Activity}>
          <div className={styles.loginItem}><div><Status tone="info">OAuth client</Status><h3 style={{ marginTop: 10 }}>Portal Single Sign On</h3><div className={styles.meta}><span><CalendarDays size={13} aria-hidden="true" /> {formatDate(session.issuedAt)}</span><span><Clock3 size={13} aria-hidden="true" /> IP tidak disimpan</span></div></div><Status tone="success"><CheckCircle2 size={13} aria-hidden="true" /> Otorisasi berhasil</Status></div>
        </Panel>
      </div>
      <div className={styles.pagination}><span>Halaman aktivitas SSO</span><div><button type="button" disabled>« Sebelumnya</button><button type="button" aria-current="page">1</button><button type="button" disabled>Selanjutnya »</button></div></div>
    </AccountPage>
  );
}
