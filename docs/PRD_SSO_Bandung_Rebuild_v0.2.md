# Product Requirements Document (PRD)
## Rebuild Single Sign-On (SSO) Layanan Kota Bandung

**Nama Produk:** SSO Layanan Kota Bandung  
**Instansi:** Dinas Komunikasi dan Informatika Kota Bandung  
**Jenis Proyek:** Rebuild / Replacement Existing SSO  
**Versi Dokumen:** 0.2  
**Status:** Draft untuk Validasi Requirement  
**Tanggal:** 21 September 2026  
**Product Owner / PIC:** TBD  
**Tim Pengembangan:** TBD  

---

# 1. Executive Summary

SSO Layanan Kota Bandung adalah sistem autentikasi terpusat yang digunakan sebagai pintu masuk menuju berbagai layanan digital Pemerintah Kota Bandung.

Saat ini SSO sudah tersedia dan digunakan. Proyek ini bukan membuat konsep SSO dari nol karena sebelumnya belum ada sistem, melainkan **membangun ulang implementasi SSO yang sudah ada** dengan fokus utama pada:

- pengalaman pengguna yang lebih sederhana;
- desain antarmuka yang lebih profesional dan konsisten;
- arsitektur aplikasi yang lebih mudah dikembangkan;
- keamanan autentikasi yang kuat;
- integrasi layanan yang lebih terstruktur;
- kompatibilitas dengan aplikasi atau layanan yang sudah terhubung;
- proses migrasi yang aman dari sistem lama ke sistem baru.

Rebuild dilakukan karena pengalaman produk sebelumnya dinilai kurang baik dari sisi desain dan usability, sehingga diperlukan implementasi baru yang lebih matang dan tidak terasa seperti template generik.

Target akhirnya adalah menyediakan **satu identitas dan satu proses autentikasi untuk mengakses berbagai layanan digital Kota Bandung yang telah terintegrasi**.

---

# 2. Latar Belakang

Pemerintah Kota Bandung memiliki berbagai layanan digital yang digunakan oleh masyarakat maupun pengguna internal.

Sebagian layanan dapat memiliki:

- mekanisme login masing-masing;
- akun atau kredensial yang berbeda;
- pengelolaan sesi yang terpisah;
- struktur data pengguna yang berbeda;
- pengalaman antarmuka yang tidak konsisten.

SSO Bandung berfungsi untuk menyederhanakan proses tersebut dengan menyediakan autentikasi terpusat.

Existing SSO saat ini tetap menjadi referensi penting karena kemungkinan sudah memiliki:

- pengguna aktif;
- integrasi layanan;
- mekanisme autentikasi;
- session;
- token;
- aplikasi/client;
- proses recovery;
- data atau konfigurasi produksi.

Karena itu, proyek rebuild harus memperhatikan aspek **compatibility, migration, dan continuity**, bukan hanya mengganti tampilan.

---

# 3. Pernyataan Masalah

Masalah utama yang ingin diselesaikan:

1. Pengalaman login dan navigasi pada sistem sebelumnya perlu disederhanakan.
2. Desain produk sebelumnya dinilai kurang konsisten dan kurang mencerminkan layanan digital pemerintah yang matang.
3. Pengguna perlu memahami dengan cepat bahwa satu akun dapat digunakan untuk mengakses layanan yang terintegrasi.
4. Navigasi menuju layanan harus lebih jelas dan mudah digunakan.
5. Sistem harus tetap aman karena SSO menjadi pusat autentikasi banyak layanan.
6. Integrasi dengan aplikasi lama dan baru membutuhkan standar yang jelas.
7. Perubahan ke sistem baru tidak boleh mengganggu layanan produksi yang masih berjalan.
8. Sistem baru harus memiliki dokumentasi integrasi dan operasional yang lebih baik.

---

# 4. Visi Produk

> **Satu akun untuk mengakses berbagai layanan digital Kota Bandung dengan pengalaman yang sederhana, konsisten, aman, dan mudah dipahami.**

SSO baru harus terasa sebagai bagian dari ekosistem layanan resmi Pemerintah Kota Bandung, bukan sebagai landing page generik atau dashboard template.

---

# 5. Tujuan Produk

## 5.1 Tujuan Utama

### G-01 — Single Identity

Pengguna menggunakan satu identitas utama untuk mengakses layanan yang sudah terintegrasi.

### G-02 — Single Login

Pengguna tidak perlu melakukan autentikasi ulang setiap kali berpindah ke layanan lain selama session SSO masih valid dan aplikasi mendukung mekanisme SSO.

### G-03 — Better User Experience

Pengalaman login, recovery, profil, dan pemilihan layanan harus lebih sederhana daripada implementasi sebelumnya.

### G-04 — Consistent Design

SSO memiliki design system yang konsisten untuk seluruh halaman utama.

### G-05 — Secure Central Authentication

Authentication, session, MFA, token, audit, recovery, dan revocation dikelola secara aman dan terpusat.

