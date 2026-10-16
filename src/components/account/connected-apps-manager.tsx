"use client";

import Image from "next/image";
import { useState } from "react";

import { MaterialIcon } from "@/components/ui/material-icon";
import type { ExistingCatalogEntry } from "@/lib/services/repository";
import { AccountHero, Panel, accountStyles as styles } from "./account-ui";

export function ConnectedAppsManager({ application }: { application?: ExistingCatalogEntry }) {
  const [connected, setConnected] = useState(Boolean(application));
  const [state, setState] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function revoke() {
    if (!application) return;
    setState("saving");
    setMessage("");
    try {
      const response = await fetch(`/api/connected-apps/${encodeURIComponent(application.id)}/revoke`, { method: "POST" });
      const payload = await response.json().catch(() => ({})) as { message?: string };
      if (!response.ok) {
        setState("error");
        setMessage(payload.message || "Akses aplikasi belum dapat dicabut.");
        return;
      }
      setConnected(false);
      setState("success");
      setMessage(payload.message || "Akses aplikasi berhasil dicabut.");
    } catch {
      setState("error");
      setMessage("Koneksi terputus. Periksa jaringan lalu coba kembali.");
    }
  }

  const activeApplication = connected ? application : undefined;

  return (
    <>
      <AccountHero
        className={styles.connectedHero}
        eyebrow="Integrasi aplikasi"
        title="Aplikasi Terhubung"
        description="Kelola izin akses masuk SSO yang telah Anda berikan ke aplikasi mitra, portal dinas, dan pihak ketiga."
        materialIcon="extension"
        stat={
          <div className={styles.protectionStat}>
            <MaterialIcon name="extension" size={20} />
            <span>Aplikasi terhubung</span>
            <strong>{activeApplication ? "1 Aplikasi Aktif" : "0 Aplikasi Aktif"}</strong>
          </div>
        }
      />

      <Panel
        className={styles.integrationSummaryPanel}
        title="Ringkasan Izin Akses"
        description="Daftar aplikasi dan tingkat otorisasi akun SSO yang sedang berjalan."
        materialIcon="widgets"
      >
        <div className={styles.integrationMetrics}>
          <div className={styles.integrationMetric}>
            <small>Terotorisasi</small>
            <strong>{activeApplication ? "1" : "0"}</strong>
            <span><MaterialIcon name="check_circle" size={15} />{activeApplication ? "1 Aplikasi aktif" : "Tidak ada aplikasi"}</span>
          </div>
          <div className={styles.integrationMetric}>
            <small>Izin akses</small>
            <p>Lihat scope akses tiap aplikasi.</p>
            <span><MaterialIcon name="verified_user" size={15} />{activeApplication ? "3 Cakupan izin" : "0 Cakupan izin"}</span>
          </div>
          <div className={styles.integrationMetric}>
            <small>Tindakan</small>
            <p>Cabut akses jika sudah tidak dipakai.</p>
            <span data-tone="warning"><MaterialIcon name="lock_reset" size={15} />Akses dapat dicabut</span>
          </div>
        </div>
      </Panel>

      {activeApplication ? (
        <Panel className={styles.connectedAppsPanel}>
          <div className={styles.connectedAppCard}>
            <div className={styles.connectedAppHeader}>
              <div className={styles.connectedAppIdentity}>
                <span className={styles.connectedAppLogo} aria-hidden="true">
                  {activeApplication.logoPath
                    ? <Image src={activeApplication.logoPath} alt="" width={48} height={48} sizes="48px" />
                    : <MaterialIcon name="extension" size={24} />}
                </span>
                <div>
                  <div className={styles.connectedAppTitle}>
                    <h3>{activeApplication.name}</h3>
                    <span>Aktif</span>
                  </div>
                  <p>Portal Berita &amp; Laporan Warga Kota Bandung</p>
                </div>
              </div>
              <button className={styles.buttonDanger} type="button" onClick={revoke} disabled={state === "saving"}>
                <MaterialIcon name="logout" size={16} />
                {state === "saving" ? "Mencabut…" : "Cabut Akses"}
              </button>
            </div>

            <div className={styles.connectedScopes}>
              <p>Scope / Izin yang diberikan:</p>
              <div className={styles.scopeList}>
                {["openid", "profile", "email"].map((scope) => <span key={scope}><MaterialIcon name="check" size={14} />{scope}</span>)}
              </div>
            </div>

            <div className={styles.appCardFooter}>
              <span>Diberikan Izin: <strong>7/9/2026, 05.04.20</strong></span>
              <span>Kadaluarsa: <strong>29/8/2027, 05.04.20</strong></span>
            </div>
          </div>
        </Panel>
      ) : (
        <Panel className={styles.connectedAppsPanel}>
          <div className={styles.empty}>
            <div><MaterialIcon name="extension" size={34} /><h3>Belum ada aplikasi terhubung</h3><p>Aplikasi yang Anda setujui untuk menggunakan akun SSO akan tampil di halaman ini.</p></div>
          </div>
        </Panel>
      )}

      {message && <p className={state === "error" ? styles.formError : styles.liveMessage} role={state === "error" ? "alert" : "status"} aria-live="polite">{message}</p>}
    </>
  );
}
