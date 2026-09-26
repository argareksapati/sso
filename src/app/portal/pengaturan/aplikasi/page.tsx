import type { Metadata } from "next";
import { AppWindow, Link2Off } from "lucide-react";

import { AccountPage, Panel, Status, accountStyles as styles } from "@/components/account/account-ui";
import { ServiceIdentity } from "@/components/services/service-identity";
import { listExistingSsoCatalog, listIntegrationCandidates } from "@/lib/services/repository";

export const metadata: Metadata = { title: "Aplikasi terkoneksi" };

export default async function ConnectedAppsPage() {
  const [existingCatalog, services] = await Promise.all([
    listExistingSsoCatalog(),
    listIntegrationCandidates(),
  ]);
  return (
    <AccountPage title="Aplikasi terkoneksi" description="Tinjau aplikasi yang memperoleh akses melalui akun SSO Anda.">
      <div className={styles.grid2}>
        <div className={styles.metric}>
          <span className={styles.metricIcon}><AppWindow size={20} aria-hidden="true" /></span>
          <strong>0</strong>
          <span>Client production yang telah diotorisasi</span>
        </div>
        <div className={styles.metric}>
          <span className={styles.metricIcon}><Link2Off size={20} aria-hidden="true" /></span>
          <strong>{services.length}</strong>
          <span>Aplikasi masih pada tahap discovery atau review</span>
        </div>
      </div>
      <Panel title="Akses aktif" description="Aplikasi hanya muncul di sini setelah consent atau assignment akses tercatat oleh IdP.">
        <div className={styles.empty}>
          <div>
            <Link2Off size={32} aria-hidden="true" color="var(--ink-muted)" />
            <h3>Belum ada aplikasi terkoneksi</h3>
            <p>Tidak ada client production yang telah menerima akses akun pada lingkungan pengembangan ini.</p>
          </div>
        </div>
      </Panel>
      <Panel title="Referensi katalog lama" description="Nama dan logo berikut dicatat dari halaman publik SSO eksisting. Daftar ini tidak menunjukkan consent atau akses akun Anda.">
        <ul className={styles.list}>
          {existingCatalog.map((service) => (
            <li className={styles.listItem} key={service.id}>
              <ServiceIdentity name={service.name} detail={service.owner} logoPath={service.logoPath} />
              <Status tone="neutral">Referensi lama</Status>
            </li>
          ))}
        </ul>
      </Panel>
      <Panel title="Kandidat integrasi" description="Daftar ini adalah inventaris teknis dan belum berarti aplikasi memiliki akses ke profil Anda.">
        <ul className={styles.list}>
          {services.map((service) => (
            <li className={styles.listItem} key={service.id}>
              <ServiceIdentity name={service.name} detail={service.owner} logoPath={service.logoPath} />
              <Status tone={service.integrationState === "DISCOVERY" ? "info" : "warning"}>
                {service.integrationState === "DISCOVERY" ? "Discovery" : "Review eksternal"}
              </Status>
            </li>
          ))}
        </ul>
      </Panel>
    </AccountPage>
  );
}