### G-06 — Standardized Integration

Aplikasi baru dapat mengikuti standar integrasi yang terdokumentasi.

### G-07 — Safe Migration

Perpindahan dari existing SSO ke sistem baru dilakukan tanpa memutus layanan yang masih digunakan.

---

# 6. Non-Goals

Versi pertama tidak ditujukan untuk:

- mengganti seluruh sistem layanan Kota Bandung;
- menyatukan seluruh database aplikasi menjadi satu database;
- memberikan seluruh data pengguna kepada semua aplikasi;
- memaksa seluruh layanan pihak ketiga menggunakan SSO Bandung;
- menghapus sistem lama sebelum sistem baru lolos pengujian;
- membuat protokol autentikasi custom yang menggantikan standar OAuth/OIDC/SAML;
- menjadikan portal SSO sebagai media sosial atau aplikasi engagement harian.

---

# 7. Target Pengguna

Target pengguna final masih perlu divalidasi bersama Product Owner.

Kemungkinan kategori:

| Pengguna | Keterangan | Status |
|---|---|---|
| Masyarakat | Pengguna layanan publik Kota Bandung | TBD |
| ASN / Pegawai | Pengguna layanan internal pemerintah | TBD |
| Operator | Operator layanan tertentu | TBD |
| Administrator SSO | Pengelola sistem SSO | Required |
| Application Developer | Developer aplikasi yang mengintegrasikan SSO | Required |

---

# 8. Persona Utama

## Persona P-01 — Warga Pengguna Banyak Layanan

**Contoh kebutuhan:**

Seorang warga Kota Bandung ingin mengakses beberapa layanan digital pemerintah, seperti administrasi, pendidikan, perizinan, atau layanan lainnya.

Saat ini pengalaman autentikasi antar layanan belum selalu seragam. Pengguna dapat mengalami:

- login berulang;
- kredensial berbeda;
- lupa password;
- pengisian data berulang;
- kebingungan menentukan akun yang digunakan;
- navigasi yang tidak konsisten.

**Tujuan pengguna:**

> Masuk satu kali dan langsung dapat mengakses layanan yang dibutuhkan tanpa harus memahami detail teknis SSO.

---

# 9. Jobs To Be Done

## JTBD-01

Ketika saya perlu menggunakan layanan Kota Bandung, saya ingin login satu kali agar dapat membuka layanan yang terhubung tanpa mengulang autentikasi.

## JTBD-02

Ketika saya lupa kata sandi, saya ingin memulihkan akun dengan cepat tanpa harus menghubungi admin.

## JTBD-03

Ketika saya sudah login, saya ingin menemukan layanan yang saya cari dengan mudah.

## JTBD-04

Ketika saya menggunakan perangkat baru atau mencurigai aktivitas tertentu, saya ingin dapat melihat atau menghentikan session akun saya.

## JTBD-05

Ketika aplikasi baru ingin menggunakan SSO Bandung, developer harus memiliki panduan integrasi yang jelas.

---

# 10. Product Value Proposition

Nilai utama produk:

> **Satu akun, satu proses login, banyak layanan Kota Bandung.**

Manfaat utama:

- cukup mengingat satu akun utama;
- login lebih cepat;
- lebih sedikit autentikasi berulang;
- pengalaman antar layanan lebih konsisten;
- recovery akun lebih sederhana;
- keamanan autentikasi dikelola secara terpusat.

---

# 11. Product Principles

## 11.1 Government-First

Desain harus terasa resmi, stabil, dan dapat dipercaya.

Tidak menggunakan gaya visual yang terlalu menyerupai:

- landing page startup;
- template dashboard generik;
- desain eksperimental;
- UI dengan dekorasi berlebihan.

## 11.2 Function Before Decoration

Setiap komponen harus memiliki fungsi yang jelas.

Animasi, gradient, ilustrasi, dan dekorasi hanya digunakan jika membantu pengalaman pengguna.

## 11.3 Clear Hierarchy

Pengguna harus langsung memahami:

- berada di halaman apa;
- tindakan utama yang tersedia;
- status login;
- layanan yang tersedia;
- cara meminta bantuan.

## 11.4 Consistency

Seluruh produk menggunakan design system yang sama.

## 11.5 Mobile First

UI harus dirancang dengan mempertimbangkan akses melalui perangkat mobile sejak awal.

## 11.6 Accessibility

Desain harus mempertimbangkan:

- keyboard navigation;
- focus state;
- contrast;
- screen reader;
- touch target;
- error message;
- responsive typography.

## 11.7 Security by Default

Keamanan bukan fitur tambahan, tetapi requirement inti.

## 11.8 Data Minimization

Hanya data yang benar-benar diperlukan yang boleh diberikan kepada aplikasi terintegrasi.

---

# 12. Scope MVP

MVP minimal mencakup:

## Authentication

- login;
- logout;
- session management;
- lupa kata sandi;
- reset kata sandi;
- rate limiting;
- protection terhadap brute-force;
- account status.

