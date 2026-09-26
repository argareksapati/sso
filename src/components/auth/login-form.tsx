"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import styles from "./form.module.css";

export function LoginForm({ returnTo }: { returnTo?: string }) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
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
        body: JSON.stringify({ identifier, password, remember: false, returnTo }),
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
        <p className={styles.kicker}>Akun layanan kota</p>
        <h2>Masuk</h2>
        <p>Masukkan identitas akun dan kata sandi yang telah terdaftar.</p>
      </div>

      {error && <Alert tone="error">{error}</Alert>}

      <form className={styles.form} onSubmit={submit} noValidate>
        <FormField
          id="identifier"
          name="identifier"
          label="Identitas akun"
          hint="Format identifier final mengikuti hasil migrasi akun lama."
          autoComplete="username"
          value={identifier}
          onChange={(event) => setIdentifier(event.target.value)}
          required
          autoFocus
        />
        <FormField
          id="password"
          name="password"
          label="Kata sandi"
          type={showPassword ? "text" : "password"}
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          trailing={
            <button className={styles.textButton} type="button" onClick={() => setShowPassword((value) => !value)} aria-pressed={showPassword}>
              {showPassword ? <EyeOff size={16} aria-hidden="true" /> : <Eye size={16} aria-hidden="true" />}
              {showPassword ? "Sembunyikan" : "Tampilkan"}
            </button>
          }
        />
        <div className={styles.recoveryLink}><Link href="/lupa-kata-sandi">Lupa kata sandi?</Link></div>
        <Button type="submit" loading={loading}>Masuk</Button>
      </form>

      <p className={styles.support}>Butuh bantuan mengakses akun? <Link href="/bantuan">Lihat informasi bantuan</Link>.</p>
    </div>
  );
}
