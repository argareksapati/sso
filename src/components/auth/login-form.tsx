"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import styles from "./form.module.css";

type CaptchaChallenge = {
  left: number;
  right: number;
};

const initialCaptcha: CaptchaChallenge = { left: 8, right: 4 };

const oauthMessages: Record<string, string> = {
  unavailable: "Login Google hanya tersedia saat Supabase Auth digunakan.",
  not_configured: "Login Google belum diaktifkan pada project Supabase.",
  start_failed: "Login Google belum dapat dimulai. Coba kembali beberapa saat lagi.",
  cancelled: "Proses login Google dibatalkan atau tidak disetujui.",
  callback_failed: "Login Google tidak dapat diselesaikan. Silakan coba kembali.",
};

function GoogleMark() {
  return (
    <svg className={styles.googleMark} viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5a5.6 5.6 0 0 1-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9Z" />
      <path fill="#34A853" d="M12 24c3.2 0 5.9-1.1 7.8-2.9l-3.7-2.9c-1 .7-2.4 1.1-4.1 1.1-3.1 0-5.8-2.1-6.7-5.1l-3.8 2.9A11.8 11.8 0 0 0 12 24Z" />
      <path fill="#FBBC05" d="M5.3 14.2A7.2 7.2 0 0 1 4.9 12c0-.8.1-1.5.4-2.2L1.5 6.9A12 12 0 0 0 0 12c0 1.9.5 3.6 1.5 5.1l3.8-2.9Z" />
      <path fill="#EA4335" d="M12 4.7c1.8 0 3.4.6 4.6 1.8L20 3.1A11.5 11.5 0 0 0 12 0 11.8 11.8 0 0 0 1.5 6.9l3.8 2.9c.9-3 3.6-5.1 6.7-5.1Z" />
    </svg>
  );
}

function randomCaptcha(): CaptchaChallenge {
  const values = new Uint32Array(2);
  globalThis.crypto.getRandomValues(values);
  return {
    left: (values[0] % 9) + 1,
    right: (values[1] % 9) + 1,
  };
}

export function LoginForm({ returnTo, oauthError, registered }: { returnTo?: string; oauthError?: string; registered?: string }) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [captcha, setCaptcha] = useState(initialCaptcha);
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const [captchaError, setCaptchaError] = useState<string>();
  const [googleLoading, setGoogleLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  function refreshCaptcha() {
    setCaptcha((current) => {
      const next = randomCaptcha();
      if (next.left === current.left && next.right === current.right) {
        return { left: current.left === 9 ? 1 : current.left + 1, right: current.right };
      }
      return next;
    });
    setCaptchaAnswer("");
    setCaptchaError(undefined);
  }

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

    if (Number(captchaAnswer) !== captcha.left + captcha.right) {
      setCaptchaError("Jawaban verifikasi keamanan belum tepat.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password, remember, returnTo }),
      });
      const result = await response.json() as { message?: string; redirectTo?: string };
      if (!response.ok || !result.redirectTo) {
        setError(result.message || "Layanan masuk sedang tidak tersedia. Coba kembali beberapa saat lagi.");
        refreshCaptcha();
        return;
      }
      window.location.assign(result.redirectTo);
    } catch {
      setError("Layanan masuk sedang tidak tersedia. Periksa koneksi dan coba lagi.");
      refreshCaptcha();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.content}>
      <div className={styles.heading}>
        <p className={styles.kicker}>Masuk</p>
        <h2>Masuk ke akun Anda</h2>
        <p>Masukkan email dan kata sandi di bawah untuk masuk.</p>
      </div>

      <button
        className={styles.google}
        type="button"
        onClick={signInWithGoogle}
        disabled={googleLoading}
      >
        <GoogleMark />
        <span>{googleLoading ? "Mengalihkan ke Google…" : "Masuk dengan Gmail"}</span>
      </button>

      <div className={styles.divider}><span>atau masuk dengan email</span></div>
      {oauthError && <Alert tone="error">{oauthMessages[oauthError] || oauthMessages.callback_failed}</Alert>}
      {registered === "confirmed" && <Alert tone="success">Email berhasil diverifikasi. Silakan masuk ke akun Anda.</Alert>}
      {error && <Alert tone="error">{error}</Alert>}

      <form className={styles.form} onSubmit={submit} noValidate>
        <div className={styles.field}>
          <label htmlFor="identifier">Alamat email</label>
          <div className={styles.inputShell}>
            <Mail size={18} aria-hidden="true" />
            <input
              id="identifier"
              name="identifier"
              type="email"
              placeholder="nama@contoh.com"
              autoComplete="username"
              value={identifier}
              onChange={(event) => setIdentifier(event.target.value)}
              required
              autoFocus
            />
          </div>
        </div>

        <div className={styles.field}>
          <div className={styles.labelRow}>
            <label htmlFor="password">Kata sandi</label>
            <Link href="/lupa-kata-sandi">Lupa kata sandi?</Link>
          </div>
          <div className={styles.inputShell}>
            <LockKeyhole size={18} aria-hidden="true" />
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Kata sandi"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
            <button
              className={styles.visibilityToggle}
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
              aria-pressed={showPassword}
            >
              {showPassword ? <EyeOff size={19} aria-hidden="true" /> : <Eye size={19} aria-hidden="true" />}
            </button>
          </div>
        </div>

        <label className={styles.remember}>
          <input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} />
          <span>Ingat saya</span>
        </label>

        <div className={styles.captchaCard}>
          <div className={styles.captchaHeading}>
            <label htmlFor="captcha-answer">
              <ShieldCheck size={19} aria-hidden="true" />
              <strong>Verifikasi keamanan (Captcha)</strong>
            </label>
            <span aria-label={`Berapa ${captcha.left} ditambah ${captcha.right}?`}>
              Berapa {captcha.left} + {captcha.right}?
            </span>
          </div>
          <div className={styles.captchaControls}>
            <input
              id="captcha-answer"
              name="captcha"
              type="number"
              inputMode="numeric"
              placeholder="Hasil penjumlahan"
              value={captchaAnswer}
              onChange={(event) => {
                setCaptchaAnswer(event.target.value);
                setCaptchaError(undefined);
              }}
              aria-invalid={Boolean(captchaError)}
              aria-describedby={captchaError ? "captcha-error" : undefined}
              required
            />
            <button type="button" onClick={refreshCaptcha} aria-label="Muat ulang soal verifikasi" title="Muat ulang soal">
              <RefreshCw size={20} aria-hidden="true" />
            </button>
          </div>
          {captchaError && <p className={styles.fieldError} id="captcha-error" role="alert">{captchaError}</p>}
        </div>

        <Button type="submit" loading={loading}>Masuk <ArrowRight size={19} aria-hidden="true" /></Button>
      </form>

      <p className={styles.support}>Belum punya akun? <Link href="/daftar">Daftar</Link></p>
    </div>
  );
}
