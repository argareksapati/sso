"use client";

import { Check, Network, Puzzle, RotateCcwKey, ShieldCheck } from "lucide-react";
import { useState } from "react";

import type { ExistingCatalogEntry } from "@/lib/services/repository";
import { ServiceIdentity } from "@/components/services/service-identity";
import { AccountHero, Panel, Status, accountStyles as styles } from "./account-ui";

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
      <AccountHero eyebrow="Integrasi aplikasi" title="Aplikasi Terhubung" description="Tinjau izin akses yang diberikan ke aplikasi mitra dan portal layanan Kota Bandung." icon={Network} stat={<><span>Aplikasi terhubung</span><strong>{activeApplication ? "1 aplikasi" : "0 aplikasi"}</strong></>} />

      <Panel title="Ringkasan Izin Akses" description="Daftar aplikasi dan tingkat otorisasi akun SSO yang sedang berjalan." icon={Puzzle}>
        <div className={styles.grid3}>
          <div className={styles.metric}><span>Terotorisasi</span><strong>{activeApplication ? "1" : "0"}</strong><Status tone={activeApplication ? "success" : "neutral"}>{activeApplication ? "1 aplikasi aktif" : "Tidak ada aplikasi"}</Status></div>
          <div className={styles.metric}><span>Izin akses</span><strong>{activeApplication ? "3" : "0"}</strong><span><ShieldCheck size={14} aria-hidden="true" /> Cakupan izin minimum</span></div>
          <div className={styles.metric}><span>Tindakan</span><strong><RotateCcwKey size={20} aria-hidden="true" /> Terkendali</strong><span>Akses dapat dicabut kapan saja.</span></div>
        </div>
      </Panel>

      {activeApplication ? (
        <Panel>
          <div className={styles.appCard}>
            <div className={styles.appCardHeader}>
              <ServiceIdentity name={activeApplication.name} detail="Portal berita dan laporan warga Kota Bandung" logoPath={activeApplication.logoPath} meta={<Status tone="success">Aktif</Status>} />
              <button className={styles.buttonDanger} type="button" onClick={revoke} disabled={state === "saving"}>{state === "saving" ? "Mencabut…" : "Cabut Akses"}</button>
            </div>
            <div>
              <span className={styles.inlineLabel}>Scope / izin yang diberikan</span>
              <div className={styles.scopeList}>
                {["openid", "profile", "email"].map((scope) => <span key={scope}><Check size={13} aria-hidden="true" />{scope}</span>)}
              </div>
            </div>
            <div className={styles.appCardFooter}><span>Status: terhubung dan aktif</span></div>
          </div>
        </Panel>
      ) : (
        <Panel>
          <div className={styles.empty}>
            <div><Puzzle size={34} aria-hidden="true" /><h3>Belum ada aplikasi terhubung</h3><p>Aplikasi yang Anda setujui untuk menggunakan akun SSO akan tampil di halaman ini.</p></div>
          </div>
        </Panel>
      )}

      <p className={state === "error" ? styles.formError : styles.liveMessage} role={state === "error" ? "alert" : "status"} aria-live="polite">{message}</p>
    </>
  );
}
