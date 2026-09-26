# SSO Layanan Kota Bandung — Rebuild

Fondasi staging untuk membangun ulang pengalaman SSO Layanan Kota Bandung. Repository ini tidak menggantikan `sso.bandung.go.id`, tidak menyimpan password produksi, dan tidak mengimplementasikan authorization server custom.

## Status

Milestone aktif: portal akun, UI sesuai rancangan, dan adapter Supabase Auth untuk login email/password. Identity source, migrasi akun, aplikasi pilot, branding resmi, OAuth client SSO, dan deployment staging masih menunggu keputusan PIC.

Arahan integrasi awal mencakup layanan Disdukcapil, SIPETRUK, SIMPELMAN, SPMB
Kota Bandung, GAMPIL, serta boundary layanan Puskesmas/Mobile JKN. Semuanya
ditampilkan sebagai kandidat discovery dan belum memiliki launch URL production.

## Menjalankan local

Prasyarat: Node.js 24+ dan npm.

```bash
npm install
copy .env.example .env.local
npm run dev
```



## Pemeriksaan

```bash
npm run lint
npm run typecheck
npm run test:unit
npm run test:e2e
npm run build
```

Setelah `npm run build`, pemeriksaan CSP production dapat dijalankan terhadap
instance `next start` yang aktif:

```bash
npm run verify:production:running
```

Verifikasi ini memeriksa nonce script, larangan `unsafe-eval`, hidrasi halaman,
dan error console. Flag cookie production diuji melalui unit test karena mock
provider memang ditolak pada runtime production.

Playwright mengatur akun sintetis sendiri. Jalankan `npx playwright install chromium` satu kali bila browser belum tersedia.

## Arsitektur

```text
Next.js UI / Portal
        │
        ▼
AuthProvider contract
        │
        ├── mock local/test
        └── OIDC adapter (TBD)
                │
                ▼
          approved Identity Provider
```

Portal adalah relying party. OIDC Authorization Code + PKCE akan dihubungkan setelah issuer, client, callback, scope, claim, session, dan logout policy tersedia.

## Dokumentasi

- [PRD v0.2](docs/PRD_SSO_Bandung_Rebuild_v0.2.md)
- [Rencana implementasi](docs/implementation-plan.md)
- [Existing SSO discovery](docs/existing-sso-discovery.md)
- [Arsitektur](docs/architecture.md)
- [Authentication flow](docs/authentication-flow.md)
- [Design system](docs/design-system.md)
- [Migration plan](docs/migration-plan.md)
- [Security notes](docs/security-notes.md)
- [Inventaris kandidat integrasi](docs/integration-inventory.md)
