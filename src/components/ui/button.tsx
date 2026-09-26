import type { ButtonHTMLAttributes } from "react";

import styles from "./button.module.css";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  variant?: "primary" | "secondary" | "danger";
};

export function Button({ children, loading = false, variant = "primary", className = "", disabled, ...props }: Props) {
  return (
    <button className={`${styles.button} ${styles[variant]} ${className}`} disabled={disabled || loading} {...props}>
      {loading && <span className={styles.spinner} aria-hidden="true" />}
      <span>{loading ? "Memproses…" : children}</span>
    </button>
  );
}
