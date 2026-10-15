import type { Metadata } from "next";

import { ServiceCatalog } from "@/components/portal/service-catalog";
import { listExistingSsoCatalog } from "@/lib/services/repository";
import styles from "../portal.module.css";

export const metadata: Metadata = { title: "Daftar Layanan" };

export default async function ServicesPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const [services, params] = await Promise.all([listExistingSsoCatalog(), searchParams]);
  const initialQuery = typeof params.q === "string" ? params.q : "";

  return (
    <div className={styles.catalogPage}>
      <ServiceCatalog services={services} initialQuery={initialQuery} />
    </div>
  );
}
