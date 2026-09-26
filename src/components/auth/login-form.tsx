"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowRight, Eye, EyeOff, Mail, ShieldCheck } from "lucide-react";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import styles from "./form.module.css";

export function LoginForm({ returnTo }: { returnTo?: string }) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(undefined);
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
        return;
      }
      window.location.assign(result.redirectTo);
    } catch {
      setError("Layanan masuk sedang tidak tersedia. Periksa koneksi dan coba lagi.");
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

      <button className={styles.google} type="button" disabled title="Menunggu konfigurasi Google Identity">
        <span aria-hidden="true">G</span> Masuk dengan Gmail
      </button>

      <div className={styles.divider}><span>atau masuk dengan email</span></div>
      {error && <Alert tone="error">{error}</Alert>}

      <form className={styles.form} onSubmit={submit} noValidate>
        <div className={styles.iconField}>
          <Mail size={18} aria-hidden="true" />
          <FormField id="identifier" name="identifier" label="Alamat email" placeholder="nama@contoh.com" autoComplete="username" value={identifier} onChange={(event) => setIdentifier(event.target.value)} required autoFocus />
        </div>
        <FormField
          id="password"
          name="password"
          label="Kata sandi"
          type={showPassword ? "text" : "password"}
          placeholder="Kata sandi"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          trailing={<Link href="/lupa-kata-sandi">Lupa kata sandi?</Link>}
        />
        <div className={styles.passwordToggle}>
          <button className={styles.textButton} type="button" onClick={() => setShowPassword((value) => !value)} aria-pressed={showPassword}>
            {showPassword ? <EyeOff size={16} aria-hidden="true" /> : <Eye size={16} aria-hidden="true" />}
            {showPassword ? "Sembunyikan sandi" : "Tampilkan sandi"}
          </button>
        </div>
        <label className={styles.remember}><input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} /> <span>Ingat saya selama 7 hari</span></label>

        <div className={styles.securityCheck} aria-label="Status verifikasi keamanan">
          <span><ShieldCheck size={20} aria-hidden="true" /><strong>Verifikasi keamanan</strong></span>
          <small>Dikelola oleh identity provider saat integrasi production diaktifkan.</small>
          <b>Menunggu IdP</b>
        </div>
        <Button type="submit" loading={loading}>Masuk <ArrowRight size={19} aria-hidden="true" /></Button>
      </form>

      <p className={styles.support}>Belum punya akses? <Link href="/bantuan">Hubungi administrator</Link></p>
    </div>
  );
}
