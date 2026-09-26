export function isSameOriginRequest(request: Request): boolean {
  const expectedOrigin = process.env.APP_ORIGIN || new URL(request.url).origin;
  const origin = request.headers.get("origin");
  return origin === expectedOrigin;
}
