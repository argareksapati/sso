# CODEX MASTER PROMPT — Rebuild SSO Layanan Kota Bandung

Kamu bertindak sebagai **Senior Product Engineer + Senior Product Designer + Application Security Engineer** untuk membangun ulang **SSO Layanan Kota Bandung**.

## 0. Sumber Kebenaran

Baca dokumen berikut terlebih dahulu dan jadikan sebagai source of truth:

- `PRD_SSO_Bandung_Rebuild_v0.2.md`

Jika file berada di lokasi lain, cari file tersebut di workspace sebelum mulai.

Existing production:
- `https://sso.bandung.go.id/login`

Existing SSO hanya boleh dipakai untuk memahami **alur/fungsi yang sudah ada dan kebutuhan compatibility**.  
**Jangan meniru desain visual existing SSO**, karena salah satu alasan rebuild adalah memperbaiki kualitas UX/UI dan menghilangkan tampilan generik / "AI slop".

Jika ada requirement di PRD yang masih `TBD`, jangan mengarang. Tandai sebagai `TBD`, buat adapter/interface atau mock yang aman untuk development, dan tuliskan keputusan yang masih dibutuhkan.

---

# 1. Tujuan

Bangun **SSO Bandung versi baru** sebagai produk pemerintah yang:

- sederhana;
- profesional;
- mudah dipahami masyarakat;
- mobile-first;
- accessible;
- konsisten;
- aman;
- dapat berkembang;
- tidak terlihat seperti template AI/startup;
- tidak mengorbankan usability demi dekorasi.

Tujuan UX utama:

> Pengguna memahami dalam beberapa detik bahwa mereka dapat masuk dengan satu akun dan mengakses layanan Kota Bandung yang sudah terintegrasi.

---

# 2. Aturan Keras — Anti AI Slop

DESAIN HARUS MENGHINDARI pola berikut kecuali ada alasan produk yang sangat kuat:

- hero section marketing besar di halaman login;
- gradient mencolok atau mesh gradient generik;
- glassmorphism;
- glowing cards;
- 3D blobs;
- abstract AI illustrations;
- decorative floating shapes;
- bento grid hanya karena terlihat modern;
- setiap informasi dibungkus card;
- nested cards;
- card dengan radius sangat besar;
- pill/badge di mana-mana;
- shadow berlebihan;
- warna icon berbeda-beda tanpa sistem;
- emoji sebagai icon produk;
- icon yang tidak konsisten;
- terlalu banyak CTA;
- copy marketing seperti "revolutionize", "seamless experience", dsb.;
- fake statistics;
- fake testimonials;
- fake partner logos;
- fake service status;
- placeholder data yang terlihat seperti data pemerintah sungguhan;
- dashboard yang hanya berupa kumpulan kotak 2xN tanpa hierarchy;
- layout yang terlalu banyak whitespace tetapi sedikit informasi;
- animasi sekadar dekorasi;
- halaman login yang terlihat seperti landing page SaaS;
- stock photo warga hanya sebagai dekorasi;
- desain yang menyalin Dribbble tanpa mempertimbangkan kebutuhan layanan publik.

Jika sebuah elemen tidak membantu:
1. orientasi,
2. pemahaman,
3. tindakan,
4. feedback,
5. accessibility,

maka elemen tersebut kemungkinan tidak diperlukan.

---

# 3. Karakter Visual yang Diinginkan

Arah visual:

- official;
- calm;
- trustworthy;
- functional;
- modern tetapi tidak trend-chasing;
- clear information hierarchy;
- high readability;
- restrained use of color;
- generous tetapi tidak berlebihan dalam spacing;
- visual identity konsisten.

Gunakan identitas resmi Pemerintah Kota Bandung jika asset/brand guide tersedia di workspace atau sumber resmi.

JANGAN mengarang:
- logo;
- lambang;
- warna brand resmi;
- font resmi;
- slogan resmi.

