# Inventaris Screen Stitch SSO Bandung

Sumber desain: `https://stitch.withgoogle.com/projects/6657328588435333414`

Proyek mencakup login, dashboard profil, log aktivitas, profil, kata sandi,
sesi perangkat, aplikasi terkoneksi, dan notifikasi. Revisi navigasi diterapkan
pada shell portal. Pada 26 September 2026 proyek utama meminta Google Sign-In dan
screen langsung tidak mengirim data desain kepada sesi anonim. Karena itu,
pemetaan screen ke state desktop/mobile dilakukan setelah export atau akses publik
tersedia.

## Screen identifier

```text
6ba144d3c6274482a112a6275f34ddb5
3082157593425771627
8448461564466716297
15492258111600865382
2643978336137541032
10546076135462879010
9631367537496669371
16321579730679364736
8748149118677797459
9561637334207498134
2599054383519832380
1429678893934661026
964793130868947995
18080433097643828240
450220755791345285
17661366486322054113
14569506472700151211
257052249bd9424584bca9409f2cf6ee
1983606845273514183
3164444933049374025
11805046098389346035
69ee1be326d44d3e966481ee312cd388
9915678480472794116
17333810466025811225
16273826120007737001
5825048609491409447
```

## Route implementasi

| Area | Route |
|---|---|
| Login | `/login` |
| Dashboard profil | `/portal` |
| Semua layanan | `/portal/layanan` |
| Profil saya | `/portal/pengaturan/profil` |
| Kata sandi | `/portal/pengaturan/password` |
| Sesi perangkat | `/portal/pengaturan/sesi` |
| Aplikasi terkoneksi | `/portal/pengaturan/aplikasi` |
| Notifikasi | `/portal/pengaturan/notifikasi` |
| Log aktivitas | `/portal/pengaturan/aktivitas` |

## Batas implementasi

- Data profil lengkap menunggu master identity dan allowlist claim IdP.
- Perubahan kata sandi harus memakai flow resmi IdP.
- Inventaris sesi lintas perangkat menunggu session store pusat.
- Aplikasi terkoneksi harus berasal dari consent/assignment client yang nyata.
- Log aktivitas lintas aplikasi menunggu audit store pusat.
- Preferensi notifikasi menunggu channel dan API penyimpanan yang disetujui.
