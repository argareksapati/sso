"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { MaterialIcon } from "@/components/ui/material-icon";
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
  const [loading, setLoading] = useState(false);

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
    <div className={`${styles.content} ${styles.registerContent}`}>
      <div className={styles.heading}>
        <p className={`${styles.kicker} ${styles.registerKicker}`}>Pendaftaran akun</p>
        <h2>Buat Akun SSO Baru</h2>
        <p>Lengkapi identitas Anda untuk pendaftaran</p>
      </div>
      {error && <Alert tone="error">{error}</Alert>}

      <form className={styles.form} onSubmit={submit} noValidate>
        <div className={styles.field}>
          <label htmlFor="full-name">Nama Lengkap</label>
          <div className={styles.inputShell}>
            <MaterialIcon name="person" size={18} />
            <input id="full-name" name="fullName" type="text" placeholder="Sesuai KTP" autoComplete="name" value={fullName} onChange={(event) => setFullName(event.target.value)} minLength={2} maxLength={120} required />
          </div>
        </div>

        <div className={styles.field}>
          <label htmlFor="register-email">Alamat Email Aktif</label>
          <div className={styles.inputShell}>
            <MaterialIcon name="mail" size={18} />
            <input id="register-email" name="email" type="email" placeholder="nama@contoh.com" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </div>
        </div>

        <div className={styles.field}>
          <label htmlFor="register-password">Kata Sandi</label>
          <div className={styles.inputShell}>
            <MaterialIcon name="lock" size={18} />
            <input id="register-password" name="password" type={showPassword ? "text" : "password"} placeholder="Minimal 8 karakter" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} minLength={8} required />
            <button className={styles.visibilityToggle} type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"} aria-pressed={showPassword}>
              <MaterialIcon name={showPassword ? "visibility_off" : "visibility"} size={19} />
            </button>
          </div>
        </div>

        <div className={styles.field}>
          <label htmlFor="password-confirmation">Konfirmasi Kata Sandi</label>
          <div className={styles.inputShell}>
            <MaterialIcon name="lock_reset" size={18} />
            <input id="password-confirmation" name="passwordConfirmation" type={showPassword ? "text" : "password"} placeholder="Ulangi kata sandi" autoComplete="new-password" value={passwordConfirmation} onChange={(event) => setPasswordConfirmation(event.target.value)} required />
            <button className={styles.visibilityToggle} type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Sembunyikan sandi ulang" : "Tampilkan sandi ulang"} aria-pressed={showPassword}>
              <MaterialIcon name={showPassword ? "visibility_off" : "visibility"} size={19} />
            </button>
          </div>
        </div>

        <div className={styles.captchaCard}>
          <div className={styles.captchaHeading}>
            <label htmlFor="register-captcha-answer"><MaterialIcon name="verified_user" size={19} /><strong>Verifikasi Keamanan</strong></label>
            <span aria-label={`Berapa ${captcha.left} ditambah ${captcha.right}?`}>Berapa {captcha.left} + {captcha.right} ?</span>
          </div>
          <div className={styles.captchaControls}>
            <input id="register-captcha-answer" name="captcha" type="number" inputMode="numeric" placeholder="Jawaban angka" value={captchaAnswer} onChange={(event) => { setCaptchaAnswer(event.target.value); setCaptchaError(undefined); }} aria-invalid={Boolean(captchaError)} aria-describedby={captchaError ? "register-captcha-error" : undefined} required />
            <button type="button" onClick={refreshCaptcha} aria-label="Muat ulang soal verifikasi" title="Muat ulang soal"><MaterialIcon name="refresh" size={20} /></button>
          </div>
          {captchaError && <p className={styles.fieldError} id="register-captcha-error" role="alert">{captchaError}</p>}
        </div>

        <Button className={styles.submit} type="submit" variant="success" loading={loading}>Daftar Akun SSO <MaterialIcon name="arrow_forward" size={19} /></Button>
      </form>

      <p className={styles.support}>Sudah memiliki akun? <Link href="/login">Masuk Akun</Link></p>
    </div>
  );
}
