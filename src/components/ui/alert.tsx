import { MaterialIcon } from "./material-icon";
import styles from "./alert.module.css";

export function Alert({ children, tone = "info" }: { children: React.ReactNode; tone?: "info" | "error" | "success" }) {
  const icon = tone === "error" ? "error" : tone === "success" ? "check_circle" : "info";
  return (
    <div className={`${styles.alert} ${styles[tone]}`} role={tone === "error" ? "alert" : "status"}>
      <MaterialIcon name={icon} size={19} />
      <div>{children}</div>
    </div>
  );
}
