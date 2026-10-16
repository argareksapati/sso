import type { Metadata } from "next";

import { AccountPage } from "@/components/account/account-ui";
import { ProfileEditor } from "@/components/account/profile-editor";
import { getSession } from "@/lib/auth/session";
import { hasProfilePhoto } from "@/lib/profile/profile-photo-store";
import { getStoredProfile } from "@/lib/profile/profile-store";

export const metadata: Metadata = { title: "Profil Saya" };

export default async function ProfilePage() {
  const session = await getSession();
  if (!session) return null;
  const [profile, initialHasPhoto] = await Promise.all([
    getStoredProfile(session),
    hasProfilePhoto(session.subject),
  ]);

  return (
    <AccountPage settings title="Profil Saya" description="Kelola detail profil, pengaturan keamanan, dan lihat riwayat aktivitas penggunaan akun SSO Anda.">
      <ProfileEditor initialProfile={profile} initialHasPhoto={initialHasPhoto} />
    </AccountPage>
  );
}
