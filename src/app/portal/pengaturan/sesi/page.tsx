import type { Metadata } from "next";
import { Clock3, Laptop, MapPin } from "lucide-react";

import { AccountPage, Panel, Status, accountStyles as styles } from "@/components/account/account-ui";
import { LogoutButton } from "@/components/portal/logout-button";
import { getSession } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Sesi perangkat" };

function formatDate(epoch: number) {
  return new Intl.DateTimeFormat("id-ID", { dateStyle: "long", timeStyle: "short", timeZone: "Asia/Jakarta" }).format(new Date(epoch * 1000));
}

export default async function SessionsPage() {
  const session = await getSession();
  if (!session) return null;
  return (
    <AccountPage title="Sesi perangkat" description="Tinjau sesi yang sedang aktif dan akhiri akses yang tidak dikenali.">
      <Panel title="Perangkat aktif" description="Portal baru dapat memverifikasi sesi saat ini; inventaris lintas perangkat menunggu session store IdP.">
        <ul className={styles.list}>
          <li className={styles.listItem}>
            <div>
              <h3><Laptop size={18} aria-hidden="true" style={{ verticalAlign: "text-bottom", marginRight: 8 }} />Perangkat ini</h3>
              <p>Sesi browser yang sedang Anda gunakan.</p>
              <div className={styles.meta}>
                <span><Clock3 size={13} aria-hidden="true" /> Masuk {formatDate(session.issuedAt)}</span>
                <span><MapPin size={13} aria-hidden="true" /> Lokasi tidak dicatat</span>
              </div>
            </div>
            <Status tone="success">Aktif sekarang</Status>
          </li>
        </ul>
        <div className={styles.actions}>
          <button className={styles.buttonDanger} type="button" disabled>Keluar dari semua perangkat lain</button>
          <LogoutButton label="Keluar dari perangkat ini" />
        </div>
      </Panel>
    </AccountPage>
  );
}
