# Existing SSO Discovery

Tanggal observasi: 26 September 2026
Target observasi pasif: `https://sso.bandung.go.id/login`

Dokumen ini hanya mencatat informasi yang tampak dari respons publik. Belum ada akses source code, database, konfigurasi server, atau data pengguna produksi.

## Fakta teramati

- Halaman publik merespons dari aplikasi PHP 8.4 di belakang OpenResty.
- Frontend menggunakan Inertia dan aset JavaScript terbundel; pola route menunjukkan aplikasi Laravel.
- Login saat ini menggunakan alamat email dan kata sandi.
- Form menyediakan "Ingat saya", recovery kata sandi, CAPTCHA aritmetika, registrasi, dan login Google.
- Cookie session publik ditandai `Secure`, `HttpOnly`, dan `SameSite=Lax`; cookie XSRF terpisah tersedia.
- Respons mengirim HSTS.
- Route publik menunjukkan recovery, reset password, email verification, dan verifikasi WhatsApp.
- Route OAuth yang terlihat konsisten dengan Laravel Passport, termasuk authorize, token, refresh, device flow, approve, dan deny.
- Area profil yang terlihat dari manifest route mencakup profil, kata sandi, aktivitas, session, aplikasi terhubung, dan notifikasi.
- Area admin yang terlihat mencakup client OAuth, pengguna, pengajuan, verifikasi, session, audit log, settings, dan system health.

## Katalog publik yang teramati

Halaman publik yang terindeks pada tanggal observasi menampilkan 14 nama layanan:

1. Bandung Citizen Journalism;
2. DPMPTSP Bandung;
3. SALAMAN;
4. New Bimma;
5. Bandung Smart Map Plus;
6. Bandung Opendata;
7. Arimbi Bandung;
8. Bandung Kita;
9. Bandung Sadayana;
10. AI Asisten Bandung;
11. Gercep Asik;
12. BSM Pro;
13. Perizinan Bandung; dan
14. Management PEMDI.

Nama pada daftar ini adalah bukti keberadaan entri katalog pada SSO lama. Daftar
tersebut tidak membuktikan bahwa client masih aktif, protokolnya aman, atau dapat
langsung dipindahkan ke implementasi baru. Detail registry client tetap harus
diminta dari PIC tanpa menyertakan client secret.

## Hal yang belum diketahui

- Versi framework, package, konfigurasi Laravel Passport, dan patch level.
- User store, password hashing, identity source, duplikasi akun, dan kualitas data.
- Daftar client aktif, redirect URI, grant, scope, audience, dan claim aktual.
- Token lifetime, refresh rotation, revocation semantics, dan key management.
- Session store, concurrent session policy, single logout, dan remember-device policy.
- MFA, lockout, brute-force protection, rate limit, CAPTCHA policy, dan recovery assurance.
- Integrasi Google/WhatsApp, ownership, data sharing, dan failure mode.
- Infrastruktur, deployment, backup, restore, monitoring, alerting, dan DR.
- Kemungkinan migrasi password tanpa reset.

## Data yang perlu diminta dari PIC

1. Diagram deployment dan ownership komponen.
2. Export client tanpa secret, termasuk redirect/logout URI dan protocol.
3. Schema identitas dan statistik kualitas data yang sudah dianonimkan.
4. Kebijakan password, MFA, lockout, session, token, recovery, audit, dan retention.
5. Contoh token dengan nilai disamarkan serta metadata issuer/JWKS.
6. Daftar aplikasi, PIC, environment, source availability, dan risiko migrasi.
7. Runbook backup/restore, incident, key rotation, dan rollback yang berlaku.

## Batas penggunaan temuan

Temuan publik ini membantu compatibility mapping. Temuan ini tidak membuktikan konfigurasi internal dan tidak menjadi dasar untuk menyalin arsitektur produksi ke implementasi baru.
