import type { Metadata } from "next";
import { KeyRound, ShieldAlert } from "lucide-react";

import { AccountPage, Panel, accountStyles as styles } from "@/components/account/account-ui";

export const metadata: Metadata = { title: "Kata sandi" };

export default function PasswordPage() {
  return (
    <AccountPage title="Kata sandi" description="Kelola kredensial akun dan kebijakan keamanan proses masuk.">
      <Panel title="Ubah kata sandi" description="Form ini akan diaktifkan setelah identity provider final menyediakan alur perubahan kredensial resmi.">
        <div className={styles.stack}>
          <div className={styles.callout}>
            <ShieldAlert size={20} aria-hidden="true" />
            <p>Kata sandi production tidak disimpan atau diubah oleh portal Next.js. Perubahan akan diarahkan ke identity provider melalui mekanisme resminya.</p>
          </div>
          <div className={styles.field}>
            <label htmlFor="currentPassword">Kata sandi saat ini</label>
            <input id="currentPassword" type="password" autoComplete="current-password" disabled value="" readOnly />
          </div>
          <div className={styles.fieldGrid}>
            <div className={styles.field}>
              <label htmlFor="newPassword">Kata sandi baru</label>
              <input id="newPassword" type="password" autoComplete="new-password" disabled value="" readOnly />
            </div>
            <div className={styles.field}>
              <label htmlFor="confirmPassword">Konfirmasi kata sandi baru</label>
              <input id="confirmPassword" type="password" autoComplete="new-password" disabled value="" readOnly />
            </div>
          </div>
          <div className={styles.actions}>
            <button className={styles.button} type="button" disabled><KeyRound size={17} aria-hidden="true" /> Perbarui kata sandi</button>
          </div>
        </div>
      </Panel>
    </AccountPage>
  );
}
