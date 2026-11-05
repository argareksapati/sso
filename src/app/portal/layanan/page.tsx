import type { Metadata } from "next";

import { ServiceCatalog } from "@/components/portal/service-catalog";
import { isAdministrativeIdentity } from "@/lib/auth/authorization";
import { getSession } from "@/lib/auth/session";
import { listExistingSsoCatalog } from "@/lib/services/repository";
import styles from "./catalog.module.css";

export const metadata: Metadata = { title: "Daftar Layanan" };

export default async function ServicesPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const [services, params, session] = await Promise.all([listExistingSsoCatalog(), searchParams, getSession()]);
  const initialQuery = typeof params.q === "string" ? params.q : "";
  const isAdmin = Boolean(session && isAdministrativeIdentity(session));

  return (
    <div className={styles.catalogPage}>
      <ServiceCatalog services={services} initialQuery={initialQuery} admin={isAdmin} />
    </div>
  );
}