## User Account

- profil dasar;
- pengelolaan akun;
- session aktif;
- revoke session;
- status akun.

## SSO Protocol

- OpenID Connect;
- OAuth 2.0 Authorization Code Flow;
- PKCE;
- redirect URI validation;
- token issuance;
- token validation;
- token expiration;
- token revocation.

## Portal Layanan

- daftar layanan;
- pencarian layanan;
- kategori layanan;
- detail singkat layanan;
- tombol akses layanan;
- status layanan bila dibutuhkan.

## Administration

- user management;
- client/application management;
- redirect URI management;
- role management;
- audit log;
- session revocation.

## Migration

- discovery existing system;
- inventory client;
- migration plan;
- staging environment;
- UAT;
- cutover plan;
- rollback plan.

---

# 13. Out of Scope MVP

Fitur berikut tidak wajib pada fase pertama kecuali diputuskan kemudian:

- Google Login;
- Apple Login;
- social login lain;
- biometric authentication;
- native mobile SDK;
- passkey untuk seluruh user;
- seluruh aplikasi Bandung langsung terintegrasi sekaligus;
- otomatisasi verifikasi Dukcapil tanpa API resmi;
- behavioral authentication;
- consent management kompleks;
- advanced device fingerprinting.

---

# 14. Jawaban Requirement Awal Produk

Berdasarkan diskusi awal:

## Q1 — Siapa yang menggunakan?

Warga Kota Bandung yang mengakses berbagai layanan pemerintah dengan pengalaman autentikasi yang saat ini belum selalu seragam.

## Q2 — Tindakan utama pada kunjungan pertama

**Login menggunakan akun lama.**

Asumsi ini berlaku jika user existing dimigrasikan atau tetap kompatibel.

## Q3 — Tiga fitur paling penting

1. Daftar sekali untuk semua layanan yang terintegrasi.
2. Login menggunakan identitas utama seperti email/nomor HP sesuai keputusan final.
3. Lupa sandi / account recovery otomatis.

## Q4 — Keunggulan utama

**Cukup mengingat satu akun/kata sandi utama untuk layanan yang terintegrasi.**

## Q5 — Alasan pengguna kembali

**SSO digunakan setiap kali pengguna mengakses layanan yang membutuhkan autentikasi.**

---

# 15. Existing System Discovery

Sebelum implementasi backend baru dikunci, tim harus melakukan audit terhadap SSO lama.

Minimal harus diketahui:

| Area | Pertanyaan |
|---|---|
| Identity Provider | Sistem apa yang digunakan sekarang? |
| User Store | User disimpan di mana? |
| Password | Bagaimana password dikelola? |
| Client | Aplikasi apa saja yang sudah terintegrasi? |
| Protocol | OIDC, OAuth, SAML, custom, atau lainnya? |
| Token | Jenis token dan lifetime saat ini? |
| Session | Bagaimana session dikelola? |
| Logout | Apakah ada single logout? |
| Recovery | Bagaimana reset password sekarang? |
| MFA | Apakah sudah ada MFA? |
| API | API apa yang tersedia? |
| Database | Struktur data dan ownership? |
| Infrastructure | Server / VM / container / cloud / on-prem? |
| Logging | Apakah audit log tersedia? |
| Monitoring | Apakah ada health monitoring? |
| Security | Temuan atau limitation existing system? |

Output discovery harus menjadi input untuk keputusan:

```text
Reuse
   atau
Migrate
   atau
Replace
```

---

# 16. Kandidat Layanan Terintegrasi

Berdasarkan requirement awal, kandidat layanan antara lain:

| Layanan | Jenis Integrasi | Status |
|---|---|---|
| Disdukcapil Kota Bandung | TBD | Discovery |
| SIPETRUK | TBD | Discovery |
| SIMPELMAN | TBD | Discovery |
| SPMB Kota Bandung | TBD | Discovery |
| SIGAMPIL | TBD | Discovery |
| Mobile JKN / layanan eksternal | Third-party / TBD | Discovery |
| Layanan lainnya | TBD | Discovery |

Daftar ini bukan jaminan bahwa semua layanan dapat melakukan true SSO.

---

# 17. Klasifikasi Integrasi

## Category A — Native SSO

Aplikasi sudah mendukung OIDC/OAuth/SAML.

## Category B — Application Modification

Aplikasi dimiliki pemerintah dan source code dapat dimodifikasi agar mendukung SSO.

## Category C — External Federation

Aplikasi pihak ketiga hanya dapat diintegrasikan jika provider menyediakan mekanisme resmi.

## Category D — Link Only

Layanan tampil di portal tetapi tetap menggunakan autentikasi sendiri.

Aplikasi kategori D tidak boleh disebut telah terintegrasi SSO.

---

# 18. Informasi Arsitektur Tingkat Tinggi

