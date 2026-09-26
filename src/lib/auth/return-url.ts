const DEFAULT_RETURN_URL = "/portal";

export function normalizeReturnUrl(value: unknown): string {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//")) {
    return DEFAULT_RETURN_URL;
  }

  if (value.includes("\\") || value.includes("\u0000")) return DEFAULT_RETURN_URL;

  try {
    const parsed = new URL(value, "https://sso.local");
    if (parsed.origin !== "https://sso.local") return DEFAULT_RETURN_URL;
    if (parsed.pathname.startsWith("/api/") || parsed.pathname === "/login") {
      return DEFAULT_RETURN_URL;
    }
    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return DEFAULT_RETURN_URL;
  }
}
