import type { Metadata } from "next";

import { AccountPage } from "@/components/account/account-ui";
import { ConnectedAppsManager } from "@/components/account/connected-apps-manager";
import { getRevokedApplicationIds } from "@/lib/auth/connected-app-store";
import { getSession } from "@/lib/auth/session";
import { listExistingSsoCatalog } from "@/lib/services/repository";

export const metadata: Metadata = { title: "Aplikasi Terkoneksi" };

export default async function ConnectedAppsPage() {
  const session = await getSession();
  if (!session) return null;
  const [catalog, revokedIds] = await Promise.all([
    listExistingSsoCatalog(),
    getRevokedApplicationIds(session),
  ]);
  const catalogApplication = catalog[0];
  const connected = catalogApplication && !revokedIds.includes(catalogApplication.id) ? catalogApplication : undefined;

  return (
    <AccountPage settings title="Aplikasi Terkoneksi" description="Kelola detail profil, pengaturan keamanan, dan lihat riwayat aktivitas penggunaan akun SSO Anda.">
      <ConnectedAppsManager application={connected} />
    </AccountPage>
  );
}
