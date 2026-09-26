import Image from "next/image";

import styles from "./service-identity.module.css";

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toLocaleUpperCase("id-ID");
}

export function ServiceIdentity({ name, detail, logoPath, meta }: {
  name: string;
  detail: string;
  logoPath?: string;
  meta?: React.ReactNode;
}) {
  return (
    <div className={styles.identity}>
      <span className={styles.mark} aria-hidden="true">
        {logoPath
          ? <Image src={logoPath} alt="" width={52} height={52} sizes="52px" />
          : initials(name)}
      </span>
      <div className={styles.body}>
        <h3>{name}</h3>
        <p>{detail}</p>
        {meta && <div className={styles.meta}>{meta}</div>}
      </div>
    </div>
  );
}
