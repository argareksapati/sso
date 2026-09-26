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

## Login development mock

Mock hanya tersedia saat `AUTH_PROVIDER=mock` dan bukan production. Akun sintetis dikonfigurasi melalui environment test. Mock menghasilkan session development untuk menguji UI, route protection, logout, expiry, dan return URL.

## Recovery

UI selalu mengembalikan pesan generik. Adapter final menentukan channel, assurance, token lifetime, rate limit, dan proses reset. Implementasi awal tidak mengirim pesan nyata.

## Logout

Portal menghapus session aplikasi dan meminta provider mengakhiri session IdP bila single logout didukung. Semantik logout seluruh aplikasi masih TBD.

## Error

- Kredensial salah atau akun tidak tersedia menghasilkan pesan identik.
- Callback invalid diarahkan ke halaman gagal autentikasi tanpa token di URL/log.
- Session expired diarahkan ke halaman khusus dengan return path lokal yang tervalidasi.
- Role yang tidak memenuhi policy diarahkan ke forbidden dan dicatat sebagai authorization failure.
