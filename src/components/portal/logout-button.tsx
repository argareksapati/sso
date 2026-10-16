"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { MaterialIcon } from "@/components/ui/material-icon";
import styles from "./portal-shell.module.css";

export function LogoutButton({
  label = "Keluar",
  loadingLabel = "Keluar…",
  className,
  iconSize = 17,
}: {
  label?: string;
  loadingLabel?: string;
  className?: string;
  iconSize?: number;
}) {
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
    <button className={`${styles.logout} ${className ?? ""}`} type="button" onClick={logout} disabled={loading} aria-label={loading ? loadingLabel : label}>
      <MaterialIcon name="logout" size={iconSize} />
      <span className={styles.logoutLabel}>{loading ? loadingLabel : label}</span>
    </button>
  );
}