```text
                          Pengguna
                             │
                             ▼
                  Portal / Login SSO Baru
                             │
                             ▼
                     Identity Provider
                             │
          ┌──────────────────┼──────────────────┐
          │                  │                  │
          ▼                  ▼                  ▼
      SIPETRUK           SIMPELMAN            SPMB
          │                  │                  │
          ├──────────────────┼──────────────────┤
          ▼                  ▼                  ▼
      SIGAMPIL          DISDUKCAPIL        Layanan lain
```

Untuk aplikasi modern, protokol utama yang direkomendasikan:

```text
OpenID Connect
+
OAuth 2.0 Authorization Code Flow
+
PKCE
```

SAML dapat dipertimbangkan untuk legacy application.

---

# 19. Keputusan Teknologi

PRD tidak mengunci vendor identity provider pada tahap ini.

Kandidat seperti Keycloak dapat dievaluasi, tetapi keputusan final dilakukan setelah:

- existing system discovery;
- requirement infrastruktur;
- kebutuhan compatibility;
- security review;
- operational capability;
- migration feasibility.

Arsitektur ideal memisahkan:

```text
Portal / UI
    │
    ▼
Identity Provider
    │
    ▼
User Store / Database
```

---

# 20. User Flow — Login

```text
User membuka layanan
        │
        ▼
Application memeriksa session
        │
        ├── valid ──► masuk aplikasi
        │
        └── tidak valid
                │
                ▼
          Redirect ke SSO
                │
                ▼
              Login
                │
                ▼
        Authentication Success
                │
                ▼
        Authorization Code
                │
                ▼
        Application Backend
                │
                ▼
          Token Exchange
                │
                ▼
          User masuk aplikasi
```

---

# 21. User Flow — Portal

```text
User membuka SSO
      │
      ▼
     Login
      │
      ▼
Portal Layanan
      │
      ├── Cari layanan
      ├── Pilih kategori
      ├── Buka layanan
      └── Kelola akun
```

---

# 22. User Flow — Logout

```text
User
 │
 ▼
Logout
 │
 ▼
Session SSO diakhiri
 │
 ▼
Refresh token direvoke
 │
 ▼
Aplikasi mengikuti logout policy
```

Single Logout harus diuji per aplikasi karena kompatibilitas dapat berbeda.

---

# 23. User Flow — Lupa Kata Sandi

```text
Login
  │
  ▼
Lupa kata sandi
  │
  ▼
Masukkan identifier
  │
  ▼
Verifikasi recovery channel
  │
  ▼
Reset kata sandi
  │
  ▼
Revoke session lama sesuai policy
  │
  ▼
Login kembali
```

---

# 24. Information Architecture

Struktur portal kandidat:

```text
SSO Bandung
│
├── Login
├── Lupa Kata Sandi
├── Dashboard
│   ├── Layanan Favorit / Terakhir Digunakan
│   ├── Semua Layanan
│   ├── Kategori
│   └── Pencarian
├── Akun
│   ├── Profil
│   ├── Keamanan
│   ├── Session Aktif
│   └── Ubah Kata Sandi
├── Bantuan
└── Logout
```

Admin:

```text
Admin
│
├── Dashboard
├── Users
├── Applications / Clients
├── Roles
├── Sessions
├── Audit Log
└── Configuration
```

---

# 25. Screen Requirements

## 25.1 Login Page

Harus memiliki:

- identitas visual Kota Bandung;
- judul yang jelas;
- input identifier;
- input password;
- tombol masuk;
- tautan lupa kata sandi;
- informasi bantuan;
- informasi privasi;
- responsive design;
- loading state;
- error state.

Tidak boleh terasa seperti landing page pemasaran.

## 25.2 Dashboard

Harus menampilkan:

- salam / identitas user;
- pencarian layanan;
- layanan yang relevan;
- kategori layanan;
- status akses;
- navigasi akun;
- bantuan.

## 25.3 Account Security

Harus mencakup:

- ubah password;
- MFA jika tersedia;
- daftar session aktif;
- revoke session;
- aktivitas login jika fitur diaktifkan.

## 25.4 Error Pages

Minimal:

- 400;
- 401;
- 403;
- 404;
- 429;
- 500;
- maintenance;
- service unavailable.

Error harus ditulis dengan bahasa yang mudah dipahami pengguna.

---

# 26. Design System Requirements

Design system harus mencakup minimal:

## Foundation

- color tokens;
- typography;
- spacing;
- radius;
- elevation;
- iconography;
- grid;
- breakpoints.

## Components

- button;
- input;
- select;
- checkbox;
- radio;
- card;
- alert;
- badge;
- modal;
- drawer;
- tabs;
- table;
- pagination;
- breadcrumb;
- navbar;
- sidebar;
- tooltip;
- toast;
- skeleton;
- empty state;
- error state.

## Interaction State

Setiap komponen harus memiliki:

- default;
- hover;
- active;
- focus;
- disabled;
- loading;
- error;
- success bila relevan.

---

# 27. Anti-Pattern Desain

Desain baru harus menghindari:

