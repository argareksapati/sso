import styles from "./form.module.css";

export function GoogleMark() {
  return (
    <svg className={styles.googleMark} viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5a5.6 5.6 0 0 1-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9Z" />
      <path fill="#34A853" d="M12 24c3.2 0 5.9-1.1 7.8-2.9l-3.7-2.9c-1 .7-2.4 1.1-4.1 1.1-3.1 0-5.8-2.1-6.7-5.1l-3.8 2.9A11.8 11.8 0 0 0 12 24Z" />
      <path fill="#FBBC05" d="M5.3 14.2A7.2 7.2 0 0 1 4.9 12c0-.8.1-1.5.4-2.2L1.5 6.9A12 12 0 0 0 0 12c0 1.9.5 3.6 1.5 5.1l3.8-2.9Z" />
      <path fill="#EA4335" d="M12 4.7c1.8 0 3.4.6 4.6 1.8L20 3.1A11.5 11.5 0 0 0 12 0 11.8 11.8 0 0 0 1.5 6.9l3.8 2.9c.9-3 3.6-5.1 6.7-5.1Z" />
    </svg>
  );
}
