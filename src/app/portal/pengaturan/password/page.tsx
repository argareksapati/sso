import type { Metadata } from "next";
import { History, KeyRound, LockKeyhole, MonitorSmartphone, ShieldCheck } from "lucide-react";

import { AccountHero, AccountPage, Panel, accountStyles as styles } from "@/components/account/account-ui";

export const metadata: Metadata = { title: "Kata Sandi Saya" };

export default function PasswordPage() {
  return (
    <AccountPage settings title="Kata Sandi Saya" description="Kelola detail profil, pengaturan keamanan, dan lihat riwayat aktivitas penggunaan akun.">
      <AccountHero eyebrow="Keamanan akun" title="Ubah Kata Sandi" description="Perbarui kata sandi melalui identity provider resmi setelah koneksi production tersedia." icon={LockKeyhole} stat={<><span>Proteksi sistem</span><strong>Token HMAC</strong></>} />
      <div className={styles.grid2}>
        <Panel title="Perbarui Kata Sandi" description="Kontrol kredensial belum diaktifkan pada portal pengembangan.">
          <div className={styles.stack}>
            <div className={styles.field}><label htmlFor="currentPassword">Kata Sandi Saat Ini</label><input id="currentPassword" type="password" placeholder="Dikelola oleh IdP" autoComplete="current-password" disabled /></div>
            <div className={styles.field}><label htmlFor="newPassword">Kata Sandi Baru</label><input id="newPassword" type="password" placeholder="Menunggu integrasi IdP" autoComplete="new-password" disabled /></div>
            <div className={styles.field}><label htmlFor="confirmPassword">Konfirmasi Kata Sandi Baru</label><input id="confirmPassword" type="password" placeholder="Menunggu integrasi IdP" autoComplete="new-password" disabled /></div>
            <div className={styles.callout}><ShieldCheck size={19} aria-hidden="true" /><p>Kata sandi production tidak disimpan atau diubah oleh portal Next.js ini.</p></div>
            <div className={styles.actions}><button className={styles.buttonSecondary} type="button" disabled>Batalkan</button><button className={styles.button} type="button" disabled><KeyRound size={17} aria-hidden="true" /> Simpan Kata Sandi</button></div>
          </div>
        </Panel>
        <Panel title="Tips Keamanan" description="Jaga akun tetap aman saat integrasi kredensial aktif.">
          <div className={styles.tips}>
            <div className={styles.tip}><KeyRound size={20} aria-hidden="true" /><div><strong>Gunakan password unik</strong><span>Panjang, sulit ditebak, dan tidak dipakai ulang.</span></div></div>
            <div className={styles.tip}><ShieldCheck size={20} aria-hidden="true" /><div><strong>Aktifkan perlindungan tambahan</strong><span>Gunakan MFA setelah didukung identity provider.</span></div></div>
            <div className={styles.tip}><MonitorSmartphone size={20} aria-hidden="true" /><div><strong>Kelola perangkat lama</strong><span>Akhiri sesi yang sudah tidak digunakan.</span></div></div>
            <div className={styles.tip}><History size={20} aria-hidden="true" /><div><strong>Status perubahan</strong><span>Riwayat password menunggu audit store IdP.</span></div></div>
          </div>
        </Panel>
      </div>
    </AccountPage>
  );
}
