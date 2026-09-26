import type { InputHTMLAttributes } from "react";

import styles from "./form-field.module.css";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  hint?: string;
  trailing?: React.ReactNode;
};

export function FormField({ label, error, hint, trailing, id, ...props }: Props) {
  const errorId = error ? `${id}-error` : undefined;
  const hintId = hint ? `${id}-hint` : undefined;
  return (
    <div className={styles.field}>
      <div className={styles.labelRow}>
        <label htmlFor={id}>{label}</label>
        {trailing}
      </div>
      <input id={id} aria-invalid={Boolean(error)} aria-describedby={errorId || hintId} {...props} />
      {error ? <p className={styles.error} id={errorId}>{error}</p> : hint ? <p className={styles.hint} id={hintId}>{hint}</p> : null}
    </div>
  );
}
