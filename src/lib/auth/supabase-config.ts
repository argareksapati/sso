import "server-only";

type SupabasePublicConfig = {
  url: string;
  publishableKey: string;
  projectRef: string;
};

function requireConfig(
  name: "NEXT_PUBLIC_SUPABASE_URL" | "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
  legacyName: "SUPABASE_URL" | "SUPABASE_PUBLISHABLE_KEY",
) {
  const value = process.env[name]?.trim() || process.env[legacyName]?.trim();
  if (!value) throw new Error(`${name} belum dikonfigurasi.`);
  return value;
}

export function getSupabasePublicConfig(): SupabasePublicConfig {
  const url = requireConfig("NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_URL");
  const projectRef = new URL(url).hostname.split(".")[0];
  if (!projectRef) throw new Error("NEXT_PUBLIC_SUPABASE_URL tidak valid.");

  return {
    url,
    publishableKey: requireConfig("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "SUPABASE_PUBLISHABLE_KEY"),
    projectRef,
  };
}

export function getAppOrigin() {
  const value = process.env.APP_ORIGIN?.trim();
  if (!value) throw new Error("APP_ORIGIN belum dikonfigurasi.");
  const origin = new URL(value);
  if (!/^https?:$/.test(origin.protocol)) throw new Error("APP_ORIGIN tidak valid.");
  return origin.origin;
}

export async function isSupabaseGoogleEnabled() {
  const { url, publishableKey } = getSupabasePublicConfig();
  const response = await fetch(`${url.replace(/\/$/, "")}/auth/v1/settings`, {
    headers: { apikey: publishableKey },
    cache: "no-store",
  });
  if (!response.ok) throw new Error("Konfigurasi Supabase Auth tidak dapat diperiksa.");

  const settings = await response.json() as { external?: { google?: boolean } };
  return settings.external?.google === true;
}
