import Link from "next/link";
import type { LucideIcon } from "lucide-react";

import styles from "./status-content.module.css";

export function StatusContent({
  icon: Icon,
  eyebrow,
  title,
  description,
  primaryHref = "/login",
  primaryLabel = "Kembali ke halaman masuk",
  children,
}: {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  description: string;
  primaryHref?: string;
  primaryLabel?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={styles.status}>
      <span className={styles.icon}><Icon size={27} strokeWidth={1.8} aria-hidden="true" /></span>
      <p className={styles.eyebrow}>{eyebrow}</p>
      <h1>{title}</h1>
      <p className={styles.description}>{description}</p>
      {children}
      <Link className={styles.primary} href={primaryHref}>{primaryLabel}</Link>
    </div>
  );
}
