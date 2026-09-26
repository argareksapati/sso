"use client";

import { useState } from "react";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

import styles from "./portal-shell.module.css";

export function LogoutButton({ label = "Keluar" }: { label?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function logout() {
    setLoading(true);
    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      if (response.ok) {
        router.push("/login");
        router.refresh();
      } else setLoading(false);
    } catch {
      setLoading(false);
    }
  }

  return (
    <button className={styles.logout} type="button" onClick={logout} disabled={loading} aria-label={loading ? "Sedang keluar" : label}>
      <LogOut size={17} aria-hidden="true" />
      <span>{loading ? "Keluar…" : label}</span>
    </button>
  );
}
