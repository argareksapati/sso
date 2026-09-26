# Inventaris Kandidat Integrasi

## Arahan yang diterima

SSO dibangun dari nol dan dipakai sebagai pusat autentikasi serta portal akses
untuk aplikasi layanan. Daftar awal yang disampaikan pada 26 September 2026:

1. layanan Disdukcapil Kota Bandung;
2. SIPETRUK;
3. SIMPELMAN;
4. SPMB Kota Bandung;
5. GAMPIL;
6. layanan pendaftaran Puskesmas yang dikaitkan dengan Mobile JKN;
7. satu tautan Google Share tanpa nama aplikasi yang masih perlu diidentifikasi.

Daftar ini adalah **kandidat integrasi**, bukan bukti bahwa aplikasi sudah
mendukung OAuth 2.0/OIDC atau sudah aman untuk menerima session SSO.

## Inventaris teknis awal

| Aplikasi | Pemilik/ranah | Referensi yang teridentifikasi | Klasifikasi awal | Yang harus dikonfirmasi |
|---|---|---|---|---|
| Layanan Disdukcapil Kota Bandung | Disdukcapil Kota Bandung | `disdukcapil.bandung.go.id`; layanan digital resmi mencakup Salaman | Discovery | Aplikasi tepat dari tautan yang dibagikan, owner teknis, user store, protokol auth, callback/logout URI |
| SIPETRUK | Dinas Cipta Bintar | `https://www.diciptabintar.bandung.go.id/auth/login` | Kandidat web Pemkot | Stack, akses source, skema akun, kemampuan OIDC, role/claim, callback/logout URI |
| SIMPELMAN | Dinas Cipta Bintar | `https://diciptabintar.bandung.go.id/simpelman/layanan` | Kandidat web Pemkot | Flow login aktual, akses source, skema akun, kemampuan OIDC, role/claim |
| SPMB Kota Bandung | Dinas Pendidikan Kota Bandung | `https://spmb.bandung.go.id/home` | Kandidat web Pemkot | Siklus akun musiman, wali/murid/operator, peak load, recovery, role/claim |
| GAMPIL | DPMPTSP Kota Bandung | Referensi resmi DPMPTSP dan aplikasi mobile | Kandidat mobile Pemkot | Versi aplikasi yang aktif, mobile deep-link/app-link, PKCE, backend token exchange, logout |
| Mobile JKN / layanan Puskesmas | BPJS Kesehatan dan layanan kesehatan | Aplikasi eksternal yang disebut untuk proses Puskesmas | Review eksternal | Apakah target sebenarnya Mobile JKN, sistem Puskesmas milik Pemkot, atau hanya deep-link; dasar kerja sama dan API resmi |
| Aplikasi belum teridentifikasi | TBD | Google Share `UhTHvBHWlcbpperpL` | Belum dapat dipetakan | Nama, owner, URL resmi, fungsi, dan PIC teknis |

Google Share yang dikirim tidak membuka target asli pada pemeriksaan otomatis.
URL resmi harus dikonfirmasi langsung oleh PIC sebelum dimasukkan ke registry
client atau ditampilkan sebagai tautan aktif.

## Model integrasi yang dituju

```text
Pengguna
   │ satu identitas
   ▼
SSO Kota Bandung / IdP
   │ Authorization Code + PKCE
   ▼
Portal layanan
   ├── SIPETRUK
   ├── SIMPELMAN
   ├── SPMB
   ├── layanan Disdukcapil
   ├── GAMPIL
   └── integrasi eksternal yang disetujui
```

SSO tidak menyalin proses bisnis aplikasi. Setiap aplikasi tetap menyimpan data
layanannya sendiri dan hanya menerima identitas serta claim minimum yang telah
disetujui.

## Gate sebelum aplikasi diaktifkan

- owner produk dan PIC teknis terkonfirmasi;
- URL production/staging serta source repository terpetakan;
- metode login dan user store lama terdokumentasi;
- redirect URI, post-logout URI, origin, scope, audience, dan claim di-allowlist;
- Authorization Code + PKCE, state, nonce, dan rotasi key dapat diterapkan;
- mapping akun lama, duplicate identity, recovery, dan rollback diuji;
- security, privacy, load, accessibility, UAT, dan audit trail lulus;
- client baru tetap dapat dimatikan tanpa memutus aplikasi lama.

## Kandidat pilot

Secara teknis SIPETRUK atau SIMPELMAN layak diperiksa lebih dahulu karena
keduanya merupakan aplikasi web pada host resmi Dinas Cipta Bintar. Ini masih
hipotesis perencanaan; keputusan pilot tetap memerlukan akses source, PIC, dan
hasil discovery autentikasi.