- gradient berlebihan;
- glassmorphism tanpa fungsi;
- rounded card berlebihan;
- layout yang seluruhnya berupa card;
- icon dengan style campur;
- terlalu banyak shadow;
- animasi dekoratif;
- hero copy marketing;
- ilustrasi generik yang tidak relevan;
- visual yang membuat sistem terlihat seperti template AI;
- hierarchy yang tidak jelas;
- desain desktop-only.

---

# 28. Functional Requirements

## FR-01 — Login

User dapat login menggunakan identifier yang disetujui.

Identifier final:

**TBD**

Kandidat:

- email;
- nomor HP;
- username;
- NIK;
- NIP.

## FR-02 — Existing Account Compatibility

Jika requirement migrasi menetapkan bahwa existing user tetap digunakan, user lama harus dapat mengakses sistem baru tanpa membuat akun baru.

## FR-03 — Single Sign-On Session

User yang telah login tidak perlu mengulang password untuk aplikasi lain yang terintegrasi selama session masih valid.

## FR-04 — Logout

User dapat logout dan session utama diakhiri.

## FR-05 — Password Recovery

User dapat melakukan self-service recovery menggunakan channel yang disetujui.

## FR-06 — Session Management

User dapat melihat dan menghentikan session aktif.

## FR-07 — MFA

Sistem harus mendukung MFA.

Prioritas pertama:

- administrator;
- operator;
- privileged account.

## FR-08 — Service Directory

User dapat melihat daftar layanan yang tersedia.

## FR-09 — Service Search

User dapat mencari layanan berdasarkan nama atau kategori.

## FR-10 — Role-Based Access

Sistem mendukung role global dan role aplikasi.

Contoh:

```text
Global:
citizen
employee
operator
administrator

Application:
applicant
reviewer
approver
```

## FR-11 — Client Management

Admin dapat mengelola aplikasi/client.

Data minimum:

- application name;
- client ID;
- protocol;
- redirect URI;
- logout URI;
- allowed origins;
- client type;
- claims;
- status;
- PIC.

## FR-12 — Audit Logging

Aktivitas sensitif dicatat.

Minimal event:

- login success;
- login failed;
- logout;
- password reset;
- MFA change;
- role change;
- account disable;
- client create;
- client update;
- client delete;
- session revoke;
- admin login.

## FR-13 — Account Disable

Admin dapat disable/enable akun sesuai kewenangan.

## FR-14 — Application Status

Portal dapat menampilkan status layanan bila data tersebut tersedia.

## FR-15 — Help

User dapat menemukan informasi bantuan atau kontak support.

---

# 29. Identity Model

SSO menggunakan identifier internal yang tidak bergantung langsung pada data sensitif.

Contoh:

```text
user_id = UUID
```

External identity dapat berupa:

- NIK;
- NIP;
- email;
- nomor HP;
- identifier lain.

Token menggunakan internal subject:

```json
{
  "sub": "531f0ef9-8aaa-4652-a2c1-43c8ed79126e",
  "iss": "https://sso.example.bandung.go.id",
  "aud": "sipetruk",
  "roles": ["citizen"]
}
```

Domain di atas hanya contoh hingga domain final ditetapkan.

---

# 30. Claim and Data Sharing

Default policy:

> Aplikasi hanya menerima atribut yang memang dibutuhkan untuk menjalankan layanan.

Contoh:

```text
Application A:
sub
name

Application B:
sub
email
role
```

Tidak boleh secara default memasukkan:

- NIK;
- nomor KK;
- alamat lengkap;
- tanggal lahir;
- nomor telepon;
- seluruh profil pengguna;

ke setiap token/client.

---

# 31. Security Requirements

## 31.1 Authentication Security

Wajib mencakup:

- secure password hashing;
- rate limiting;
- brute-force mitigation;
- account lock policy;
- MFA;
- session expiration;
- secure recovery;
- login monitoring.

## 31.2 Protocol Security

Gunakan standar:

- OAuth 2.0;
- OpenID Connect;
- Authorization Code Flow;
- PKCE.

Tidak menggunakan OAuth Implicit Flow untuk implementasi baru.

## 31.3 Token Security

Token harus memiliki:

- issuer;
- audience;
- expiration;
- signature;
- key rotation support.

Refresh token harus mendukung:

- expiration;
- rotation;
- revocation.

## 31.4 Web Security

Minimal:

- HTTPS;
- Secure Cookie;
- HttpOnly Cookie;
- SameSite policy;
- CSRF protection;
- CSP;
- HSTS;
- input validation;
- output encoding;
- strict redirect URI validation;
- clickjacking protection;
- safe error handling.

## 31.5 Admin Security

Admin panel harus memiliki kontrol lebih ketat:

- MFA wajib;
- restricted authorization;
- strong audit log;
- session policy lebih ketat;
- sensitive action confirmation.

---

# 32. Privacy Requirements

Prinsip utama:

```text
Collect minimum
Store minimum
Expose minimum
Retain minimum
```

Data sensitif tidak boleh ditulis ke:

