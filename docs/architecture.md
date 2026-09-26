# Arsitektur Awal

## Boundary

```text
Browser
  │ secure application session
  ▼
Next.js UI / Portal (relying party)
  │ AuthProvider contract
  ├── DevelopmentMockProvider (local/test only)
  └── OidcProviderAdapter (TBD setelah IdP dipilih)
         │ Authorization Code + PKCE
         ▼
      Identity Provider

Portal ── ServiceRepository ── sumber direktori layanan (TBD)
Portal ── AuditSink ────────── penyimpanan audit terpusat (TBD)
```

Next.js tidak menjadi OAuth/OIDC authorization server. Password produksi hanya diproses oleh IdP final. Portal menerima hasil autentikasi melalui adapter standar dan menyimpan session aplikasi minimum dalam cookie aman.

## Aplikasi yang akan dihubungkan

Arahan terbaru menetapkan layanan Disdukcapil, SIPETRUK, SIMPELMAN, SPMB Kota
Bandung, GAMPIL, serta layanan Puskesmas/Mobile JKN sebagai kandidat awal. SSO
menjadi identity layer dan launch portal; proses perizinan, pemakaman,
pendidikan, kependudukan, dan kesehatan tetap berada pada aplikasi pemiliknya.

Mobile JKN berada di luar boundary Pemkot dan memerlukan jalur integrasi resmi
BPJS. Ia tidak dimasukkan sebagai client OIDC sebelum target serta kewenangannya
dipastikan. Inventaris lengkap ada di [integration-inventory.md](integration-inventory.md).

## Kontrak utama

- `AuthProvider`: memulai login, menyelesaikan callback, membaca identitas, logout, recovery, dan revoke session.
- `SessionStore`: menyimpan referensi session; implementasi produksi harus server-side atau memakai session IdP yang tervalidasi.
- `ServiceRepository`: saat ini mengembalikan inventaris kandidat tanpa launch URL. Implementasi production hanya boleh mengembalikan client aktif yang telah lolos registry dan policy akses.
- `AuditSink`: mencatat jenis event, outcome, waktu, actor subject internal, dan metadata minimum tanpa password/token/PII berlebih.

## Environment

- Local/test: mock provider eksplisit dengan akun sintetis.
- Staging: IdP staging dan client staging; tidak menggunakan production credentials.
- Production: hanya provider yang disetujui, HTTPS, secret manager, monitoring, dan audit sink.

## Keputusan tertunda

ADR akan dibuat setelah IdP, session store, deployment platform, database, audit sink, dan aplikasi pilot diputuskan.
