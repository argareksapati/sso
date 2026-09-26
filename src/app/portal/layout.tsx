import { redirect } from "next/navigation";

import { PortalShell } from "@/components/portal/portal-shell";
import { getSession } from "@/lib/auth/session";

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login?returnTo=/portal");
  return <PortalShell displayName={session.displayName}>{children}</PortalShell>;
}
