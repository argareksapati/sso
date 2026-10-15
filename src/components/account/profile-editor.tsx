/* eslint-disable @next/next/no-img-element */
"use client";

import {
  BadgeCheck,
  CircleCheck,
  IdCard,
  ImagePlus,
  Info,
  MapPin,
  RotateCcw,
  Save,
  ShieldCheck,
  Trash2,
  UserRound,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import type { EditableProfile } from "@/lib/profile/profile-store";
import { Panel, Status, accountStyles as styles } from "./account-ui";

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
  const [removePhoto, setRemovePhoto] = useState(false);
  const [state, setState] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const photoInput = useRef<HTMLInputElement>(null);

  const displayName = `${profile.firstName} ${profile.lastName}`.trim() || profile.nickname || "Pengguna SSO";
  const profileDirty = useMemo(() => JSON.stringify(profile) !== JSON.stringify(savedProfile), [profile, savedProfile]);
  const photoDirty = Boolean(pendingPhoto) || removePhoto;
  const dirty = profileDirty || photoDirty;
  const storedPhotoUrl = hasPhoto && !removePhoto ? `/api/profile/photo?v=${photoVersion}` : "";
  const photoUrl = photoPreview || storedPhotoUrl;
  const complete = Boolean(profile.contactEmail && profile.whatsapp && profile.address && photoUrl);

  useEffect(() => {
    return () => {
      if (photoPreview.startsWith("blob:")) URL.revokeObjectURL(photoPreview);
    };
  }, [photoPreview]);

  function update(field: keyof EditableProfile, value: string) {
    setProfile((current) => ({ ...current, [field]: value }));
    setState("idle");
    setMessage("");
  }

  function reset() {
    setProfile(savedProfile);
    setPendingPhoto(null);
    setPhotoPreview("");
    setRemovePhoto(false);
    if (photoInput.current) photoInput.current.value = "";
    setState("idle");
    setMessage("Perubahan yang belum disimpan dibatalkan.");
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
    setRemovePhoto(false);
    setState("idle");
    setMessage("Foto siap disimpan.");
  }

  function clearPhoto() {
    setPendingPhoto(null);
    setPhotoPreview("");
    setRemovePhoto(hasPhoto);
    if (photoInput.current) photoInput.current.value = "";
    setState("idle");
    setMessage(hasPhoto ? "Foto akan dihapus setelah perubahan disimpan." : "Pilihan foto dibatalkan.");
  }

  async function savePhoto() {
    if (pendingPhoto) {
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
      return;
    }

    if (removePhoto) {
      const response = await fetch("/api/profile/photo", { method: "DELETE" });
      const payload = await response.json().catch(() => ({})) as { message?: string };
      if (!response.ok) throw new Error(payload.message || "Foto profil belum dapat dihapus.");
      setHasPhoto(false);
      setRemovePhoto(false);
    }
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
      <section className={styles.hero}>
        <span className={styles.accentLine} aria-hidden="true"><i /><i /><i /></span>
        <div className={styles.profileHero} style={{ width: "100%" }}>
          <div className={styles.profileIdentity}>
            <span className={styles.profileAvatar} aria-hidden="true">
              {photoUrl ? <img src={photoUrl} alt="" /> : initials(displayName)}
            </span>
            <div className={styles.profileName}>
              <small>Edit profil</small>
              <strong>{displayName}</strong>
              <span>ID Profil: <b>@{profile.username}</b></span>
              <div style={{ marginTop: 8 }}><Status tone="success"><BadgeCheck size={13} aria-hidden="true" /> Sesi terverifikasi</Status></div>
            </div>
          </div>
          <div className={styles.profileStats}>
            <div><small>Username profil</small><strong>@{profile.username}</strong></div>
            <div><small>Status profil</small><strong>{dirty ? "Belum disimpan" : "Tersimpan"}</strong></div>
          </div>
        </div>
      </section>

      <div className={styles.dashboardGrid}>
        <Panel title="Profil Utama" description="Informasi profil yang ditampilkan di layanan Single Sign On Kota Bandung." icon={IdCard}>
          <form onSubmit={submit} noValidate>
            <div className={styles.formSection}>
              <div className={styles.fieldGrid}>
                <div className={styles.field}><label htmlFor="contactEmail">Email Kontak</label><input id="contactEmail" type="email" autoComplete="email" value={profile.contactEmail} onChange={(event) => update("contactEmail", event.target.value)} placeholder="nama@contoh.com" maxLength={254} /></div>
                <div className={styles.field}><label htmlFor="username">Username Profil</label><input id="username" value={profile.username} onChange={(event) => update("username", event.target.value)} minLength={3} maxLength={40} pattern="[A-Za-z0-9._-]+" required /><small>Username profil tidak mengubah identitas login Anda.</small></div>
                <div className={styles.field}><label htmlFor="nickname">Nama Panggilan / Nickname</label><input id="nickname" value={profile.nickname} onChange={(event) => update("nickname", event.target.value)} maxLength={60} required /></div>
                <div className={styles.field}><label htmlFor="whatsapp">Nomor WhatsApp</label><input id="whatsapp" type="tel" autoComplete="tel" value={profile.whatsapp} onChange={(event) => update("whatsapp", event.target.value)} placeholder="+62 812-xxxx-xxxx" maxLength={32} /></div>
              </div>
            </div>

            <div className={styles.formSection}>
              <div className={styles.formSectionHeader}>
                <h3><UserRound size={19} aria-hidden="true" /> Data Pribadi</h3>
                <p>Lengkapi informasi yang ingin ditampilkan pada profil layanan Anda.</p>
              </div>
              <div className={styles.fieldGrid}>
                <div className={styles.field}><label htmlFor="firstName">Nama Depan</label><input id="firstName" autoComplete="given-name" value={profile.firstName} onChange={(event) => update("firstName", event.target.value)} maxLength={80} required /></div>
                <div className={styles.field}><label htmlFor="lastName">Nama Belakang</label><input id="lastName" autoComplete="family-name" value={profile.lastName} onChange={(event) => update("lastName", event.target.value)} maxLength={80} /></div>
                <div className={styles.field}><label htmlFor="birthPlace">Tempat Lahir</label><input id="birthPlace" value={profile.birthPlace} onChange={(event) => update("birthPlace", event.target.value)} placeholder="Contoh: Bandung" maxLength={100} /></div>
                <div className={styles.field}><label htmlFor="about">Tentang Anda</label><input id="about" value={profile.about} onChange={(event) => update("about", event.target.value)} placeholder="Profesi atau aktivitas" maxLength={160} /></div>
              </div>
              <div className={styles.field}><label htmlFor="address">Alamat Lengkap</label><textarea id="address" autoComplete="street-address" value={profile.address} onChange={(event) => update("address", event.target.value)} placeholder="Masukkan alamat lengkap" maxLength={500} /></div>

              <div className={styles.photoEditor}>
                <div>
                  <strong>Foto Profil</strong>
                  <span>JPG, PNG, atau WEBP maksimal 2 MB. Foto dipotong otomatis menjadi rasio 1:1.</span>
                </div>
                <div className={styles.photoActions}>
                  <input ref={photoInput} className={styles.visuallyHidden} id="profilePhoto" type="file" accept="image/jpeg,image/png,image/webp" aria-label="Pilih foto profil" onChange={choosePhoto} />
                  <button className={styles.buttonSecondary} type="button" onClick={() => photoInput.current?.click()} disabled={state === "saving"}><ImagePlus size={16} aria-hidden="true" /> {photoUrl ? "Ganti Foto" : "Pilih Foto"}</button>
                  {photoUrl && <button className={styles.buttonDanger} type="button" onClick={clearPhoto} disabled={state === "saving"}><Trash2 size={16} aria-hidden="true" /> Hapus Foto</button>}
                </div>
              </div>

              <div className={styles.callout}><ShieldCheck size={18} aria-hidden="true" /><p>Foto disimpan sebagai WEBP tanpa metadata asli, hanya dapat diakses saat sesi aktif, dan tetap tersedia sampai diganti atau dihapus oleh pemilik akun.</p></div>
              <p className={state === "error" ? styles.formError : styles.liveMessage} role={state === "error" ? "alert" : "status"} aria-live="polite">{message}</p>
              <div className={styles.actions}>
                <button className={styles.buttonSecondary} type="button" onClick={reset} disabled={!dirty || state === "saving"}><RotateCcw size={16} aria-hidden="true" /> Batalkan</button>
                <button className={styles.button} type="submit" disabled={state === "saving"}><Save size={16} aria-hidden="true" /> {state === "saving" ? "Menyimpan…" : "Simpan Perubahan"}</button>
              </div>
            </div>
          </form>
        </Panel>

        <div className={styles.dashboardColumn}>
          <Panel title="Preview Card" description="Tampilan foto profil dan identitas singkat Anda.">
            <div className={styles.previewCard}>
              <div className={styles.previewProfile}>
                <span className={styles.previewAvatar}>
                  {photoUrl ? <img src={photoUrl} alt={`Foto profil ${displayName}`} /> : initials(displayName)}
                </span>
                <div><strong>{displayName}</strong><br /><span>@{profile.username}</span><div className={styles.meta}><span><MapPin size={13} aria-hidden="true" /> {profile.birthPlace || "Bandung"}, Indonesia</span></div></div>
              </div>
              <div className={styles.callout}><Info size={17} aria-hidden="true" /><p>Rasio foto disarankan 1:1 dengan format JPG, PNG, atau WEBP maksimal 2 MB.</p></div>
              <div className={styles.progressMeta}><span>Kelengkapan Profil</span><strong>{complete ? "100%" : "75%"}</strong></div>
              <div className={styles.progressTrack} role="progressbar" aria-label="Kelengkapan profil" aria-valuemin={0} aria-valuemax={100} aria-valuenow={complete ? 100 : 75}><div className={styles.progressFill} style={{ width: complete ? "100%" : "75%" }} /></div>
            </div>
          </Panel>
          <Panel title="Akses Terintegrasi">
            <div className={styles.tips}>
              <div className={styles.tip}><CircleCheck size={19} aria-hidden="true" /><div><strong>Sesi SSO</strong><span>Aktif di browser ini</span></div></div>
              <div className={styles.tip}><CircleCheck size={19} aria-hidden="true" /><div><strong>Profil dan foto dapat diedit</strong><span>Perubahan tersimpan aman untuk akun ini</span></div></div>
              <div className={styles.tip}><ShieldCheck size={19} aria-hidden="true" /><div><strong>Identitas login terlindungi</strong><span>Profil tidak mengubah email atau sandi login</span></div></div>
            </div>
          </Panel>
        </div>
      </div>
    </>
  );
}
