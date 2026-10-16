"use client";

import { useState, useSyncExternalStore } from "react";

import { MaterialIcon } from "@/components/ui/material-icon";
import styles from "./account-ui.module.css";

type PreferenceKey = "emailLogin" | "emailSecurity" | "whatsappLogin" | "inApp" | "whatsappSecurity" | "weeklyDigest";
type Preferences = Record<PreferenceKey, boolean>;

const STORAGE_KEY = "sso-notification-preferences";
const CHANGE_EVENT = "sso-notification-preferences-change";
const defaults: Preferences = {
  emailLogin: true,
  emailSecurity: true,
  whatsappLogin: false,
  inApp: true,
  whatsappSecurity: true,
  weeklyDigest: false,
};
const defaultSnapshot = JSON.stringify(defaults);

function getSnapshot() {
  return window.localStorage.getItem(STORAGE_KEY) || defaultSnapshot;
}

function subscribe(onStoreChange: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) onStoreChange();
  };
  window.addEventListener("storage", onStorage);
  window.addEventListener(CHANGE_EVENT, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(CHANGE_EVENT, onStoreChange);
  };
}

function parsePreferences(snapshot: string): Preferences {
  try {
    return { ...defaults, ...JSON.parse(snapshot) as Partial<Preferences> };
  } catch {
    return defaults;
  }
}

const primaryItems: Array<{ key: PreferenceKey; title: string; description: string; icon: string }> = [
  { key: "emailLogin", title: "Email login alerts", description: "Dapatkan email saat login baru terdeteksi pada akun Anda.", icon: "mail" },
  { key: "emailSecurity", title: "Email security alerts", description: "Notifikasi untuk reset kata sandi dan perubahan data sensitif.", icon: "shield" },
  { key: "whatsappLogin", title: "WhatsApp login alerts", description: "Peringatan instant mengenai login baru via WhatsApp.", icon: "chat" },
  { key: "inApp", title: "In-app notifications", description: "Tampilkan lonceng dan banner notifikasi di dalam portal SSO.", icon: "notifications" },
];

function PreferenceRow({ item, checked, onToggle, compact = false }: {
  item: (typeof primaryItems)[number];
  checked: boolean;
  onToggle: () => void;
  compact?: boolean;
}) {
  return (
    <div className={`${styles.switchRow} ${compact ? styles.switchRowCompact : ""}`}>
      <div className={styles.preferenceIdentity}>
        {!compact && <span className={styles.preferenceIcon}><MaterialIcon name={item.icon} size={20} /></span>}
        <div><h3>{item.title}</h3><p>{item.description}</p></div>
      </div>
      <button className={styles.switch} type="button" role="switch" aria-checked={checked} aria-label={item.title} onClick={onToggle} />
    </div>
  );
}

export function NotificationPreferences() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, () => defaultSnapshot);
  const preferences = parsePreferences(snapshot);
  const [message, setMessage] = useState("");

  function toggle(key: PreferenceKey) {
    setMessage("");
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...preferences, [key]: !preferences[key] }));
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }

  function save() {
    setMessage("Preferensi tersimpan dan langsung aktif untuk akun ini.");
  }

  return (
    <>
      <div className={styles.preferenceGrid}>
        {primaryItems.map((item) => <PreferenceRow key={item.key} item={item} checked={preferences[item.key]} onToggle={() => toggle(item.key)} />)}
      </div>
      <div className={styles.preferenceSplit}>
        <PreferenceRow compact item={{ key: "whatsappSecurity", title: "WhatsApp security alerts", description: "Sangat penting untuk perubahan akun kritis.", icon: "shield" }} checked={preferences.whatsappSecurity} onToggle={() => toggle("whatsappSecurity")} />
        <PreferenceRow compact item={{ key: "weeklyDigest", title: "Weekly digest", description: "Ringkasan statistik aktivitas login mingguan.", icon: "mail" }} checked={preferences.weeklyDigest} onToggle={() => toggle("weeklyDigest")} />
      </div>
      <div className={styles.notificationActions}>
        <p className={styles.notificationInfo} role="status" aria-live="polite"><MaterialIcon name="info" size={18} />{message || "Perubahan pengaturan akan langsung aktif untuk akun ini."}</p>
        <button className={styles.button} type="button" onClick={save}><MaterialIcon name="check" size={18} />Simpan Preferensi</button>
      </div>
    </>
  );
}
