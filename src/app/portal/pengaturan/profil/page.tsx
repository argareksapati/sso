import type { Metadata } from "next";
import { BadgeCheck, CircleCheck, Info, UserRound } from "lucide-react";

import { AccountHero, AccountPage, Panel, Status, accountStyles as styles } from "@/components/account/account-ui";
import { getSession } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Profil Saya" };

function initials(name: string) {
  return name.split(/\s+/).slice(0, 2).map((word) => word[0]).join("").toUpperCase();
}
export default async function ProfilePage() {
  const session = await getSession();
  if (!session) return null;
  return (
    <AccountPage settings title="Profil Saya" description="Kelola detail profil, pengaturan keamanan, dan lihat riwayat aktivitas penggunaan akun.">
      <AccountHero eyebrow="Edit profil" title={session.displayName} description="Identitas akun terverifikasi pada lingkungan pengembangan." icon={UserRound} stat={<><span>Status profil</span><strong>Read-only</strong></>}>
        <div style={{ marginTop: 14 }}><Status tone="success"><BadgeCheck size={13} aria-hidden="true" /> Sesi terverifikasi</Status></div>
      </AccountHero>

      <div className={styles.grid2}>
        <Panel title="Profil Utama" description="Identitas utama akun Single Sign On Kota Bandung.">
          <div className={styles.stack}>
            <div className={styles.fieldGrid}>
              <div className={styles.field}><label htmlFor="email">Alamat Email</label><input id="email" value="Belum tersedia dari IdP" disabled readOnly /></div>
              <div className={styles.field}><label htmlFor="username">Username Akun</label><input id="username" value="Menunggu master identity" disabled readOnly /></div>
              <div className={styles.field}><label htmlFor="firstName">Nama Lengkap</label><input id="firstName" value={session.displayName} disabled readOnly /></div>
              <div className={styles.field}><label htmlFor="phone">Nomor WhatsApp</label><input id="phone" value="Belum tersedia dari IdP" disabled readOnly /></div>
              <div className={styles.field}><label htmlFor="birthPlace">Tempat Lahir</label><input id="birthPlace" value="Belum tersedia" disabled readOnly /></div>
              <div className={styles.field}><label htmlFor="about">Tentang Anda</label><input id="about" value="Belum tersedia" disabled readOnly /></div>
            </div>
            <div className={styles.field}><label htmlFor="address">Alamat Lengkap</label><textarea id="address" value="Belum tersedia dari master identity" disabled readOnly /></div>
            <div className={styles.callout}><Info size={19} aria-hidden="true" /><p>Portal belum menyimpan salinan profil kependudukan. Claim profil dan kewenangan perubahan menunggu keputusan IdP.</p></div>
            <div className={styles.actions}><Status tone="info">Read-only sementara</Status><button className={styles.button} type="button" disabled>Simpan Perubahan</button></div>
          </div>
        </Panel>

        <div className={styles.dashboardColumn}>
          <Panel title="Preview" description="Tampilan identitas singkat.">
            <div className={styles.previewCard}>
              <div className={styles.previewProfile}><span className={styles.previewAvatar}>{initials(session.displayName)}</span><div><strong>{session.displayName}</strong><br /><span>@menunggu-idp</span></div></div>
              <div className={styles.callout}><Info size={18} aria-hidden="true" /><p>Foto profil dapat diaktifkan setelah media storage dan kebijakan retensi disetujui.</p></div>
            </div>
          </Panel>
          <Panel title="Akses Terintegrasi">
            <div className={styles.tips}>
              <div className={styles.tip}><CircleCheck size={19} aria-hidden="true" /><div><strong>Sesi SSO</strong><span>Aktif di browser ini</span></div></div>
              <div className={styles.tip}><CircleCheck size={19} aria-hidden="true" /><div><strong>Aplikasi production</strong><span>Belum terhubung</span></div></div>
            </div>
          </Panel>
        </div>
      </div>
    </AccountPage>
  );
}
