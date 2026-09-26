import { AlertCircle, CheckCircle2, Info } from "lucide-react";

import styles from "./alert.module.css";

export function Alert({ children, tone = "info" }: { children: React.ReactNode; tone?: "info" | "error" | "success" }) {
  const Icon = tone === "error" ? AlertCircle : tone === "success" ? CheckCircle2 : Info;
  return (
    <div className={`${styles.alert} ${styles[tone]}`} role={tone === "error" ? "alert" : "status"}>
      <Icon size={19} aria-hidden="true" />
      <div>{children}</div>
    </div>
  );
}
