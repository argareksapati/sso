"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, RefreshCw, ShieldCheck, UserRound } from "lucide-react";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { GoogleMark } from "./google-mark";
import styles from "./form.module.css";

type CaptchaChallenge = { left: number; right: number };
const initialCaptcha: CaptchaChallenge = { left: 1, right: 9 };

function randomCaptcha(): CaptchaChallenge {
  const values = new Uint32Array(2);
  globalThis.crypto.getRandomValues(values);
  return { left: (values[0] % 9) + 1, right: (values[1] % 9) + 1 };
}

export function RegisterForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [captcha, setCaptcha] = useState(initialCaptcha);
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const [captchaError, setCaptchaError] = useState<string>();
  const [error, setError] = useState<string>();
  const [googleLoading, setGoogleLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  function signUpWithGoogle() {
    setGoogleLoading(true);
    const params = new URLSearchParams({ remember: "true", returnTo: "/portal" });
    window.location.assign(new URL(`/api/auth/google?${params.toString()}`, window.location.origin));
  }

  function refreshCaptcha() {
    setCaptcha((current) => {
      const next = randomCaptcha();
      return next.left === current.left && next.right === current.right
        ? { left: current.left === 9 ? 1 : current.left + 1, right: current.right }
        : next;
    });
    setCaptchaAnswer("");
    setCaptchaError(undefined);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(undefined);
    setCaptchaError(undefined);

    if (password.length < 8) {
      setError("Kata sandi harus terdiri dari minimal 8 karakter.");
      return;
    }
    if (password !== passwordConfirmation) {
      setError("Konfirmasi kata sandi belum sama.");
      return;
    }
    if (Number(captchaAnswer) !== captcha.left + captcha.right) {
      setCaptchaError("Jawaban verifikasi keamanan belum tepat.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, password, passwordConfirmation }),
      });
      const result = await response.json() as { message?: string; redirectTo?: string };
      if (!response.ok || !result.redirectTo) {
        setError(result.message || "Pendaftaran akun sedang tidak tersedia. Coba kembali beberapa saat lagi.");
        refreshCaptcha();
        return;
      }
      window.location.assign(result.redirectTo);
    } catch {
      setError("Pendaftaran akun sedang tidak tersedia. Periksa koneksi dan coba lagi.");
      refreshCaptcha();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.content}>
      <div className={styles.heading}>
        <p className={styles.kicker}>Daftar</p>
        <h2>Buat akun</h2>
        <p>Masukkan data Anda di bawah untuk membuat akun.</p>
      </div>

      <button
        className={styles.google}
        type="button"
        onClick={signUpWithGoogle}
        disabled={googleLoading}
      >
        <GoogleMark />
        <span>{googleLoading ? "Mengalihkan ke Google…" : "Daftar dengan Gmail"}</span>
      </button>

      <div className={styles.divider}><span>atau daftar dengan email</span></div>
      {error && <Alert tone="error">{error}</Alert>}

      <form className={styles.form} onSubmit={submit} noValidate>
        <div className={styles.field}>
          <label htmlFor="full-name">Nama lengkap</label>
          <div className={styles.inputShell}>
            <UserRound size={18} aria-hidden="true" />
            <input id="full-name" name="fullName" type="text" placeholder="Nama lengkap" autoComplete="name" value={fullName} onChange={(event) => setFullName(event.target.value)} minLength={2} maxLength={120} required autoFocus />
          </div>
        </div>

        <div className={styles.field}>
          <label htmlFor="register-email">Alamat email</label>
          <div className={styles.inputShell}>
            <Mail size={18} aria-hidden="true" />
            <input id="register-email" name="email" type="email" placeholder="nama@contoh.com" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </div>
        </div>

        <div className={styles.field}>
          <label htmlFor="register-password">Kata sandi</label>
          <div className={styles.inputShell}>
            <LockKeyhole size={18} aria-hidden="true" />
            <input id="register-password" name="password" type={showPassword ? "text" : "password"} placeholder="Minimal 8 karakter" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} minLength={8} required />
            <button className={styles.visibilityToggle} type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"} aria-pressed={showPassword}>
              {showPassword ? <EyeOff size={19} aria-hidden="true" /> : <Eye size={19} aria-hidden="true" />}
            </button>
          </div>
        </div>

        <div className={styles.field}>
          <label htmlFor="password-confirmation">Konfirmasi kata sandi</label>
          <div className={styles.inputShell}>
            <LockKeyhole size={18} aria-hidden="true" />
            <input id="password-confirmation" name="passwordConfirmation" type={showPassword ? "text" : "password"} placeholder="Ulangi kata sandi" autoComplete="new-password" value={passwordConfirmation} onChange={(event) => setPasswordConfirmation(event.target.value)} required />
          </div>
        </div>

        <div className={styles.captchaCard}>
          <div className={styles.captchaHeading}>
            <label htmlFor="register-captcha-answer"><ShieldCheck size={19} aria-hidden="true" /><strong>Verifikasi keamanan (Captcha)</strong></label>
            <span aria-label={`Berapa ${captcha.left} ditambah ${captcha.right}?`}>Berapa {captcha.left} + {captcha.right}?</span>
          </div>
          <div className={styles.captchaControls}>
            <input id="register-captcha-answer" name="captcha" type="number" inputMode="numeric" placeholder="Hasil penjumlahan" value={captchaAnswer} onChange={(event) => { setCaptchaAnswer(event.target.value); setCaptchaError(undefined); }} aria-invalid={Boolean(captchaError)} aria-describedby={captchaError ? "register-captcha-error" : undefined} required />
            <button type="button" onClick={refreshCaptcha} aria-label="Muat ulang soal verifikasi" title="Muat ulang soal"><RefreshCw size={20} aria-hidden="true" /></button>
          </div>
          {captchaError && <p className={styles.fieldError} id="register-captcha-error" role="alert">{captchaError}</p>}
        </div>

        <Button type="submit" loading={loading}>Buat akun <ArrowRight size={19} aria-hidden="true" /></Button>
      </form>

      <p className={styles.support}>Sudah punya akun? <Link href="/login">Masuk</Link></p>
    </div>
  );
}
