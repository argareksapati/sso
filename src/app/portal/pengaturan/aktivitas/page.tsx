import type { Metadata } from "next";
import { Activity, CheckCircle2, Clock3, Monitor } from "lucide-react";

import { AccountPage, Panel, Status, accountStyles as styles } from "@/components/account/account-ui";
import { getSession } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Log aktivitas" };

function formatDate(epoch: number) {
  return new Intl.DateTimeFormat("id-ID", { dateStyle: "long", timeStyle: "short", timeZone: "Asia/Jakarta" }).format(new Date(epoch * 1000));
}

export default async function ActivityPage() {
  const session = await getSession();
  if (!session) return null;
  return (
    <AccountPage title="Log aktivitas" description="Periksa aktivitas autentikasi dan perubahan penting pada akun Anda.">
      <div className={styles.grid3}>
        <div className={styles.metric}><span className={styles.metricIcon}><Activity size={20} aria-hidden="true" /></span><strong>1</strong><span>Aktivitas tersedia pada sesi ini</span></div>
        <div className={styles.metric}><span className={styles.metricIcon}><CheckCircle2 size={20} aria-hidden="true" /></span><strong>Berhasil</strong><span>Status autentikasi terakhir</span></div>
        <div className={styles.metric}><span className={styles.metricIcon}><Monitor size={20} aria-hidden="true" /></span><strong>Web</strong><span>Kanal akses saat ini</span></div>
      </div>
      <Panel title="Riwayat akun" description="Audit lintas perangkat dan aplikasi akan berasal dari audit store pusat.">
        <ul className={styles.list}>
          <li className={styles.listItem}>
            <div>
              <h3>Masuk ke portal SSO</h3>
              <p>Identity provider memverifikasi kredensial dan menerbitkan sesi portal.</p>
              <div className={styles.meta}><span><Clock3 size={13} aria-hidden="true" /> {formatDate(session.issuedAt)}</span><span>Lokasi dan alamat IP tidak ditampilkan</span></div>
            </div>
            <Status tone="success">Berhasil</Status>
          </li>
        </ul>
      </Panel>
    </AccountPage>
  );
}
