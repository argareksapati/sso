"use client";

import { useState } from "react";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

import styles from "./portal-shell.module.css";

export function LogoutButton() {
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
    <button className={styles.logout} type="button" onClick={logout} disabled={loading}>
      <LogOut size={17} aria-hidden="true" />
      {loading ? "Keluar…" : "Keluar"}
    </button>
  );
}
