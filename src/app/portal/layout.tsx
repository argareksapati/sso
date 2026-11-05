import { redirect } from "next/navigation";

import { PortalShell } from "@/components/portal/portal-shell";
import { getSession } from "@/lib/auth/session";

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login?returnTo=/portal");
  const isAdmin = session.roles.some((role) => ["admin", "operator", "sso_admin"].includes(role.toLocaleLowerCase("id-ID")));
  return <PortalShell displayName={session.displayName} isAdmin={isAdmin}>{children}</PortalShell>;
}
