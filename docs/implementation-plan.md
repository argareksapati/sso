# Rencana Implementasi Awal

## Status implementasi — 26 September 2026

Foundation dan vertical slice autentikasi lokal sudah selesai. Login/logout mock,
state gagal, recovery generik, portal kosong, route state, CSP nonce, cookie policy,
accessibility, responsive checks, visual regression, build production, dan workflow
CI sudah tersedia. Integrasi IdP nyata tetap menunggu keputusan pada bagian TBD.

Shell portal dan delapan area desain Stitch juga sudah dipetakan ke route implementasi:

```text
/login
/portal
/portal/layanan
/portal/pengaturan/profil
/portal/pengaturan/password
/portal/pengaturan/sesi
/portal/pengaturan/aplikasi
/portal/pengaturan/notifikasi
/portal/pengaturan/aktivitas
```

Kontrol yang memerlukan master identity, audit store, session store, atau notification
provider sengaja bersifat read-only sampai IdP final menyediakan API resminya.

## Sasaran vertical slice

Implementasi awal membuktikan pengalaman autentikasi tanpa mengunci Identity Provider (IdP) yang belum diputuskan. Portal web bertindak sebagai relying party. Ia tidak menerbitkan token OAuth/OIDC produksi dan tidak menyimpan kata sandi pengguna.

## Requirement yang sudah terkonfirmasi

- Produk adalah rebuild SSO Layanan Kota Bandung; produksi lama tetap berjalan selama pengembangan.
- Pengalaman pertama berfokus pada login akun lama.
- MVP memerlukan login, recovery, session, portal layanan, admin, audit, dan integrasi satu aplikasi pilot.
- Integrasi baru menggunakan OAuth 2.0 Authorization Code Flow, OpenID Connect, dan PKCE.
- Redirect URI dan return URL harus divalidasi ketat.
- UI harus mobile-first, dapat dioperasikan dengan keyboard, dan menargetkan WCAG 2.2 AA.
- Aplikasi Next.js hanya menjadi UI/portal dan adapter autentikasi. Authorization server custom dilarang.
- Data layanan dan aktivitas tidak boleh direka seolah data pemerintah sungguhan.

## Keputusan yang masih TBD

- IdP final dan ownership-nya.
- Master identity serta identifier login final.
- Kompatibilitas hash kata sandi dan strategi migrasi akun lama.
- Aplikasi pilot, redirect URI, logout URI, audience, dan claim minimum.
- Kebijakan MFA, lockout, session lifetime, refresh token, dan single logout.
- Channel recovery dan layanan pengiriman pesan.
- Domain, infrastruktur staging, WAF, monitoring, dan pengelola secret.
- Brand guide, logo, warna, dan tipografi resmi Kota Bandung.
- Apakah registrasi mandiri dan Google login dipertahankan.
- Pengganti CAPTCHA dan kebijakan "ingat perangkat".
- Nama serta URL resmi aplikasi pada satu tautan Google Share yang belum teridentifikasi.
- Boundary integrasi Mobile JKN: client SSO, deep-link, atau sistem Puskesmas lain.

## Information architecture awal

```text
Publik
├── /login
├── /lupa-kata-sandi
├── /pemulihan/dikirim
├── /reset-kata-sandi
├── /session-berakhir
├── /tidak-berwenang
├── /pemeliharaan
└── /bantuan

Terautentikasi
├── /portal
├── /portal/layanan
├── /akun
├── /akun/keamanan
└── /akun/sesi

Administrasi (milestone berikutnya)
└── /admin
    ├── /pengguna
    ├── /aplikasi
    ├── /peran
    ├── /sesi
    └── /audit
```

## Tahapan

1. Foundation: Next.js, lint, typecheck, token visual, primitive komponen, security headers.
2. Authentication UX: login dan state autentikasi, validation, loading, generic error, recovery.
3. Portal: shell, daftar layanan yang berasal dari repository adapter, search/filter, empty state.
4. Auth adapter: interface, mock development, adapter OIDC setelah metadata IdP tersedia.
5. Admin: client, user, role, session, dan audit.
6. Pilot: integrasi aplikasi yang dipilih, E2E, security review, UAT, dan rollback rehearsal.

Daftar kandidat dan gate per aplikasi didokumentasikan pada
[integration-inventory.md](integration-inventory.md).

## File awal

```text
src/app/                         route dan layout
src/components/auth/             form dan layout autentikasi
src/components/ui/               primitive UI
src/lib/auth/                    contract provider, session, return URL
src/lib/audit/                   contract audit event
src/lib/services/                repository direktori layanan
tests/                           unit dan Playwright/axe
docs/                            arsitektur, flow, migrasi, security
```

## Gate vertical slice

- Login mock sukses dan gagal dapat diuji tanpa kredensial produksi.
- Mock provider tidak dapat aktif saat `NODE_ENV=production`.
- Cookie session `HttpOnly`, `SameSite=Lax`, dan `Secure` di production.
- Arbitrary return URL ditolak.
- Error login generik dan tidak mengungkap keberadaan akun.
- Login, recovery, session expired, forbidden, dan maintenance responsif pada 360–1440 px.
- Keyboard flow dan axe tidak memiliki pelanggaran serius/kritis.
- Lint, typecheck, build, unit, E2E, dan visual screenshot lulus.
