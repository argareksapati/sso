import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { ServiceCatalog } from "@/components/portal/service-catalog";
import { getSession } from "@/lib/auth/session";
import { listExistingSsoCatalog } from "@/lib/services/repository";
import styles from "../../layanan/catalog.module.css";

export const metadata: Metadata = { title: "Kelola Layanan SSO" };

export default async function AdminServicesPage() {
  const session = await getSession();
  if (!session) redirect("/login?returnTo=/portal/admin/layanan");
  const isAdmin = session.roles.some((role) => ["admin", "operator", "sso_admin"].includes(role.toLocaleLowerCase("id-ID")));
  if (!isAdmin) redirect("/tidak-berwenang");

  const services = await listExistingSsoCatalog();
  return <div className={styles.catalogPage}><ServiceCatalog services={services} admin /></div>;
}
