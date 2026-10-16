"use client";

import Link from "next/link";
import { useCallback, useEffect, useState, type FormEvent } from "react";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { MaterialIcon } from "@/components/ui/material-icon";
import { GoogleMark } from "./google-mark";
import styles from "./form.module.css";

type CaptchaChallenge = { left: number; right: number };
let initialChallengeRequest: Promise<CaptchaChallenge> | undefined;

async function fetchLoginChallenge(): Promise<CaptchaChallenge> {
  const response = await fetch("/api/auth/challenge", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });
  const result = await response.json() as { left?: number; right?: number; message?: string };
  if (!response.ok || !Number.isInteger(result.left) || !Number.isInteger(result.right)) {
    throw new Error(result.message || "Verifikasi keamanan tidak dapat dimuat.");
  }
  return { left: result.left!, right: result.right! };
}

function getInitialLoginChallenge() {
  if (!initialChallengeRequest) {
    initialChallengeRequest = fetchLoginChallenge().catch((error: unknown) => {
      initialChallengeRequest = undefined;
      throw error;
    });
  }
  return initialChallengeRequest;
}

const oauthMessages: Record<string, string> = {
  unavailable: "Login Google hanya tersedia saat Supabase Auth digunakan.",
  not_configured: "Login Google belum diaktifkan pada project Supabase.",
  start_failed: "Login Google belum dapat dimulai. Coba kembali beberapa saat lagi.",
  cancelled: "Proses login Google dibatalkan atau tidak disetujui.",
  callback_failed: "Login Google tidak dapat diselesaikan. Silakan coba kembali.",
};

