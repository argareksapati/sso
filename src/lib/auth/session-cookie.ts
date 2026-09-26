export function sessionCookieOptions(
  expiresAt?: number,
  production = process.env.NODE_ENV === "production",
) {
  return {
    httpOnly: true,
    secure: production,
    sameSite: "lax" as const,
    path: "/",
    ...(expiresAt ? { expires: new Date(expiresAt * 1000) } : {}),
  };
}
