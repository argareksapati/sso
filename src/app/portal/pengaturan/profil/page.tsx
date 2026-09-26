import type { Metadata } from "next";
import { Info } from "lucide-react";

import { AccountPage, Panel, Status, accountStyles as styles } from "@/components/account/account-ui";
import { getSession } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Profil saya" };

export default async function ProfilePage() {
  const session = await getSession();
  if (!session) return null;
  return (
    <AccountPage title="Profil saya" description="Lihat informasi identitas yang digunakan pada layanan terintegrasi.">
      <Panel title="Informasi pribadi" description="Data final akan dibaca dari master identity dan hanya dapat diubah melalui sumber yang berwenang.">
        <div className={styles.stack}>
          <div className={styles.fieldGrid}>
            <div className={styles.field}>
              <label htmlFor="displayName">Nama lengkap</label>
              <input id="displayName" value={session.displayName} disabled readOnly />
            </div>
            <div className={styles.field}>
              <label htmlFor="accountStatus">Status akun</label>
              <input id="accountStatus" value="Terautentikasi" disabled readOnly />
            </div>
            <div className={styles.field}>
              <label htmlFor="email">Alamat email</label>
              <input id="email" value="Belum tersedia dari identity provider" disabled readOnly />
            </div>
            <div className={styles.field}>
              <label htmlFor="phone">Nomor telepon</label>
              <input id="phone" value="Belum tersedia dari identity provider" disabled readOnly />
            </div>
          </div>
          <div className={styles.callout}>
            <Info size={19} aria-hidden="true" />
            <p>Portal tidak menyimpan salinan profil kependudukan. Claim profil dan kewenangan perubahan masih menunggu keputusan IdP serta master identity.</p>
          </div>
          <div className={styles.actions}>
            <Status tone="info">Read-only sementara</Status>
            <button className={styles.button} type="button" disabled>Simpan perubahan</button>
          </div>
        </div>
      </Panel>
    </AccountPage>
  );
}
