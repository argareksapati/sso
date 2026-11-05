import type { AuthIdentity } from "./contracts";

const administrativeRoles = new Set(["admin", "operator", "sso_admin"]);

function normalizedAdminEmails() {
  return new Set(
    (process.env.SSO_ADMIN_EMAILS ?? "")
      .split(",")
      .map((email) => email.trim().toLocaleLowerCase("id-ID"))
      .filter(Boolean),
  );
}

export function isAdministrativeIdentity(identity: Pick<AuthIdentity, "email" | "roles">) {
  const adminEmails = normalizedAdminEmails();
  if (adminEmails.size > 0) {
    const email = identity.email?.trim().toLocaleLowerCase("id-ID");
    return Boolean(email && adminEmails.has(email));
  }

  const hasAdministrativeRole = identity.roles.some((role) =>
    administrativeRoles.has(role.trim().toLocaleLowerCase("id-ID")),
  );
  return hasAdministrativeRole;
}
