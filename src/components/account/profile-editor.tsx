/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { MaterialIcon } from "@/components/ui/material-icon";
import type { EditableProfile } from "@/lib/profile/profile-store";
import { accountStyles as styles } from "./account-ui";

const MAX_PHOTO_BYTES = 2 * 1024 * 1024;
const PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"];

function initials(name: string) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((word) => word[0]).join("").toUpperCase() || "SS";
}

type ProfileEditorProps = {
  initialProfile: EditableProfile;
  initialHasPhoto: boolean;
};

export function ProfileEditor({ initialProfile, initialHasPhoto }: ProfileEditorProps) {
  const [profile, setProfile] = useState(initialProfile);
  const [savedProfile, setSavedProfile] = useState(initialProfile);
  const [hasPhoto, setHasPhoto] = useState(initialHasPhoto);
  const [photoVersion, setPhotoVersion] = useState(0);
  const [photoPreview, setPhotoPreview] = useState("");
  const [pendingPhoto, setPendingPhoto] = useState<File | null>(null);
  const [state, setState] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const photoInput = useRef<HTMLInputElement>(null);

  const displayName = `${profile.firstName} ${profile.lastName}`.trim() || profile.nickname || "Pengguna SSO";
  const profileDirty = useMemo(() => JSON.stringify(profile) !== JSON.stringify(savedProfile), [profile, savedProfile]);
  const dirty = profileDirty || Boolean(pendingPhoto);
  const storedPhotoUrl = hasPhoto ? `/api/profile/photo?v=${photoVersion}` : "";
  const photoUrl = photoPreview || storedPhotoUrl;

  useEffect(() => () => {
    if (photoPreview.startsWith("blob:")) URL.revokeObjectURL(photoPreview);
  }, [photoPreview]);

  function update(field: keyof EditableProfile, value: string) {
    setProfile((current) => ({ ...current, [field]: value }));
    setState("idle");
    setMessage("");
  }

  function choosePhoto(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!PHOTO_TYPES.includes(file.type)) {
      event.target.value = "";
      setState("error");
      setMessage("Gunakan foto dengan format JPG, PNG, atau WEBP.");
      return;
    }
    if (file.size > MAX_PHOTO_BYTES) {
      event.target.value = "";
      setState("error");
      setMessage("Ukuran foto maksimal 2 MB.");
      return;
    }
    setPendingPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
    setState("idle");
    setMessage("");
  }

  async function savePhoto() {
    if (!pendingPhoto) return;
    const form = new FormData();
    form.set("photo", pendingPhoto);
    const response = await fetch("/api/profile/photo", { method: "POST", body: form });
    const payload = await response.json().catch(() => ({})) as { message?: string; version?: number };
    if (!response.ok) throw new Error(payload.message || "Foto profil belum dapat disimpan.");
    setHasPhoto(true);
    setPhotoVersion(payload.version || Date.now());
    setPendingPhoto(null);
    setPhotoPreview("");
    if (photoInput.current) photoInput.current.value = "";
  }

  async function saveProfile() {
    if (!profileDirty) return;
    const response = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
    });
    const payload = await response.json().catch(() => ({})) as { message?: string; profile?: EditableProfile };
    if (!response.ok || !payload.profile) throw new Error(payload.message || "Profil belum dapat disimpan.");
    setProfile(payload.profile);
    setSavedProfile(payload.profile);
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!dirty) {
      setState("success");
      setMessage("Tidak ada perubahan baru untuk disimpan.");
      return;
    }
    setState("saving");
    setMessage("");
    try {
      await savePhoto();
      await saveProfile();
      setState("success");
      setMessage("Perubahan profil dan foto berhasil disimpan.");
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "Profil belum dapat disimpan.");
    }
  }

  return (
    <>
      <section className={`${styles.hero} ${styles.profileHeroCard}`}>
        <span className={styles.accentLine} aria-hidden="true"><i /><i /><i /></span>
        <div className={styles.profileHero}>
          <div className={styles.profileIdentity}>
            <span className={styles.profileAvatar} aria-hidden="true">
              {photoUrl ? <img src={photoUrl} alt="" /> : initials(displayName)}
              <i><MaterialIcon name="check" size={16} /></i>
            </span>
            <div className={styles.profileName}>
              <div className={styles.profileNameRow}>
                <strong>{displayName}</strong>
                <small>Edit profil</small>
              </div>
              <span>ID Pengguna: <b>{profile.username}</b></span>
              <div className={styles.profileBadges}>
                <span><MaterialIcon name="mail" size={15} />{profile.contactEmail || "budi.dermawan@bandung.go.id"}</span>
                <span><MaterialIcon name="verified" size={15} />Terverifikasi</span>
              </div>
            </div>
          </div>
          <div className={styles.profileStats}>
            <div><small>Username</small><strong>{profile.username}</strong></div>
            <div><small>Telepon</small><strong>{profile.whatsapp || "+62 812-3456"}</strong></div>
          </div>
        </div>
      </section>

      <div className={styles.profileEditorGrid}>
        <section className={`${styles.panel} ${styles.profileFormPanel}`}>
          <form onSubmit={submit} noValidate>
            <div className={styles.formSection}>
              <div className={styles.formSectionHeader}>
                <h2><MaterialIcon name="badge" size={20} />Profil Utama</h2>
                <p>Identitas utama akun Single Sign On Kota Bandung Anda.</p>
              </div>
              <div className={styles.fieldGrid}>
                <div className={styles.field}>
                  <label htmlFor="contactEmail">Alamat Email</label>
                  <div className={styles.verifiedInput}>
                    <input id="contactEmail" type="email" autoComplete="email" value={profile.contactEmail} onChange={(event) => update("contactEmail", event.target.value)} placeholder="nama@contoh.com" maxLength={254} />
                    <span><MaterialIcon name="check_circle" size={13} />Terverifikasi</span>
                  </div>
                </div>
                <div className={styles.field}>
                  <label htmlFor="username">Username Akun</label>
                  <div className={styles.usernameInput}>
                    <input className={styles.monospaceInput} id="username" value={profile.username} onChange={(event) => update("username", event.target.value)} minLength={3} maxLength={40} pattern="[A-Za-z0-9._-]+" required />
                    <MaterialIcon name="lock" size={18} />
                  </div>
                  <small>Perubahan username hanya dapat dilakukan 1 kali.</small>
                </div>
                <div className={styles.field}><label htmlFor="nickname">Nama Panggilan / Nickname</label><input id="nickname" value={profile.nickname} onChange={(event) => update("nickname", event.target.value)} placeholder="Contoh: Budi" maxLength={60} required /></div>
                <div className={styles.field}>
                  <label htmlFor="whatsapp">Nomor WhatsApp</label>
                  <div className={styles.phoneField}><input id="whatsapp" type="tel" autoComplete="tel" value={profile.whatsapp} onChange={(event) => update("whatsapp", event.target.value)} placeholder="+62 812-xxxx-xxxx" maxLength={32} /><button type="button" onClick={() => setMessage("Nomor WhatsApp siap diverifikasi setelah profil disimpan.")}>Verifikasi</button></div>
                </div>
              </div>
            </div>

            <div className={styles.formSection}>
              <div className={styles.formSectionHeader}>
                <h2><MaterialIcon name="person_pin" size={20} />Data Pribadi</h2>
                <p>Informasi lengkap sesuai kartu tanda penduduk / identitas diri.</p>
              </div>
              <div className={styles.fieldGrid}>
                <div className={styles.field}><label htmlFor="firstName">Nama Depan</label><input id="firstName" autoComplete="given-name" value={profile.firstName} onChange={(event) => update("firstName", event.target.value)} maxLength={80} required /></div>
                <div className={styles.field}><label htmlFor="lastName">Nama Belakang</label><input id="lastName" autoComplete="family-name" value={profile.lastName} onChange={(event) => update("lastName", event.target.value)} maxLength={80} /></div>
                <div className={styles.field}><label htmlFor="birthPlace">Tempat Lahir</label><input id="birthPlace" value={profile.birthPlace} onChange={(event) => update("birthPlace", event.target.value)} placeholder="Bandung" maxLength={100} /></div>
                <div className={styles.field}><label htmlFor="about">Tentang Anda</label><input id="about" value={profile.about} onChange={(event) => update("about", event.target.value)} placeholder="Profesi / Aktivitas" maxLength={160} /></div>
                <div className={`${styles.field} ${styles.fieldFull}`}><label htmlFor="address">Alamat Lengkap</label><textarea id="address" autoComplete="street-address" value={profile.address} onChange={(event) => update("address", event.target.value)} placeholder="Masukkan alamat lengkap" maxLength={500} /></div>
              </div>
            </div>

            {message && <p className={state === "error" ? styles.formError : styles.liveMessage} role={state === "error" ? "alert" : "status"} aria-live="polite">{message}</p>}
            <div className={styles.profileActions}>
              <p><MaterialIcon name="info" size={16} />Klik tombol simpan untuk memperbarui informasi profil.</p>
              <div>
                <input ref={photoInput} className={styles.visuallyHidden} id="profilePhoto" type="file" accept="image/jpeg,image/png,image/webp" aria-label="Pilih foto profil" onChange={choosePhoto} />
                <button className={styles.buttonSecondary} type="button" onClick={() => photoInput.current?.click()} disabled={state === "saving"}><MaterialIcon name="image" size={18} />Ganti Foto</button>
                <button className={styles.button} type="submit" disabled={state === "saving"}><MaterialIcon name="save" size={18} />{state === "saving" ? "Menyimpan…" : "Simpan Perubahan"}</button>
              </div>
            </div>
          </form>
        </section>

        <div className={styles.profileSideColumn}>
          <section className={`${styles.panel} ${styles.previewPanel}`}>
            <div className={styles.previewHeading}>
              <div><h2>Preview Card</h2><span>Live</span></div>
              <p>Tampilan foto profil dan identitas singkat Anda.</p>
            </div>
            <div className={styles.previewProfile}>
              <span className={styles.previewAvatar}>{photoUrl ? <img src={photoUrl} alt={`Foto profil ${displayName}`} /> : initials(displayName)}</span>
              <div><strong>{displayName}</strong><MaterialIcon name="verified" size={16} /><span>@{profile.username}</span><small><MaterialIcon name="location_on" size={13} />{profile.birthPlace || "Bandung"}, Indonesia</small></div>
            </div>
            <div className={styles.photoRatio}>
              <p><MaterialIcon name="lightbulb" size={18} /><span>Rasio foto disarankan <strong>1:1</strong> dengan format JPG, PNG atau WEBP maksimal <strong>2MB</strong>.</span></p>
              <div><span>Kelengkapan Profil</span><strong>85%</strong></div>
              <i><b /></i>
            </div>
          </section>

          <section className={`${styles.panel} ${styles.accessPanel}`}>
            <h2>Akses Terintegrasi</h2>
            <div><span><MaterialIcon name="check_circle" size={18} />Email Terverifikasi</span><strong>Otomatis</strong></div>
            <div><span><MaterialIcon name="check_circle" size={18} />SSO Kota Bandung</span><strong>Aktif</strong></div>
            <div><span><MaterialIcon name="radio_button_unchecked" size={18} />Autentikasi 2 Langkah</span><button type="button">Aktifkan</button></div>
          </section>
        </div>
      </div>
    </>
  );
}
