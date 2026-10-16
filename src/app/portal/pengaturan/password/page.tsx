import type { Metadata } from "next";

import { AccountHero, AccountPage, Panel, accountStyles as styles } from "@/components/account/account-ui";
import { PasswordEditor } from "@/components/account/password-editor";
import { MaterialIcon } from "@/components/ui/material-icon";
import { getSession } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Kata Sandi Saya" };

export default async function PasswordPage() {
  const session = await getSession();
  if (!session) return null;
  return (
    <AccountPage settings title="Kata Sandi Saya" description="Kelola kata sandi akun, pengaturan keamanan, dan instruksi proteksi akun SSO Anda.">
      <AccountHero className={styles.passwordHero} eyebrow="Keamanan akun" title="Ubah Kata Sandi" description="Perbarui kata sandi Anda secara berkala dengan kombinasi yang kuat untuk melindungi akun SSO Kota Bandung dari akses tidak sah." materialIcon="security" stat={<div className={styles.protectionStat}><MaterialIcon name="lock" size={20} /><span>Proteksi sistem</span><strong>Enkripsi 256-bit</strong></div>} />
      <div className={styles.passwordGrid}>
        <PasswordEditor initialIdentifier={session.email} />
        <Panel className={styles.securityTipsPanel} title="Tips Keamanan" description="Jaga akun tetap aman saat mengganti kata sandi." materialIcon="verified_user">
          <div className={styles.tips}>
            <div className={styles.tip}><MaterialIcon name="lock" size={18} /><div><strong>Gunakan kata sandi unik</strong><span>Gunakan kombinasi simbol, angka, huruf kapital, dan tidak dipakai ulang.</span></div></div>
            <div className={styles.tip}><MaterialIcon name="security" size={18} /><div><strong>Aktifkan perlindungan tambahan</strong><span>Gunakan Autentikasi 2 Langkah (2FA) jika tersedia di akun Anda.</span></div></div>
            <div className={styles.tip}><MaterialIcon name="devices" size={18} /><div><strong>Logout perangkat lama</strong><span>Keluarkan sesi login pada perangkat yang tidak Anda kenali atau gunakan lagi.</span></div></div>
            <div className={styles.securityFoot}><span><i />Terakhir diubah: <strong>45 hari yang lalu</strong></span><MaterialIcon name="history" size={16} /></div>
          </div>
        </Panel>
      </div>
    </AccountPage>
  );
}
