# Design System Awal

Semua token awal bersifat sementara sampai brand guide Pemerintah Kota Bandung disetujui. Tidak ada warna, logo, font, atau simbol di bawah yang diklaim sebagai identitas resmi.

## Arah

- Karakter: tenang, resmi, mudah dibaca, dan berorientasi tugas.
- Hierarki dibentuk oleh tipografi, ruang, garis, dan kontras permukaan.
- Login memakai dua area pada desktop: konteks singkat dan form. Pada mobile, form tampil lebih dahulu setelah identitas layanan.
- Signature element adalah urutan akses tiga langkah yang nyata: masuk, pilih layanan, lanjutkan. Ia berfungsi sebagai orientasi, bukan dekorasi.

## Token sementara

| Token | Nilai awal | Fungsi |
|---|---|---|
| `--ink-strong` | `#17212b` | heading dan body utama |
| `--ink-muted` | `#52606d` | helper dan metadata |
| `--surface-page` | `#f4f6f8` | latar halaman |
| `--surface-raised` | `#ffffff` | form dan header |
| `--border` | `#cfd7df` | pemisah dan input |
| `--action` | `#175a8a` | aksi utama sementara |
| `--action-strong` | `#104567` | hover/active |
| `--danger` | `#a62a2a` | error |
| `--success` | `#176b4d` | keberhasilan |

`TODO: replace with approved Bandung brand tokens.`

## Tipografi

- Display dan body: `Segoe UI Variable`, `Segoe UI`, Arial, sans-serif sampai font resmi tersedia.
- Skala: 14, 16, 18, 24, 32, 42 px dengan line-height minimum 1.35.
- Label tidak menggunakan uppercase panjang; kapital hanya untuk singkatan yang memang dikenali.

## Bentuk dan elevasi

- Radius: 4 px untuk input/control, 8 px untuk grouping semantik.
- Shadow hanya untuk dialog atau elemen yang benar-benar mengambang.
- Border 1 px menjadi pemisah utama.
- Focus ring 3 px dengan offset 2 px.
- Target sentuh minimum 44 × 44 px.

## Primitive awal

Button, TextField, PasswordField, Checkbox, Alert, InlineError, FormField, LoadingIndicator, Header, EmptyState, dan StatusPage.

## Review checklist

- Tindakan utama terlihat dalam tiga detik.
- Tidak ada informasi atau layanan palsu.
- Label/error terasosiasi dengan input.
- Keyboard flow dan focus terlihat.
- Tidak ada horizontal overflow pada 360, 390, 768, 1024, 1280, dan 1440 px.
- Reduced motion dihormati.
