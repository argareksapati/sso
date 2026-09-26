# Security Notes

## Baseline

- Portal bukan authorization server.
- Production memakai OIDC Authorization Code + PKCE melalui IdP yang disetujui.
- Redirect dan return URL menggunakan allowlist; wildcard production dilarang.
- Cookie session `HttpOnly`, `Secure` di production, dan `SameSite=Lax` atau lebih ketat berdasarkan flow.
- Secret hanya melalui environment/secret manager dan tidak pernah masuk repository atau log.
- Password dan token lengkap tidak dicatat.
- Claim memakai subject UUID internal dan allowlist per client.
- CSP, HSTS production, anti-clickjacking, MIME sniffing protection, dan referrer policy diterapkan.
- Rate limiting, lockout, MFA, recovery assurance, session lifetime, dan refresh rotation harus dikunci bersama IdP.

## Development mock

- Wajib opt-in melalui environment.
- Ditolak saat runtime production.
- Hanya memakai akun sintetis.
- Tidak mengimplementasikan endpoint OAuth/OIDC atau token production.
- Tidak digunakan untuk compatibility claim atau UAT production.

## Review sebelum pilot

- metadata issuer/JWKS dan key rotation;
- client type, redirect/logout URI, origin, scope, audience, dan claim;
- state/nonce/PKCE dan callback replay;
- session fixation, rotation, expiry, revocation, concurrent session, dan logout;
- CSRF, CSP, CORS, clickjacking, open redirect, SSRF, XSS, dan cache behavior;
- enumeration, brute force, rate limit, recovery, MFA bypass, dan audit integrity;
- privacy, retention, operator access, backup, restore, incident, dan key rotation.