Jika brand guide tidak tersedia:
- gunakan temporary neutral design tokens;
- pisahkan semua brand values ke design tokens;
- beri komentar `TODO: replace with approved Bandung brand token`;
- jangan mengklaim token tersebut sebagai warna resmi Kota Bandung.

---

# 4. Design References

Prioritas referensi:

1. official Bandung/Pemerintah Kota Bandung brand assets;
2. pola UI layanan pemerintah yang matang;
3. established identity-management UX patterns;
4. accessibility best practices.

Jangan menjadikan dashboard startup AI sebagai referensi utama.

Existing `sso.bandung.go.id` hanya digunakan untuk:
- memahami current flow;
- field yang dipakai;
- pesan/error penting;
- link/recovery flow;
- compatibility requirement.

Bukan untuk ditiru secara visual.

---

# 5. Plugin / Tool Design

Jika tersedia di environment, gunakan **Figma plugin/connector** untuk design handoff.

Workflow yang diinginkan:

1. buat information architecture;
2. buat low-fidelity wireframe;
3. buat design tokens;
4. buat component inventory;
5. buat high-fidelity screen;
6. review hierarchy, accessibility, consistency;
7. baru implementasikan di codebase;
8. bandingkan implementasi dengan desain.

Jangan generate decorative image/video untuk halaman SSO.

**Tidak perlu menggunakan Seedance/Higgsfield untuk UI utama SSO.**
SSO ini adalah aplikasi transaksi/identitas, bukan campaign landing page.

---

# 6. Teknologi UI

Gunakan stack repository yang sudah ada jika ada.

Jika membuat proyek baru:
- Next.js App Router;
- TypeScript strict mode;
- CSS/Tailwind sesuai keputusan repo;
- semantic HTML.

Untuk primitive accessible, prioritaskan:
- Radix UI primitives, atau
- shadcn/ui hanya sebagai primitive/source code awal.

Jika menggunakan shadcn:
- JANGAN pakai stock theme apa adanya;
- JANGAN copy blok dashboard/template;
- ubah token dan composition sesuai design system proyek;
- hindari tampilan khas "default shadcn AI app".

Icon:
- gunakan satu icon family konsisten, misalnya Lucide;
- jangan campur icon family;
- jangan gunakan icon jika label teks sudah cukup.

---

# 7. Design System

Sebelum membuat banyak halaman, definisikan token berikut:

```text
color
typography
spacing
radius
border
shadow
container
breakpoints
focus ring
motion
```

Buat komponen reusable minimal:

```text
Button
TextField
PasswordField
Checkbox
Select
Alert
InlineError
FormField
Card (hanya ketika semantically dibutuhkan)
Dialog
Drawer
Toast
Tabs
Badge (secukupnya)
Table
Pagination
Breadcrumb
Header
Sidebar / navigation
ServiceItem
EmptyState
ErrorState
Skeleton
LoadingIndicator
```

Semua komponen interaktif wajib memiliki state:

```text
default
hover
focus-visible
active
disabled
loading
error
success (jika relevan)
```

---

# 8. Radius, Shadow, dan Cards

Jangan membuat desain terlalu "bubble".

Default:
- gunakan border radius moderat;
- gunakan shadow seminimal mungkin;
- prioritaskan border, spacing, typography, dan background surface untuk hierarchy.

Card hanya digunakan jika ada grouping semantik.

Contoh buruk:

```text
Page
 └─ Card
     └─ Card
         └─ Card
```

Contoh lebih baik:

```text
Page
 ├─ Header
 ├─ Section
 │   ├─ Heading
 │   └─ content
 └─ Section
```

---

# 9. Typography

Typography harus menjadi alat hierarchy utama.

Minimal hierarchy:

```text
Page title
Section title
Body
Label
Helper text
Caption
Error
```

Jangan membuat seluruh page bergantung pada ukuran card.

Gunakan font yang approved jika tersedia.

Jika belum tersedia, gunakan fallback sans-serif yang aman dan mudah diganti via token.

---

# 10. UX Copy

