import type { Metadata } from "next";
import { Clock3, Info, Laptop, MapPin, MonitorSmartphone, ShieldCheck } from "lucide-react";

import { AccountHero, AccountPage, Panel, Status, accountStyles as styles } from "@/components/account/account-ui";
import { LogoutButton } from "@/components/portal/logout-button";
import { getSession } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Sesi Perangkat" };

function formatDate(epoch: number) {
  return new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Jakarta" }).format(new Date(epoch * 1000));
}
export default async function SessionsPage() {
  const session = await getSession();
  if (!session) return null;
  return (
    <AccountPage settings title="Sesi Perangkat" description="Kelola detail profil, pengaturan keamanan, dan lihat riwayat aktivitas penggunaan akun.">
      <AccountHero eyebrow="Manajemen perangkat" title="Sesi & Perangkat Aktif" description="Pantau perangkat yang saat ini masuk ke akun Anda dan akhiri sesi yang tidak dikenali." icon={MonitorSmartphone} stat={<><span>Perangkat terhubung</span><strong>1 perangkat aktif</strong></>} />
      <Panel title="Sesi & Perangkat" description="Daftar perangkat yang dapat diverifikasi oleh portal saat ini.">
        <div className={styles.grid3}>
          <div className={styles.metric}><span>Total sesi</span><strong>1</strong><Status tone="info">1 sesi terverifikasi</Status></div>
          <div className={styles.metric}><span>Sesi saat ini</span><strong style={{ color: "var(--success)" }}>1</strong><Status tone="success">Sedang digunakan</Status></div>
          <div className={styles.metric}><span>Keamanan</span><strong><ShieldCheck size={20} aria-hidden="true" /> Terlindungi</strong><span>Akhiri sesi asing segera.</span></div>
        </div>
      </Panel>
      <Panel title="Daftar Perangkat Aktif" description="Satu perangkat ditemukan pada session store portal.">
        <div className={styles.deviceItem}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span className={styles.metricIcon}><Laptop size={22} aria-hidden="true" /></span>
            <div><strong>Browser web saat ini</strong><div className={styles.meta}><span><Clock3 size={13} aria-hidden="true" /> Masuk {formatDate(session.issuedAt)}</span><span><MapPin size={13} aria-hidden="true" /> Lokasi dan IP tidak dicatat</span></div></div>
          </div>
          <Status tone="success">Sesi Saat Ini</Status>
        </div>
        <div className={styles.callout} style={{ marginTop: 18 }}><Info size={18} aria-hidden="true" /><p>Inventaris lintas perangkat tersedia setelah session store IdP terhubung. Anda tetap dapat mengakhiri sesi browser ini.</p></div>
        <div className={styles.actions}><LogoutButton label="Cabut sesi ini" /></div>
      </Panel>
    </AccountPage>
  );
}