- URL query string;
- frontend debug log;
- analytics event;
- application error;
- client-side storage tanpa kebutuhan;
- audit log secara berlebihan.

Retention policy harus ditentukan sesuai kebijakan Diskominfo.

---

# 33. Non-Functional Requirements

## 33.1 Performance

Target awal:

| Requirement | Target Awal |
|---|---:|
| Login page initial load | < 2 detik pada kondisi normal |
| Authorization response | < 2 detik |
| Token endpoint | < 1 detik |
| Dashboard | < 3 detik |

Target final bergantung pada infrastruktur dan hasil load test.

## 33.2 Availability

SSO merupakan critical dependency.

Diperlukan:

- health check;
- monitoring;
- alerting;
- backup;
- restore procedure;
- disaster recovery plan;
- capacity planning.

## 33.3 Scalability

Sistem harus dapat ditingkatkan berdasarkan jumlah pengguna dan concurrent session.

Target user/concurrency: **TBD**.

## 33.4 Browser Compatibility

Minimal:

- Chrome;
- Edge;
- Firefox;
- Safari;
- mobile browser modern.

## 33.5 Responsive

Harus mendukung:

- mobile;
- tablet;
- desktop.

---

# 34. Accessibility Requirements

Target awal:

- semantic HTML;
- keyboard navigation;
- visible focus;
- contrast memadai;
- accessible form label;
- error yang jelas;
- screen reader compatibility;
- minimum touch target;
- tidak mengandalkan warna sebagai satu-satunya indikator.

Target standar WCAG final harus diputuskan.

---

# 35. Application Integration Checklist

Untuk setiap aplikasi, kumpulkan:

| Informasi | Required |
|---|---|
| Application Name | Yes |
| Production URL | Yes |
| Development/Staging URL | Yes |
| PIC | Yes |
| Technology Stack | Yes |
| Source Code Available | Yes |
| Current Authentication | Yes |
| OIDC Support | Yes |
| OAuth Support | Yes |
| SAML Support | Yes |
| API Available | Yes |
| User Identifier | Yes |
| Role Model | Yes |
| Logout Mechanism | Yes |
| Existing Client ID | Jika ada |
| Testing Environment | Yes |
| Migration Risk | Yes |

---

# 36. Integration Matrix

| Application | Owner | Source | Current Auth | OIDC | SAML | API | Integration |
|---|---|---|---|---|---|---|---|
| Disdukcapil | TBD | TBD | TBD | TBD | TBD | TBD | Discovery |
| SIPETRUK | TBD | TBD | TBD | TBD | TBD | TBD | Discovery |
| SIMPELMAN | TBD | TBD | TBD | TBD | TBD | TBD | Discovery |
| SPMB | TBD | TBD | TBD | TBD | TBD | TBD | Discovery |
| SIGAMPIL | TBD | TBD | TBD | TBD | TBD | TBD | Discovery |

---

# 37. Migration Strategy

Existing SSO harus tetap tersedia selama pembangunan versi baru.

## Environment

```text
Production Existing
sso.bandung.go.id
        │
        └── existing SSO

Development / Staging
        │
        └── new SSO
```

Setelah lolos validasi:

```text
New SSO
  │
  ▼
Production Cutover
  │
  ▼
sso.bandung.go.id
```

---

# 38. Migration Phases

## Phase M1 — Discovery

Audit existing:

- user;
- client;
- protocol;
- token;
- session;
- database;
- integration;
- infrastructure.

## Phase M2 — Compatibility Mapping

Tentukan apa yang:

- tetap digunakan;
- dimigrasikan;
- diganti;
- dihentikan.

## Phase M3 — Staging

Deploy sistem baru ke environment non-production.

## Phase M4 — Pilot Client

Integrasikan satu aplikasi sebagai pilot.

## Phase M5 — User Migration Test

Pastikan user existing dapat masuk sesuai strategi migrasi.

## Phase M6 — UAT

Pengujian bersama PIC dan stakeholder.

## Phase M7 — Security Assessment

Lakukan:

- source review;
- dependency review;
- authentication test;
- authorization test;
- session test;
- configuration review;
- penetration test.

## Phase M8 — Cutover

Alihkan production setelah seluruh gate lolos.

## Phase M9 — Rollback

Harus tersedia prosedur rollback jika masalah kritis ditemukan setelah cutover.

---

# 39. Product Development Phases

## Phase 1 — Requirement Discovery

Output:

- stakeholder requirement;
- existing system audit;
- user type;
- identity source;
- service inventory;
- integration inventory.

## Phase 2 — UX / Information Architecture

Output:

- sitemap;
- user flow;
- wireframe;
- content hierarchy;
- accessibility baseline.

## Phase 3 — Design System

Output:

- design tokens;
- component library;
- responsive specification;
- interaction states.

## Phase 4 — High-Fidelity UI

Output:

- login;
- dashboard;
- account;
- security;
- help;
- error states;
- admin.

## Phase 5 — Technical Architecture

