# Migration Plan Awal

## Prinsip

Produksi lama tetap aktif. Sistem baru dibangun pada local/staging dan mulai dari satu aplikasi pilot. Tidak ada perubahan DNS, credential produksi, database pengguna, atau client lama dalam fase awal.

## Tahap

1. Discovery: identity, user store, client, token, session, role, claim, recovery, MFA, audit, dan infrastruktur.
2. Compatibility mapping: setiap komponen diberi keputusan reuse, migrate, replace, atau retire.
3. Staging: IdP/client/data sintetis dan observability terpisah.
4. Pilot: satu aplikasi dengan redirect/logout URI eksplisit dan claim minimum.
5. User migration test: cohort non-production dan rollback yang terukur.
6. UAT/security: functional, accessibility, auth, authorization, session, dependency, configuration, dan penetration test.
7. Cutover bertahap: hanya setelah approval dan gate operasional lulus.
8. Rollback: DNS/client/config dapat dikembalikan tanpa kehilangan akun atau session lama sesuai runbook final.

## Trigger rollback yang perlu disepakati

- login success rate turun melewati threshold;
- callback/token error meningkat;
- aplikasi pilot gagal mengakses layanan kritis;
- temuan keamanan critical/high yang belum dimitigasi;
- audit/monitoring tidak tersedia;
- recovery atau logout gagal secara material.

Threshold, owner, approval, durasi parallel-run, dan RTO/RPO masih TBD.
