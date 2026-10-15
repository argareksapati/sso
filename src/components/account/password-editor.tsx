"use client";

import Link from "next/link";
import { Eye, EyeOff, History, KeyRound, RotateCcw, ShieldCheck } from "lucide-react";
import { useMemo, useState } from "react";

import { Panel, accountStyles as styles } from "./account-ui";

type PasswordState = {
  identifier: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

const emptyPasswords = { currentPassword: "", newPassword: "", confirmPassword: "" };

function passwordScore(value: string) {
  if (!value) return 0;
  return Math.min(4, [
    value.length >= 8,
    value.length >= 12,
    /[a-z]/.test(value) && /[A-Z]/.test(value),
    /\d/.test(value) && /[^A-Za-z0-9]/.test(value),
  ].filter(Boolean).length);
}

function VisibilityButton({ shown, onClick, label }: { shown: boolean; onClick: () => void; label: string }) {
  return (
    <button className={styles.passwordToggle} type="button" onClick={onClick} aria-label={`${shown ? "Sembunyikan" : "Tampilkan"} ${label}`} aria-pressed={shown}>
      {shown ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
    </button>
  );
}

export function PasswordEditor({ initialIdentifier = "" }: { initialIdentifier?: string }) {
  const [form, setForm] = useState<PasswordState>({ identifier: initialIdentifier, ...emptyPasswords });
  const [visible, setVisible] = useState({ current: false, next: false, confirm: false });
  const [state, setState] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const score = useMemo(() => passwordScore(form.newPassword), [form.newPassword]);
  const scoreLabel = ["Belum diisi", "Lemah", "Cukup", "Baik", "Kuat"][score];

  function update(field: keyof PasswordState, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    setState("idle");
    setMessage("");
  }

  function reset() {
    setForm({ identifier: initialIdentifier, ...emptyPasswords });
    setVisible({ current: false, next: false, confirm: false });
    setState("idle");
    setMessage("Isian kata sandi dibersihkan.");
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.identifier.trim()) {
      setState("error");
      setMessage("Email akun wajib diisi.");
      return;
    }
    if (!form.currentPassword) {
      setState("error");
      setMessage("Kata sandi saat ini wajib diisi.");
      return;
    }
    if (form.newPassword.length < 8) {
      setState("error");
      setMessage("Kata sandi baru minimal 8 karakter.");
      return;
    }
    if (form.currentPassword === form.newPassword) {
      setState("error");
      setMessage("Kata sandi baru harus berbeda dari kata sandi saat ini.");
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      setState("error");
      setMessage("Konfirmasi kata sandi baru belum sama.");
      return;
    }

    setState("saving");
    setMessage("");
    try {
      const response = await fetch("/api/auth/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const payload = await response.json().catch(() => ({})) as { message?: string; redirectTo?: string };
      if (!response.ok || !payload.redirectTo) {
        setState("error");
        setMessage(payload.message || "Kata sandi belum dapat diubah.");
        return;
      }
      setForm((current) => ({ ...current, ...emptyPasswords }));
      setState("success");
      setMessage(payload.message || "Kata sandi berhasil diubah.");
      window.setTimeout(() => window.location.assign(payload.redirectTo!), 700);
    } catch {
      setState("error");
      setMessage("Koneksi terputus. Periksa jaringan lalu coba kembali.");
    }
  }

  return (
    <Panel title="Perbarui Kata Sandi" description="Sandi lama diverifikasi oleh penyedia identitas dan tidak disimpan oleh portal." icon={History}>
      <form className={styles.stack} onSubmit={submit} noValidate>
        <div className={styles.field}>
          <label htmlFor="passwordIdentifier">Email Akun</label>
          <input id="passwordIdentifier" type="email" autoComplete="username" value={form.identifier} onChange={(event) => update("identifier", event.target.value)} placeholder="nama@contoh.com" required />
          <small>Email digunakan untuk memverifikasi bahwa sandi lama berasal dari akun yang sedang aktif.</small>
        </div>
        <div className={styles.field}>
          <label htmlFor="currentPassword">Kata Sandi Saat Ini</label>
          <div className={styles.passwordInput}>
            <input id="currentPassword" type={visible.current ? "text" : "password"} value={form.currentPassword} onChange={(event) => update("currentPassword", event.target.value)} placeholder="Masukkan kata sandi saat ini" autoComplete="current-password" required />
            <VisibilityButton shown={visible.current} onClick={() => setVisible((current) => ({ ...current, current: !current.current }))} label="kata sandi saat ini" />
          </div>
          <small><Link href="/lupa-kata-sandi">Lupa kata sandi saat ini?</Link></small>
        </div>
        <div className={styles.field}>
          <label htmlFor="newPassword">Kata Sandi Baru</label>
          <div className={styles.passwordInput}>
            <input id="newPassword" type={visible.next ? "text" : "password"} value={form.newPassword} onChange={(event) => update("newPassword", event.target.value)} placeholder="Minimal 8 karakter" autoComplete="new-password" minLength={8} maxLength={128} required />
            <VisibilityButton shown={visible.next} onClick={() => setVisible((current) => ({ ...current, next: !current.next }))} label="kata sandi baru" />
          </div>
          <div className={styles.passwordStrength} data-score={score}>
            <span>Kekuatan: <strong>{scoreLabel}</strong></span>
            <i /><i /><i /><i />
          </div>
        </div>
        <div className={styles.field}>
          <label htmlFor="confirmPassword">Konfirmasi Kata Sandi Baru</label>
          <div className={styles.passwordInput}>
            <input id="confirmPassword" type={visible.confirm ? "text" : "password"} value={form.confirmPassword} onChange={(event) => update("confirmPassword", event.target.value)} placeholder="Ulangi kata sandi baru" autoComplete="new-password" minLength={8} maxLength={128} required />
            <VisibilityButton shown={visible.confirm} onClick={() => setVisible((current) => ({ ...current, confirm: !current.confirm }))} label="konfirmasi kata sandi" />
          </div>
        </div>
        <div className={styles.callout}><ShieldCheck size={19} aria-hidden="true" /><p>Setelah sandi berubah, sesi ini ditutup dan Anda diminta masuk kembali menggunakan kata sandi baru.</p></div>
        <p className={state === "error" ? styles.formError : styles.liveMessage} role={state === "error" ? "alert" : "status"} aria-live="polite">{message}</p>
        <div className={styles.actions}>
          <button className={styles.buttonSecondary} type="button" onClick={reset} disabled={state === "saving"}><RotateCcw size={17} aria-hidden="true" /> Batalkan</button>
          <button className={styles.button} type="submit" disabled={state === "saving"}><KeyRound size={17} aria-hidden="true" /> {state === "saving" ? "Menyimpan…" : "Simpan Kata Sandi"}</button>
        </div>
      </form>
    </Panel>
  );
}
