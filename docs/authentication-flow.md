# Authentication Flow

## Login produksi yang dituju

1. Aplikasi memvalidasi `returnTo` terhadap path lokal atau registry client.
2. Portal meminta adapter OIDC membuat authorization request dengan state, nonce, dan PKCE.
3. Browser diarahkan ke IdP staging/production.
4. IdP melakukan autentikasi, MFA, dan kebijakan akun.
5. Callback memverifikasi state, issuer, audience, signature, nonce, dan PKCE.
6. Portal membuat session aplikasi minimum dan menghapus material callback sekali pakai.
7. Audit mencatat hasil tanpa password atau token lengkap.
8. Pengguna kembali hanya ke tujuan yang telah diizinkan.

## Peluncuran aplikasi layanan

1. Portal membaca daftar client dan hak akses dari registry yang disetujui.
2. Pengguna memilih aplikasi yang tersedia untuk akunnya.
3. SSO membuat authorization response khusus client dengan scope dan audience minimum.
4. Aplikasi memvalidasi issuer, signature, audience, nonce, expiry, dan callback.
5. Aplikasi membuat session lokalnya sendiri dan mencatat login tanpa menyimpan token lengkap.

Daftar pada portal saat ini hanya berstatus kandidat discovery. Tidak ada tombol
peluncuran ke production sebelum client registration dan pengujian integrasi lulus.

## Login development mock

Mock hanya tersedia saat `AUTH_PROVIDER=mock` dan bukan production. Akun sintetis dikonfigurasi melalui environment test. Mock menghasilkan session development untuk menguji UI, route protection, logout, expiry, dan return URL.

## Login Supabase Auth

Saat `AUTH_PROVIDER=supabase`, endpoint login portal memanggil Supabase Auth
`signInWithPassword` dari server menggunakan project URL dan publishable/anon
key. Portal memetakan user ID, nama tampilan, dan role dari `app_metadata.roles`,
lalu menerbitkan session portal bertanda tangan. Role dari `user_metadata` tidak
dipercaya sebagai sumber otorisasi. Token Supabase tidak disimpan oleh portal.

## Recovery

UI selalu mengembalikan pesan generik. Adapter final menentukan channel, assurance, token lifetime, rate limit, dan proses reset. Implementasi awal tidak mengirim pesan nyata.

## Logout

Portal menghapus session aplikasi dan meminta provider mengakhiri session IdP bila single logout didukung. Semantik logout seluruh aplikasi masih TBD.

## Error

- Kredensial salah atau akun tidak tersedia menghasilkan pesan identik.
- Callback invalid diarahkan ke halaman gagal autentikasi tanpa token di URL/log.
- Session expired diarahkan ke halaman khusus dengan return path lokal yang tervalidasi.
- Role yang tidak memenuhi policy diarahkan ke forbidden dan dicatat sebagai authorization failure.
