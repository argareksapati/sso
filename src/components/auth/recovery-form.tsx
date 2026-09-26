"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import styles from "./form.module.css";

export function RecoveryForm() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(undefined);
    setLoading(true);
    try {
      const response = await fetch("/api/auth/recovery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier }),
      });
      const result = await response.json() as { message?: string };
      if (!response.ok) {
        setError(result.message || "Permintaan belum dapat diproses. Coba kembali beberapa saat lagi.");
        return;
      }
      router.push("/pemulihan/dikirim");
    } catch {
      setError("Permintaan belum dapat diproses. Periksa koneksi dan coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.content}>
      <div className={styles.heading}>
        <p className={styles.kicker}>Pemulihan akun</p>
        <h1>Lupa kata sandi</h1>
        <p>Masukkan identitas akun. Petunjuk pemulihan akan dikirim jika akun memenuhi ketentuan.</p>
      </div>
      {error && <Alert tone="error">{error}</Alert>}
      <form className={styles.form} onSubmit={submit}>
        <FormField
          id="identifier"
          name="identifier"
          label="Identitas akun"
          autoComplete="username"
          value={identifier}
          onChange={(event) => setIdentifier(event.target.value)}
          required
          autoFocus
        />
        <Button type="submit" loading={loading}>Kirim petunjuk pemulihan</Button>
      </form>
      <a className={styles.back} href="/login">Kembali ke halaman masuk</a>
    </div>
  );
}