Output:

- IdP decision;
- deployment architecture;
- database;
- protocol;
- session;
- token;
- logging;
- monitoring.

## Phase 6 — Development

Implementasi frontend, backend, integration, dan admin.

## Phase 7 — Pilot Integration

Integrasikan satu aplikasi.

## Phase 8 — Security & UAT

Validation sebelum production.

## Phase 9 — Production Migration

Cutover bertahap.

---

# 40. MVP Definition

MVP minimum:

```text
New SSO UI
+
Authentication
+
Existing account compatibility atau migration
+
Session
+
OIDC
+
Portal layanan
+
Account recovery
+
Admin
+
Audit log
+
1 aplikasi pilot
```

---

# 41. MVP Acceptance Criteria

## AC-01

Existing user yang termasuk dalam skenario migrasi dapat login menggunakan sistem baru.

## AC-02

User baru dapat login sesuai identity model yang disetujui.

## AC-03

SSO membuat session valid.

## AC-04

Aplikasi pilot dapat redirect user ke SSO.

## AC-05

Setelah autentikasi, user kembali ke aplikasi pilot.

## AC-06

User tidak perlu login ulang ketika membuka aplikasi terintegrasi lain selama session masih valid.

## AC-07

Token invalid atau expired ditolak.

## AC-08

Redirect URI yang tidak terdaftar ditolak.

## AC-09

Logout mengakhiri session sesuai policy.

## AC-10

Admin dapat revoke session.

## AC-11

Password tidak muncul dalam log/token.

## AC-12

Audit event utama tercatat.

## AC-13

UI berfungsi di mobile dan desktop.

## AC-14

Critical user journey dapat dilakukan dengan keyboard.

## AC-15

Staging tidak mengganggu existing production SSO.

## AC-16

Rollback plan telah diuji sebelum cutover.

---

# 42. UX Acceptance Criteria

## UX-01

Pengguna dapat menemukan form login tanpa kebingungan.

## UX-02

Primary CTA jelas.

## UX-03

Error login mudah dipahami.

## UX-04

Lupa password mudah ditemukan.

## UX-05

Dashboard memiliki hierarchy yang jelas.

## UX-06

User dapat mencari layanan.

## UX-07

Status login dan akun terlihat jelas.

## UX-08

Tidak ada komponen dekoratif yang mengganggu tugas utama.

## UX-09

Design system konsisten pada seluruh halaman utama.

## UX-10

Mobile layout tidak sekadar versi desktop yang diperkecil.

---

# 43. Success Metrics

Metric final perlu disepakati setelah baseline existing SSO diperoleh.

Kandidat:

## Authentication

- login success rate;
- login failure rate;
- password recovery completion rate;
- average login completion time.

## UX

- task completion rate;
- average time to find service;
- abandonment rate pada login;
- support request terkait login.

## Integration

- jumlah aplikasi terintegrasi;
- jumlah aplikasi migrated;
- failed authorization rate;
- integration incident count.

## Security / Reliability

- auth service availability;
- error rate;
- token endpoint error;
- suspicious login detection;
- mean time to recover.

---

# 44. Operational Requirements

Harus tersedia:

- deployment documentation;
- environment configuration;
- secrets management;
- backup procedure;
- restore procedure;
- monitoring dashboard;
- alerting;
- incident response procedure;
- key rotation procedure;
- log retention policy;
- admin onboarding/offboarding.

---

# 45. Documentation Requirements

Minimal tersedia:

1. Product Requirements Document.
2. System Architecture Document.
3. Authentication Flow Documentation.
4. OIDC Integration Guide.
5. Application Onboarding Guide.
6. Deployment Guide.
7. Configuration Guide.
8. Administrator Guide.
9. Security Hardening Guide.
10. Backup & Restore Guide.
11. Incident Response Guide.
12. Migration & Rollback Guide.
13. API / Claims Documentation.
14. Design System Documentation.

---

# 46. Risiko Produk

## R-01 — Legacy Compatibility

Aplikasi lama mungkin menggunakan mekanisme autentikasi non-standar.

**Mitigasi:** discovery dan pilot migration.

## R-02 — Existing User Migration

Password atau identity format lama mungkin tidak mudah dimigrasikan.

**Mitigasi:** evaluasi compatibility dan staged migration.

## R-03 — Third-Party Integration

Aplikasi eksternal tidak dapat dipaksa menggunakan SSO Bandung.

**Mitigasi:** federation resmi atau link-only.

## R-04 — Single Point of Failure

SSO down dapat mengganggu login ke banyak aplikasi.

**Mitigasi:** high availability, monitoring, backup, recovery.

## R-05 — Account Compromise

Satu akun dapat membuka beberapa layanan.

**Mitigasi:** MFA, monitoring, rate limiting, session control.

## R-06 — Excessive Data Sharing

Aplikasi dapat meminta data lebih banyak dari kebutuhan.

**Mitigasi:** claim minimization dan review per client.

## R-07 — UI Rebuild Without Backend Understanding

