import type { Metadata } from "next";
import { KeyRound, LockKeyhole, MonitorSmartphone, ShieldCheck } from "lucide-react";

import { AccountHero, AccountPage, Panel, accountStyles as styles } from "@/components/account/account-ui";
import { PasswordEditor } from "@/components/account/password-editor";
import { getSession } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Kata Sandi Saya" };

export default async function PasswordPage() {
  const session = await getSession();
  if (!session) return null;
  return (
    <AccountPage settings title="Kata Sandi Saya" description="Kelola kata sandi akun, pengaturan keamanan, dan instruksi perlindungan akun SSO Anda.">
      <AccountHero eyebrow="Keamanan akun" title="Ubah Kata Sandi" description="Perbarui kata sandi secara berkala melalui penyedia identitas yang melindungi akun Single Sign On Anda." icon={LockKeyhole} stat={<><span>Proteksi sistem</span><strong>Enkripsi 256-bit</strong></>} />
      <div className={styles.grid2}>
        <PasswordEditor initialIdentifier={session.email} />
        <Panel title="Tips Keamanan" description="Jaga akun tetap aman saat mengganti kata sandi." icon={ShieldCheck}>
          <div className={styles.tips}>
            <div className={styles.tip}><KeyRound size={20} aria-hidden="true" /><div><strong>Gunakan kata sandi unik</strong><span>Gabungkan simbol, angka, dan huruf serta jangan gunakan ulang.</span></div></div>
            <div className={styles.tip}><ShieldCheck size={20} aria-hidden="true" /><div><strong>Aktifkan perlindungan tambahan</strong><span>Gunakan autentikasi dua langkah pada penyedia identitas.</span></div></div>
            <div className={styles.tip}><MonitorSmartphone size={20} aria-hidden="true" /><div><strong>Keluar dari perangkat lama</strong><span>Cabut sesi pada perangkat yang tidak lagi Anda gunakan.</span></div></div>
            <div className={styles.securityFoot}><span><KeyRound size={17} aria-hidden="true" /> Status perubahan</span><strong>Aktif</strong></div>
          </div>
        </Panel>
      </div>
    </AccountPage>
  );
}