Gunakan Bahasa Indonesia yang:
- formal tetapi tidak kaku;
- ringkas;
- manusiawi;
- mudah dipahami masyarakat.

Hindari copy generik AI.

Contoh:

Buruk:
> Nikmati pengalaman digital seamless untuk membuka dunia layanan Bandung.

Lebih baik:
> Masuk untuk mengakses layanan Kota Bandung yang terhubung dengan akun Anda.

Error harus actionable.

Buruk:
> Authentication failed.

Lebih baik:
> Email, nomor HP, atau kata sandi tidak sesuai. Periksa kembali dan coba lagi.

Jangan mengungkap detail sensitif seperti apakah sebuah identifier tertentu terdaftar jika hal tersebut menimbulkan account enumeration.

---

# 11. Screen yang Harus Dibuat

Prioritas implementasi:

## P0 — Authentication

1. Login
2. Lupa kata sandi
3. Verifikasi recovery
4. Reset kata sandi
5. Session expired
6. Unauthorized / forbidden
7. Maintenance / service unavailable

## P0 — Portal

8. Dashboard / home
9. Semua layanan
10. Search/filter layanan
11. Profil akun
12. Keamanan akun
13. Session/perangkat aktif

## P0 — System

14. Loading
15. Empty states
16. Error states
17. 404
18. 429
19. 500

## P1 — Admin

20. Admin login/security
21. User management
22. Client/application management
23. Role management
24. Session management
25. Audit log

---

# 12. Login Page Direction

Halaman login harus terasa seperti layanan pemerintah, bukan campaign page.

Desktop direction:

```text
┌───────────────────────────────────────────────────────────────┐
│ Brand / Pemkot Bandung                              Bantuan   │
├───────────────────────────────────────────────────────────────┤
│                                                               │
│  Informasi singkat layanan        Masuk                       │
│  dan konteks SSO                  -------------------------   │
│                                   Email / HP / identifier     │
│  Ringkas, maksimal beberapa       [_______________________]   │
│  baris.                            Kata sandi                  │
│                                   [_______________________]   │
│                                   □ Ingat perangkat*          │
│                                   [ Masuk ]                   │
│                                   Lupa kata sandi?            │
│                                                               │
├───────────────────────────────────────────────────────────────┤
│ Privasi · Bantuan · Informasi layanan                         │
└───────────────────────────────────────────────────────────────┘
```

`Ingat perangkat` hanya ditampilkan jika security policy mengizinkan.

Pada mobile:
- fokus langsung ke task login;
- brand tetap jelas;
- tidak ada hero dekoratif;
- tidak ada dua kolom yang dipaksakan;
- CTA mudah dijangkau;
- target sentuh memadai.

---

# 13. Dashboard Direction

Jangan otomatis memakai grid card besar.

Hierarchy yang diinginkan:

```text
Header
├─ Branding
├─ Search
└─ User menu

Navigation

Main
├─ Greeting sederhana
├─ Recently used / layanan utama (jika datanya nyata)
├─ Semua layanan
│   ├─ category/filter
│   └─ list/grid yang efisien
└─ Help
```

Untuk daftar layanan, prioritaskan:
- nama;
- kategori;
- deskripsi pendek;
- status integrasi bila memang diketahui;
- CTA jelas.

Jangan tampilkan fake recent services apabila backend belum memiliki data.

---

# 14. Responsive Requirements

Wajib diuji setidaknya pada lebar:

```text
360
390
768
1024
1280
1440
```

Tidak boleh ada:
- horizontal overflow;
- button terpotong;
- label hilang;
- modal lebih besar dari viewport;
- text terlalu kecil;
- sidebar unusable di mobile.

---

# 15. Accessibility

Targetkan WCAG 2.2 AA sejauh memungkinkan.

Wajib:
- semantic HTML;
- `<label>` benar untuk input;
- keyboard navigation;
- visible `:focus-visible`;
- focus order logis;
- accessible error association;
- proper heading hierarchy;
- contrast memadai;
- tidak mengandalkan warna saja;
- reduced-motion consideration;
- minimum touch target;
- aria hanya jika HTML semantik tidak cukup.

