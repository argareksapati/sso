import type { AuthIdentity } from "./contracts";

export type SupabaseUserIdentity = {
  id: string;
  email?: string;
  user_metadata?: Record<string, unknown>;
  app_metadata?: Record<string, unknown>;
};

function safeDisplayName(user: SupabaseUserIdentity) {
  const candidates = [
    user.user_metadata?.full_name,
    user.user_metadata?.name,
    user.user_metadata?.display_name,
    user.email?.split("@")[0],
  ];
  const value = candidates.find((candidate): candidate is string => typeof candidate === "string" && candidate.trim().length > 0);
  return value?.trim().slice(0, 120) || "Pengguna SSO";
}

function safeRoles(user: SupabaseUserIdentity) {
  const roles = user.app_metadata?.roles;
  if (!Array.isArray(roles)) return ["authenticated"];
  const normalized = roles
    .filter((role): role is string => typeof role === "string")
    .map((role) => role.trim())
    .filter(Boolean)
    .slice(0, 20);
  return normalized.length > 0 ? normalized : ["authenticated"];
}

export function mapSupabaseIdentity(user: SupabaseUserIdentity): AuthIdentity {
  if (!user.id.trim()) throw new Error("Supabase user id tidak valid.");
  return {
    subject: `supabase:${user.id}`,
    displayName: safeDisplayName(user),
    roles: safeRoles(user),
  };
}

