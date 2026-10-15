"use client";

import { Bell, Mail, MessageSquare, ShieldCheck } from "lucide-react";
import { useState, useSyncExternalStore } from "react";

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

const primaryItems: Array<{ key: PreferenceKey; title: string; description: string; icon: typeof Bell }> = [
  { key: "emailLogin", title: "Email login alerts", description: "Dapatkan email saat login baru terdeteksi pada akun Anda.", icon: Mail },
  { key: "emailSecurity", title: "Email security alerts", description: "Notifikasi reset kata sandi dan perubahan data sensitif.", icon: ShieldCheck },
  { key: "whatsappLogin", title: "WhatsApp login alerts", description: "Peringatan login baru melalui WhatsApp.", icon: MessageSquare },
  { key: "inApp", title: "In-app notifications", description: "Tampilkan peringatan keamanan langsung di portal SSO.", icon: Bell },
];

function PreferenceRow({ item, checked, onToggle }: {
  item: (typeof primaryItems)[number];
  checked: boolean;
  onToggle: () => void;
}) {
  const Icon = item.icon;
  return (
    <div className={styles.switchRow}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 11 }}>
        <span className={styles.metricIcon} style={{ width: 38, height: 38 }}><Icon size={18} aria-hidden="true" /></span>
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
    setMessage("Preferensi tersimpan di browser ini.");
  }

  return (
    <>
      <div className={styles.preferenceGrid}>
        {primaryItems.map((item) => <PreferenceRow key={item.key} item={item} checked={preferences[item.key]} onToggle={() => toggle(item.key)} />)}
      </div>
      <div className={styles.preferenceSplit} style={{ marginTop: 11 }}>
        <PreferenceRow item={{ key: "whatsappSecurity", title: "WhatsApp security alerts", description: "Peringatan untuk perubahan akun kritis.", icon: ShieldCheck }} checked={preferences.whatsappSecurity} onToggle={() => toggle("whatsappSecurity")} />
        <PreferenceRow item={{ key: "weeklyDigest", title: "Weekly digest", description: "Ringkasan statistik aktivitas mingguan.", icon: Mail }} checked={preferences.weeklyDigest} onToggle={() => toggle("weeklyDigest")} />
      </div>
      <p className={styles.liveMessage} role="status" aria-live="polite">{message}</p>
      <div className={styles.actions}><button className={styles.button} type="button" onClick={save}>Simpan Preferensi</button></div>
    </>
  );
}