Tambahkan automated accessibility test.

---

# 16. Authentication Architecture Guardrail

PENTING:

Jangan membuat OAuth/OIDC Authorization Server custom di Next.js hanya karena bisa.

Pisahkan:

```text
UI / Portal
    │
    ▼
Auth integration adapter
    │
    ▼
Identity Provider
```

Identity Provider final masih mengikuti discovery PRD.

Jika IdP belum diputuskan:
- buat `AuthProvider` interface;
- gunakan mock/local development provider;
- jangan hard-code production credentials;
- jangan membuat fake cryptographic protocol;
- tuliskan apa yang perlu dihubungkan ketika IdP final tersedia.

Jika kemudian dipilih IdP seperti Keycloak:
- integrasikan melalui OIDC standard;
- jangan memasukkan password user ke aplikasi portal;
- portal harus menjadi relying party/client, bukan penyimpan password tambahan.

---

# 17. Security Guardrails

Jangan pernah:
- hard-code secret;
- commit `.env`;
- log password;
- log token lengkap;
- simpan access token di localStorage tanpa threat analysis;
- masukkan NIK/PII ke token tanpa kebutuhan;
- membuat wildcard redirect URI production;
- men-disable CSRF/CORS protection agar development "jalan";
- menerima arbitrary return URL;
- menggunakan insecure random untuk token;
- membuat auth bypass untuk demo production.

Implementasikan atau siapkan:
- strict redirect URI;
- secure cookie;
- HttpOnly;
- SameSite;
- CSRF protection sesuai architecture;
- CSP;
- HSTS di production;
- rate limiting hook;
- audit event abstraction;
- session revocation;
- token expiration handling;
- generic auth error;
- safe return URL validation.

---

# 18. Privacy

Gunakan internal UUID/subject untuk user.

Jangan jadikan NIK sebagai identifier yang tersebar ke seluruh frontend/client kecuali benar-benar diperlukan.

Data sharing antar aplikasi harus minimal.

Jika kebutuhan claim belum diketahui, buat schema/allowlist yang explicit.

---

# 19. Existing SSO Compatibility

Sebelum mengubah backend production, lakukan inventory:

```text
current identity provider
user store
password format
clients
redirect URIs
protocol
token format
session model
logout flow
recovery flow
MFA
roles
claims
audit
deployment
```

Outputkan dokumen:

`docs/existing-sso-discovery.md`

Jika data belum dapat diperoleh, jangan membuat asumsi seolah sudah diketahui.

---

# 20. Development Strategy

Jangan langsung membangun 30 halaman.

Kerjakan secara vertikal:

## Milestone 1 — Foundation

- project setup;
- lint/typecheck;
- design tokens;
- base layout;
- accessibility baseline;
- component primitives.

## Milestone 2 — Authentication UX

- login;
- form validation;
- error/loading state;
- forgot password;
- reset password;
- responsive;
- accessibility test.

## Milestone 3 — Portal

- header/navigation;
- service directory;
- search/filter;
- account/profile;
- security/session screens.

## Milestone 4 — Auth Adapter

- provider interface;
- development mock;
- OIDC integration placeholder/real integration jika detail sudah tersedia.

## Milestone 5 — Admin

- client;
- users;
- roles;
- sessions;
- audit UI.

## Milestone 6 — Integration & Hardening

- pilot application;
- E2E;
- accessibility;
- security;
- visual review.

---

# 21. Testing

Minimal siapkan:

## Unit / Component
- validation;
- UI states;
- utility functions.

## E2E
Gunakan Playwright untuk:
- successful login mock;
- invalid login;
- password recovery;
- session expiration;
- logout;
- keyboard navigation;
- responsive smoke test.

## Accessibility
Gunakan:
- `@axe-core/playwright` atau equivalent.

## Visual Regression
Ambil screenshot test pada viewport utama.

Tujuan visual regression:
- mencegah layout berubah tanpa sengaja;
- mendeteksi overflow;
- mendeteksi spacing/hierarchy regressions.