export function LoginForm({ returnTo, oauthError, registered, passwordChanged }: { returnTo?: string; oauthError?: string; registered?: string; passwordChanged?: string }) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [captcha, setCaptcha] = useState<CaptchaChallenge>();
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const [captchaError, setCaptchaError] = useState<string>();
  const [captchaLoading, setCaptchaLoading] = useState(true);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  const requestChallenge = useCallback(async (clearError = true) => {
    setCaptchaLoading(true);
    setCaptchaAnswer("");
    if (clearError) setCaptchaError(undefined);

    try {
      const nextChallenge = await fetchLoginChallenge();
      initialChallengeRequest = Promise.resolve(nextChallenge);
      setCaptcha(nextChallenge);
    } catch (challengeError) {
      setCaptcha(undefined);
      if (clearError) setCaptchaError(challengeError instanceof Error ? challengeError.message : "Verifikasi keamanan tidak dapat dimuat. Periksa koneksi dan coba lagi.");
    } finally {
      setCaptchaLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    getInitialLoginChallenge()
      .then((challenge) => {
        if (active) setCaptcha(challenge);
      })
      .catch((challengeError: unknown) => {
        if (!active) return;
        setCaptchaError(challengeError instanceof Error ? challengeError.message : "Verifikasi keamanan tidak dapat dimuat. Periksa koneksi dan coba lagi.");
      })
      .finally(() => {
        if (active) setCaptchaLoading(false);
      });
    return () => { active = false; };
  }, []);

  function signInWithGoogle() {
    setGoogleLoading(true);
    const params = new URLSearchParams({ remember: String(remember) });
    if (returnTo) params.set("returnTo", returnTo);
    window.location.assign(new URL(`/api/auth/google?${params.toString()}`, window.location.origin));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(undefined);
    setCaptchaError(undefined);

    if (!captcha || captchaAnswer.trim() === "") {
      setCaptchaError("Muat dan isi verifikasi keamanan terlebih dahulu.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password, captchaAnswer, remember, returnTo }),
      });
      const result = await response.json() as { code?: string; message?: string; redirectTo?: string };
      if (!response.ok || !result.redirectTo) {
        if (result.code === "invalid_challenge") {
          setCaptchaError(result.message || "Jawaban verifikasi keamanan belum tepat.");
        } else {
          setError(result.message || "Layanan masuk sedang tidak tersedia. Coba kembali beberapa saat lagi.");
        }
        await requestChallenge(false);
        return;
      }
      window.location.assign(result.redirectTo);
    } catch {
      setError("Layanan masuk sedang tidak tersedia. Periksa koneksi dan coba lagi.");
      await requestChallenge(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.content}>
      <div className={styles.heading}>
        <p className={styles.kicker}>Autentikasi akun</p>
        <h2>Masuk ke Akun SSO</h2>
        <p>Gunakan email dan kata sandi terdaftar Anda</p>
      </div>

      <button className={styles.google} type="button" onClick={signInWithGoogle} disabled={googleLoading}>
        <GoogleMark />
        <span>{googleLoading ? "Mengalihkan ke Google…" : "Masuk dengan Google"}</span>
      </button>

      <div className={styles.divider}><span>atau email</span></div>
      {oauthError && <Alert tone="error">{oauthMessages[oauthError] || oauthMessages.callback_failed}</Alert>}
      {registered === "confirmed" && <Alert tone="success">Email berhasil diverifikasi. Silakan masuk ke akun Anda.</Alert>}
      {passwordChanged === "1" && <Alert tone="success">Kata sandi berhasil diubah. Silakan masuk kembali menggunakan kata sandi baru.</Alert>}
      {error && <Alert tone="error">{error}</Alert>}

      <form className={styles.form} onSubmit={submit} noValidate>
        <div className={styles.field}>
          <label htmlFor="identifier">Alamat Email</label>
          <div className={styles.inputShell}>
            <MaterialIcon name="mail" size={18} />
            <input id="identifier" name="identifier" type="email" placeholder="nama@bandung.go.id" autoComplete="username" value={identifier} onChange={(event) => setIdentifier(event.target.value)} required />
          </div>
        </div>

        <div className={styles.field}>
          <div className={styles.labelRow}>
            <label htmlFor="password">Kata Sandi</label>
            <Link href="/lupa-kata-sandi">Lupa kata sandi?</Link>
          </div>
          <div className={styles.inputShell}>
            <MaterialIcon name="lock" size={18} />
            <input id="password" name="password" type={showPassword ? "text" : "password"} placeholder="Masukkan kata sandi" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required />
            <button className={styles.visibilityToggle} type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"} aria-pressed={showPassword}>
              <MaterialIcon name={showPassword ? "visibility_off" : "visibility"} size={19} />
            </button>
          </div>
        </div>

        <label className={styles.remember}>
          <input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} />
          <span>Ingat saya di perangkat ini</span>
        </label>

        <div className={styles.captchaCard}>
          <div className={styles.captchaHeading}>
            <label htmlFor="captcha-answer"><MaterialIcon name="verified_user" size={18} /><strong>Verifikasi Keamanan</strong></label>
            <span aria-label={captcha ? `Berapa ${captcha.left} ditambah ${captcha.right}?` : "Memuat soal verifikasi"}>
              {captcha ? `Berapa ${captcha.left} + ${captcha.right} ?` : "Memuat soal…"}
            </span>
          </div>
          <div className={styles.captchaControls}>
            <input id="captcha-answer" name="captcha" type="number" inputMode="numeric" min={2} max={18} placeholder="Jawaban angka" value={captchaAnswer} disabled={!captcha || captchaLoading} onChange={(event) => { setCaptchaAnswer(event.target.value); setCaptchaError(undefined); }} aria-invalid={Boolean(captchaError)} aria-describedby={captchaError ? "captcha-error" : undefined} required />
            <button type="button" onClick={() => void requestChallenge()} disabled={captchaLoading} aria-label="Muat ulang soal verifikasi" title="Muat ulang soal"><MaterialIcon name="refresh" size={19} /></button>
          </div>
          {captchaError && <p className={styles.fieldError} id="captcha-error" role="alert">{captchaError}</p>}
        </div>

        <Button className={styles.submit} type="submit" variant="success" loading={loading} disabled={!captcha || captchaLoading}>Masuk Sekarang <MaterialIcon name="arrow_forward" size={19} /></Button>
      </form>

      <p className={styles.support}>Belum memiliki akun SSO? <Link href="/daftar">Daftar Akun Baru</Link></p>
    </div>
  );
}
