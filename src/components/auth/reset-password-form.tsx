"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { MaterialIcon } from "@/components/ui/material-icon";
import styles from "./form.module.css";

type RecoveryState = "checking" | "ready" | "invalid" | "success";

let cachedRecoveryClient: SupabaseClient | null | undefined;

function recoveryClient() {
  if (typeof window === "undefined") return null;
  if (cachedRecoveryClient !== undefined) return cachedRecoveryClient;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !publishableKey) {
    cachedRecoveryClient = null;
    return cachedRecoveryClient;
  }
  cachedRecoveryClient = createClient(url, publishableKey, {
    auth: { autoRefreshToken: false, detectSessionInUrl: false, persistSession: false },
  });
  return cachedRecoveryClient;
}

export function ResetPasswordForm() {
  const initialized = useRef(false);
  const [client] = useState(recoveryClient);
  const [state, setState] = useState<RecoveryState>("checking");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    async function initializeRecovery() {
      if (!client) {
        setState("invalid");
        return;
      }

      const url = new URL(window.location.href);
      const fragment = new URLSearchParams(url.hash.replace(/^#/, ""));
      const accessToken = fragment.get("access_token");
      const refreshToken = fragment.get("refresh_token");
      const tokenType = fragment.get("type") ?? url.searchParams.get("type");
      const tokenHash = url.searchParams.get("token_hash");
      const code = url.searchParams.get("code");
      const providerError = fragment.get("error") ?? url.searchParams.get("error");

      let recoveryError: Error | null = null;
      if (providerError) {
        recoveryError = new Error(providerError);
      } else if (accessToken && refreshToken && (!tokenType || tokenType === "recovery")) {
        const result = await client.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
        recoveryError = result.error;
      } else if (tokenHash && tokenType === "recovery") {
        const result = await client.auth.verifyOtp({ token_hash: tokenHash, type: "recovery" });
        recoveryError = result.error;
      } else if (code) {
        const result = await client.auth.exchangeCodeForSession(code);
        recoveryError = result.error;
      } else {
        recoveryError = new Error("missing_recovery_token");
      }

      window.history.replaceState({}, document.title, "/reset-kata-sandi");
      setState(recoveryError ? "invalid" : "ready");
    }

    void initializeRecovery();
  }, [client]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(undefined);

    if (password.length < 8) {
      setError("Kata sandi baru harus terdiri dari minimal 8 karakter.");
      return;
    }
    if (password !== confirmation) {
      setError("Konfirmasi kata sandi baru belum sama.");
      return;
    }
    if (!client) {
      setError("Layanan reset kata sandi sedang tidak tersedia.");
      return;
    }

    setLoading(true);
    const { error: updateError } = await client.auth.updateUser({ password });
    setLoading(false);
    if (updateError) {
      setError(updateError.code === "weak_password" || updateError.code === "same_password"
        ? "Gunakan kata sandi yang lebih kuat dan berbeda dari kata sandi sebelumnya."
        : "Kata sandi belum dapat diperbarui. Minta tautan reset baru dan coba kembali.");
      return;
    }

    setPassword("");
    setConfirmation("");
    setState("success");
  }

  if (state === "checking") {
    return (
      <div className={styles.content}>
        <div className={styles.heading}>
          <p className={styles.kicker}>Reset kata sandi</p>
          <h1>Memeriksa tautan reset</h1>
          <p>Mohon tunggu saat kami memvalidasi tautan pemulihan Supabase.</p>
        </div>
      </div>
    );
  }

  if (state === "invalid") {
    return (
      <div className={styles.content}>
        <div className={styles.heading}>
          <p className={styles.kicker}>Reset kata sandi</p>
          <h1>Tautan reset tidak valid atau kedaluwarsa</h1>
          <p>Minta tautan pemulihan baru untuk melanjutkan penggantian kata sandi.</p>
        </div>
        <Alert tone="error">Token pemulihan tidak ditemukan, sudah digunakan, atau telah kedaluwarsa.</Alert>
        <p className={styles.support}><Link href="/lupa-kata-sandi">Kirim ulang tautan pemulihan</Link></p>
      </div>
    );
  }

  if (state === "success") {
    return (
      <div className={styles.content}>
        <div className={styles.heading}>
          <p className={`${styles.kicker} ${styles.registerKicker}`}>Reset berhasil</p>
          <h1>Kata sandi berhasil diperbarui</h1>
          <p>Gunakan kata sandi baru untuk masuk ke akun SSO Kota Bandung.</p>
        </div>
        <Alert tone="success">Perubahan telah disimpan dengan aman oleh Supabase.</Alert>
        <p className={styles.support}><Link href="/login?passwordChanged=1">Masuk dengan kata sandi baru</Link></p>
      </div>
    );
  }

  return (
    <div className={styles.content}>
      <div className={styles.heading}>
        <p className={styles.kicker}>Reset kata sandi</p>
        <h1>Buat kata sandi baru</h1>
        <p>Masukkan kata sandi baru untuk akun SSO Kota Bandung Anda.</p>
      </div>
      {error && <Alert tone="error">{error}</Alert>}
      <form className={styles.form} onSubmit={submit}>
        <div className={styles.field}>
          <label htmlFor="new-recovery-password">Kata sandi baru</label>
          <div className={styles.inputShell}>
            <MaterialIcon name="lock" size={18} />
            <input id="new-recovery-password" type={showPassword ? "text" : "password"} minLength={8} maxLength={128} autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Minimal 8 karakter" required />
            <button className={styles.visibilityToggle} type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}><MaterialIcon name={showPassword ? "visibility_off" : "visibility"} size={19} /></button>
          </div>
        </div>
        <div className={styles.field}>
          <label htmlFor="confirm-recovery-password">Konfirmasi kata sandi baru</label>
          <div className={styles.inputShell}>
            <MaterialIcon name="lock_reset" size={18} />
            <input id="confirm-recovery-password" type={showPassword ? "text" : "password"} minLength={8} maxLength={128} autoComplete="new-password" value={confirmation} onChange={(event) => setConfirmation(event.target.value)} placeholder="Ulangi kata sandi baru" required />
          </div>
        </div>
        <Button className={styles.submit} type="submit" variant="success" loading={loading}>Simpan kata sandi baru <MaterialIcon name="arrow_forward" size={19} /></Button>
      </form>
    </div>
  );
}