---

# 22. Package / Dependency Guidance

Pilih dependency secara minimal.

Rekomendasi frontend bila sesuai stack:

```text
lucide-react
zod
react-hook-form
@hookform/resolvers
@radix-ui/* sesuai kebutuhan
```

Testing:

```text
playwright
@axe-core/playwright
```

Optional:

```text
storybook
```

untuk dokumentasi component library apabila kompleksitas proyek membutuhkannya.

Jangan menambahkan dependency hanya karena populer.

Jangan memasukkan image/video generation library untuk UI SSO.

---

# 23. Quality Gate Anti-Slop

Sebelum menyatakan screen selesai, lakukan review manual dengan checklist:

### Hierarchy
- Apakah primary action jelas dalam 3 detik?
- Apakah ada terlalu banyak elemen yang berebut perhatian?
- Apakah page title jelas?

### Density
- Apakah terlalu banyak card?
- Apakah whitespace masuk akal?
- Apakah informasi penting terlalu tersebar?

### Consistency
- Apakah radius konsisten?
- Apakah icon satu family?
- Apakah spacing menggunakan token?
- Apakah typography mengikuti scale?

### Government Context
- Apakah terasa seperti layanan publik resmi?
- Apakah copy jelas dan tidak marketing-heavy?
- Apakah tidak ada fake data?

### Accessibility
- Keyboard usable?
- Focus terlihat?
- Contrast cukup?
- Error mudah dipahami?

### Mobile
- Apakah task utama tetap cepat?
- Apakah navigation masuk akal?
- Apakah target sentuh cukup?

Jika gagal checklist, revisi sebelum lanjut.

---

# 24. Jangan Langsung Coding

Pada run pertama:

1. baca seluruh PRD;
2. inspect repository;
3. inspect existing app jika ada;
4. buat daftar requirement yang confirmed vs TBD;
5. buat proposed information architecture;
6. buat proposed design system;
7. buat implementation plan;
8. sebutkan file yang akan dibuat/diubah;
9. baru mulai coding setelah plan konsisten dengan PRD.

Jangan bertanya untuk hal yang dapat ditemukan sendiri dari repo/PRD.

Jika ada keputusan yang benar-benar blocking dan tidak ada di repo/PRD, tuliskan sebagai blocker dengan opsi yang jelas.

---

# 25. Output yang Saya Mau

Buat project yang production-oriented dengan struktur yang rapi.

Minimal output dokumentasi:

```text
docs/
  existing-sso-discovery.md
  architecture.md
  design-system.md
  authentication-flow.md
  migration-plan.md
  security-notes.md
```

Dan README harus menjelaskan:

```text
setup
run
test
environment variables
architecture overview
auth provider status
known TBDs
```

---

# 26. Definition of Done untuk Implementasi Awal

Implementasi awal dianggap bagus hanya jika:

- design tidak terasa seperti AI template;
- login page usable dan polished;
- mobile layout polished;
- design system konsisten;
- accessibility baseline lulus;
- no fake government data;
- no invented auth architecture;
- no custom insecure OAuth server;
- no secrets committed;
- tests utama berjalan;
- lint/typecheck berjalan;
- existing production tidak disentuh;
- semua TBD didokumentasikan.

---

# 27. Instruksi Eksekusi

Sekarang:

1. baca `PRD_SSO_Bandung_Rebuild_v0.2.md`;
2. audit workspace;
3. jika tersedia, gunakan Figma untuk design planning/review;
4. buat rencana implementasi;
5. buat design foundation terlebih dahulu;
6. implementasikan **login experience + auth states** sebagai vertical slice pertama;
7. lakukan responsive + accessibility + visual review;
8. baru lanjut ke dashboard/portal;
9. jangan deploy atau mengubah `sso.bandung.go.id` production;
10. laporkan setiap asumsi dan TBD secara eksplisit.

Prioritaskan **quality, clarity, accessibility, security, dan maintainability** di atas jumlah fitur.
