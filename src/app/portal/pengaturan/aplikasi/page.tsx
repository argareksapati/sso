import type { Metadata } from "next";
import { Info, Link2Off, Network } from "lucide-react";

import { AccountHero, AccountPage, Panel, Status, accountStyles as styles } from "@/components/account/account-ui";
import { ServiceIdentity } from "@/components/services/service-identity";
import { listExistingSsoCatalog, listIntegrationCandidates } from "@/lib/services/repository";

export const metadata: Metadata = { title: "Aplikasi Terkoneksi" };

export default async function ConnectedAppsPage() {
  const [catalog, candidates] = await Promise.all([listExistingSsoCatalog(), listIntegrationCandidates()]);
  return (
    <AccountPage settings title="Aplikasi Terkoneksi" description="Kelola detail profil, pengaturan keamanan, dan lihat riwayat aktivitas penggunaan akun.">
      <AccountHero eyebrow="Integrasi aplikasi" title="Aplikasi Terhubung" description="Kelola izin akses SSO yang diberikan kepada aplikasi mitra setelah client production tersedia." icon={Network} stat={<><span>Aplikasi terhubung</span><strong>0 aplikasi</strong></>} />
      <Panel title="Aplikasi Terkoneksi" description="Ringkasan otorisasi pada lingkungan pengembangan.">
        <div className={styles.grid3}>
          <div className={styles.metric}><span>Terotorisasi</span><strong>0</strong><span>Belum ada client production aktif</span></div>
          <div className={styles.metric}><span>Izin akses</span><strong>0 scope</strong><span>Consent belum diterbitkan</span></div>
          <div className={styles.metric}><span>Kandidat</span><strong>{candidates.length}</strong><span>Menunggu discovery teknis</span></div>
        </div>
      </Panel>
      <Panel title="Akses Aktif" description="Aplikasi muncul di sini setelah consent atau assignment tercatat oleh IdP.">
        <div className={styles.empty}><div><Link2Off size={34} aria-hidden="true" color="var(--ink-muted)" /><h3>Belum ada aplikasi terkoneksi</h3><p>Tidak ada client production yang menerima akses profil pada lingkungan ini.</p></div></div>
      </Panel>
      <Panel title="Referensi Katalog" description="Contoh aplikasi dari katalog lama; status ini bukan akses aktif akun Anda.">
        <ul className={styles.list}>
          {catalog.slice(0, 4).map((service) => <li className={styles.listItem} key={service.id}><ServiceIdentity name={service.name} detail={service.owner} logoPath={service.logoPath} /><Status>Referensi lama</Status></li>)}
        </ul>
      </Panel>
      <div className={styles.callout}><Info size={18} aria-hidden="true" /><p>Aplikasi yang dicabut kelak tidak dapat mengakses identitas sampai pengguna memberi persetujuan kembali. Endpoint revocation menunggu IdP.</p></div>
    </AccountPage>
  );
}
