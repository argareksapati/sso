"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useSyncExternalStore } from "react";

import styles from "./theme-toggle.module.css";

type Theme = "light" | "dark";

const STORAGE_KEY = "sso-theme";
const THEME_EVENT = "sso-theme-change";

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
}

function getThemeSnapshot(): Theme {
  const storedTheme = window.localStorage.getItem(STORAGE_KEY);
  if (storedTheme === "dark" || storedTheme === "light") return storedTheme;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function getServerThemeSnapshot(): Theme {
  return "light";
}

function subscribeToTheme(onStoreChange: () => void) {
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) onStoreChange();
  };

  window.addEventListener("storage", onStorage);
  window.addEventListener(THEME_EVENT, onStoreChange);
  mediaQuery.addEventListener("change", onStoreChange);

  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(THEME_EVENT, onStoreChange);
    mediaQuery.removeEventListener("change", onStoreChange);
  };
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribeToTheme, getThemeSnapshot, getServerThemeSnapshot);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  function toggleTheme() {
    const nextTheme: Theme = theme === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
    window.localStorage.setItem(STORAGE_KEY, nextTheme);
    window.dispatchEvent(new Event(THEME_EVENT));
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      className={styles.toggle}
      aria-label={isDark ? "Aktifkan tema terang" : "Aktifkan tema gelap"}
      aria-pressed={isDark}
      title={isDark ? "Aktifkan tema terang" : "Aktifkan tema gelap"}
      onClick={toggleTheme}
    >
      <span className={styles.icon} data-active={!isDark} aria-hidden="true">
        <Sun size={17} />
      </span>
      <span className={styles.icon} data-active={isDark} aria-hidden="true">
        <Moon size={17} />
      </span>
    </button>
  );
}
