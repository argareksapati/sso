import Link from "next/link";

import styles from "./legal-page.module.css";

type Section = {
  title: string;
  paragraphs?: readonly string[];
  items?: readonly string[];
};

export function LegalPage({
  eyebrow,
  title,
  summary,
  sections,
}: {
  eyebrow: string;
  title: string;
  summary: string;
  sections: readonly Section[];
}) {
  return (
    <article className={styles.page}>
      <header>
        <p className={styles.eyebrow}>{eyebrow}</p>
        <h1>{title}</h1>
        <p className={styles.summary}>{summary}</p>
        <p className={styles.updated}>Terakhir diperbarui: 9 Oktober 2026</p>
      </header>

      <div className={styles.sections}>
        {sections.map((section) => (
          <section key={section.title}>
            <h2>{section.title}</h2>
            {section.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            {section.items && <ul>{section.items.map((item) => <li key={item}>{item}</li>)}</ul>}
          </section>
        ))}
      </div>

      <footer className={styles.actions}>
        <Link href="/login">Kembali ke halaman masuk</Link>
        <Link href="/bantuan">Pusat Bantuan</Link>
      </footer>
    </article>
  );
}
