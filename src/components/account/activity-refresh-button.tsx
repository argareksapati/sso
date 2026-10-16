"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { MaterialIcon } from "@/components/ui/material-icon";
import styles from "./account-ui.module.css";

export function ActivityRefreshButton() {
  const router = useRouter();
  const timerRef = useRef<number | null>(null);
  const [state, setState] = useState<"idle" | "refreshing" | "complete">("idle");

  useEffect(() => () => {
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
  }, []);

  function refreshActivity() {
    if (state === "refreshing") return;

    setState("refreshing");
    router.refresh();
    timerRef.current = window.setTimeout(() => {
      setState("complete");
      timerRef.current = null;
    }, 650);
  }

  return (
    <div className={styles.activityRefreshGroup}>
      <button
        className={styles.activityRefreshButton}
        type="button"
        aria-label="Perbarui log aktivitas"
        title="Perbarui log aktivitas"
        aria-busy={state === "refreshing"}
        disabled={state === "refreshing"}
        onClick={refreshActivity}
      >
        <MaterialIcon name="sync" size={16} />
      </button>
      <span>Halaman aktivitas SSO</span>
      <span className={styles.visuallyHidden} role="status" aria-live="polite">
        {state === "refreshing" ? "Memperbarui log aktivitas" : state === "complete" ? "Log aktivitas berhasil diperbarui" : ""}
      </span>
    </div>
  );
}