Rebuild hanya fokus tampilan dapat memutus compatibility.

**Mitigasi:** existing architecture discovery sebelum keputusan backend.

## R-08 — Big Bang Migration

Migrasi seluruh aplikasi sekaligus meningkatkan risiko.

**Mitigasi:** pilot + staged rollout.

---

# 47. Open Questions

Pertanyaan berikut harus dijawab sebelum requirement dinyatakan final.

## Identity

1. Siapa pengguna final: masyarakat, ASN, operator, atau semuanya?
2. Identifier login utama apa?
3. Apakah existing account tetap digunakan?
4. Dari mana master identity berasal?
5. Apakah user dapat self-register?
6. Apakah diperlukan verifikasi NIK?
7. Apakah ada API resmi untuk identity verification?

## Existing System

8. Teknologi SSO existing apa?
9. Bagaimana user/password existing disimpan?
10. Apa saja client existing?
11. Protokol apa yang digunakan?
12. Apakah ada custom API/login flow?
13. Bagaimana logout sekarang?
14. Apakah user migration memungkinkan tanpa reset password?

## Product

15. Aplikasi apa yang menjadi pilot?
16. Apakah dashboard layanan wajib pada MVP?
17. Apakah riwayat login wajib?
18. Apakah favorit/recent services diperlukan?
19. Apakah search layanan diperlukan pada MVP?

## Security

20. Apakah MFA wajib hanya admin atau juga user?
21. Session lifetime berapa?
22. Refresh token lifetime berapa?
23. Kebijakan account lockout?
24. Recovery menggunakan email, HP, atau keduanya?

## Infrastructure

25. Deployment di mana?
26. Apakah menggunakan VM, container, Kubernetes, atau lainnya?
27. Apakah reverse proxy/WAF sudah tersedia?
28. Domain staging apa?
29. Siapa yang memegang certificate dan DNS?
30. Berapa target user?
31. Berapa target concurrent login?

## Migration

32. Berapa lama old SSO dan new SSO berjalan paralel?
33. Apakah cutover dilakukan sekaligus atau bertahap?
34. Apa rollback trigger?
35. Siapa yang memberikan approval production?

---

# 48. Definition of Ready

Development core SSO dianggap siap dimulai ketika minimal sudah diketahui:

- target user;
- identity source;
- existing architecture;
- login identifier;
- pilot application;
- deployment environment;
- migration strategy;
- security baseline.

---

# 49. Definition of Done

Sistem siap production apabila:

## Product

- core user journey PASS;
- responsive UI PASS;
- UX review PASS;
- stakeholder approval diperoleh.

## Functional

- login PASS;
- logout PASS;
- recovery PASS;
- session PASS;
- token PASS;
- admin PASS;
- integration pilot PASS.

## Security

- auth review PASS;
- authorization review PASS;
- session review PASS;
- dependency review PASS;
- configuration review PASS;
- penetration test tidak memiliki blocker critical/high yang belum ditangani.

## Migration

- migration plan tervalidasi;
- rollback plan tervalidasi;
- pilot application PASS;
- user migration test PASS.

## Operations

- monitoring aktif;
- alerting aktif;
- backup tersedia;
- restore diuji;
- runbook tersedia.

## Documentation

Seluruh dokumentasi kritis tersedia dan dapat digunakan tim operasional.

---

# 50. Target Akhir Produk

```text
                   MASYARAKAT / PEGAWAI
                           │
                           ▼
                  ┌─────────────────┐
                  │   SSO BANDUNG   │
                  │                 │
                  │ Authentication  │
                  │ Identity        │
                  │ MFA             │
                  │ Session         │
                  │ Authorization   │
                  └────────┬────────┘
                           │
                    OIDC / SAML
                           │
          ┌────────────────┼─────────────────┐
          │                │                 │
          ▼                ▼                 ▼
      SIPETRUK         SIMPELMAN            SPMB
          │                │                 │
          ├──────────┬─────┴─────┬───────────┤
          ▼          ▼           ▼           ▼
     SIGAMPIL    DISDUKCAPIL    APP-N       APP-N
```

Prinsip utamanya:

> **Satu identitas, satu proses autentikasi, banyak layanan, dengan pengalaman pengguna yang konsisten dan kontrol keamanan terpusat.**

---

# 51. Status Dokumen

**PRD v0.2 — DRAFT / REQUIREMENT VALIDATION**

Dokumen belum berstatus approved.

Bagian yang masih perlu dipastikan:

1. pengguna SSO;
2. source of truth identity;
3. login identifier;
4. existing SSO architecture;
5. migration existing user;
6. pilot application;
7. application integration matrix;
8. deployment infrastructure;
9. session/MFA policy;
10. production cutover strategy.

Setelah requirement tersebut dikonfirmasi bersama Ketua Aplikasi/PIC, dokumen dapat dinaikkan menjadi:

**PRD v1.0 — APPROVED FOR DESIGN & DEVELOPMENT**
