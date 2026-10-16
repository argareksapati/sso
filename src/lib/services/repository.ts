export type ServiceEntry = {
  id: string;
  name: string;
  description: string;
  category: string;
  owner: string;
  logoPath?: string;
  integrationState: "DISCOVERY" | "EXTERNAL_REVIEW";
};

export type ServiceCategory = "PUBLIC" | "INTERNAL" | "INNOVATION";

export type ExistingCatalogEntry = {
  id: string;
  name: string;
  description: string;
  category: ServiceCategory;
  owner: string;
  logoPath?: string;
  sourceUrl?: string;
};

const integrationCandidates = [
  {
    id: "disdukcapil",
    name: "Layanan Disdukcapil Kota Bandung",
    description: "Layanan administrasi kependudukan; aplikasi dan endpoint final masih perlu dikonfirmasi.",
    category: "Administrasi kependudukan",
    owner: "Disdukcapil Kota Bandung",
    integrationState: "DISCOVERY",
  },
  {
    id: "sipetruk",
    name: "SIPETRUK",
    description: "Layanan tata ruang yang saat ini memiliki proses masuk mandiri.",
    category: "Tata ruang",
    owner: "Dinas Cipta Bintar",
    integrationState: "DISCOVERY",
  },
  {
    id: "simpelman",
    name: "SIMPELMAN",
    description: "Sistem informasi pelayanan pemakaman Kota Bandung.",
    category: "Pelayanan pemakaman",
    owner: "Dinas Cipta Bintar",
    integrationState: "DISCOVERY",
  },
  {
    id: "spmb",
    name: "SPMB Kota Bandung",
    description: "Layanan penerimaan murid baru bagi warga dan operator pendidikan.",
    category: "Pendidikan",
    owner: "Dinas Pendidikan Kota Bandung",
    integrationState: "DISCOVERY",
  },
  {
    id: "gampil",
    name: "GAMPIL",
    description: "Layanan perizinan dan antrean DPMPTSP; integrasi mobile membutuhkan app-link dan PKCE.",
    category: "Perizinan",
    owner: "DPMPTSP Kota Bandung",
    logoPath: "/services/dpmptsp.png",
    integrationState: "DISCOVERY",
  },
  {
    id: "mobile-jkn-puskesmas",
    name: "Mobile JKN / Layanan Puskesmas",
    description: "Target integrasi perlu dipastikan karena Mobile JKN berada pada ekosistem eksternal BPJS Kesehatan.",
    category: "Kesehatan",
    owner: "Boundary eksternal — perlu konfirmasi",
    integrationState: "EXTERNAL_REVIEW",
  },
] as const satisfies readonly ServiceEntry[];

const existingSsoCatalog = [
  {
    id: "bandung-citizen-journalism",
    name: "Bandung Citizen Journalism",
    description: "Wadah jurnalistik warga untuk berkontribusi dalam berita dan liputan seputar Kota Bandung.",
    category: "PUBLIC",
    owner: "Diskominfo Kota Bandung",
    logoPath: "/services/bcj.png",
  },
  {
    id: "dpmptsp-bandung",
    name: "DPMPTSP Bandung",
    description: "Dinas Penanaman Modal dan Pelayanan Terpadu Satu Pintu Kota Bandung.",
    category: "PUBLIC",
    owner: "DPMPTSP Kota Bandung",
    logoPath: "/services/dpmptsp-logo.png",
    sourceUrl: "https://dpmptsp.bandung.go.id/",
  },
  {
    id: "salaman",
    name: "SALAMAN",
    description: "Sistem Administrasi Kependudukan Disdukcapil Kota Bandung (KTP, KK, Akta).",
    category: "PUBLIC",
    owner: "Disdukcapil Kota Bandung",
    logoPath: "/services/salaman-logo.png",
    sourceUrl: "https://www.bandung.go.id/",
  },
  {
    id: "new-bimma",
    name: "New Bimma",
    description: "Aplikasi Bimbingan Manajemen & Tata Kelola Kinerja ASN Pemkot Bandung.",
    category: "INTERNAL",
    owner: "Pemerintah Kota Bandung",
    logoPath: "/services/new-bimma.png",
  },
  {
    id: "bandung-smart-map-plus",
    name: "Bandung Smart Map Plus",
    description: "Sistem Informasi Geografis (GIS) dan pemetaan interaktif wilayah Kota Bandung.",
    category: "INNOVATION",
    owner: "Pemerintah Kota Bandung",
  },
  {
    id: "bandung-opendata",
    name: "Bandung Opendata",
    description: "Portal Resmi Data Terbuka Publik Pemerintah Kota Bandung.",
    category: "INNOVATION",
    owner: "Diskominfo Kota Bandung",
    logoPath: "/services/bandung-opendata-logo.png",
    sourceUrl: "https://opendata.bandung.go.id/",
  },
  {
    id: "arimbi-bandung",
    name: "Arimbi Bandung",
    description: "Aplikasi informasi ketersediaan dan pemantauan harga pangan real-time.",
    category: "PUBLIC",
    owner: "Pemerintah Kota Bandung",
    logoPath: "/services/arimbi-logo.png",
    sourceUrl: "https://diskominfo.bandung.go.id/",
  },
  {
    id: "bandung-kita",
    name: "Bandung Kita",
    description: "Portal berita, informasi publik, dan agenda kegiatan resmi Kota Bandung.",
    category: "PUBLIC",
    owner: "Pemerintah Kota Bandung",
  },
  {
    id: "bandung-sadayana",
    name: "Bandung Sadayana",
    description: "Super app integrasi pelayanan publik dan aduan warga Kota Bandung.",
    category: "PUBLIC",
    owner: "Pemerintah Kota Bandung",
    logoPath: "/services/sadayana.png",
  },
  {
    id: "ai-asisten-bandung",
    name: "AI Asisten Bandung",
    description: "Layanan interaktif berbasis kecerdasan buatan untuk bantuan informasi warga.",
    category: "INNOVATION",
    owner: "Diskominfo Kota Bandung",
    logoPath: "/services/teh-ai-logo.png",
    sourceUrl: "https://sso.bandung.go.id/",
  },
  {
    id: "gercep-asik",
    name: "Gercep Asik",
    description: "Gerakan Cepat Aplikasi Sistem Informasi Penanganan Keluhan Warga Kota Bandung.",
    category: "PUBLIC",
    owner: "Pemerintah Kota Bandung",
    logoPath: "/services/gercep.png",
  },
  {
    id: "bsm-pro",
    name: "BSM Pro",
    description: "Versi pembaruan platform Bandung Smart Map Plus (GIS Pro) untuk pemetaan spasial terpadu.",
    category: "INNOVATION",
    owner: "Pemerintah Kota Bandung",
    logoPath: "/services/bsm-pro-logo.png",
    sourceUrl: "https://bsm.bandung.go.id/",
  },
  {
    id: "perizinan-bandung",
    name: "Perizinan Bandung",
    description: "Portal layanan pengajuan, pemrosesan, dan verifikasi perizinan usaha & non-usaha online.",
    category: "PUBLIC",
    owner: "DPMPTSP Kota Bandung",
    logoPath: "/services/dpmptsp-logo.png",
  },
  {
    id: "management-pemdi",
    name: "Management PEMDI",
    description: "Sistem perencanaan dan Manajemen Pembangunan Daerah Terpadu Pemkot Bandung.",
    category: "INTERNAL",
    owner: "Pemerintah Kota Bandung",
  },
] as const satisfies readonly ExistingCatalogEntry[];

export async function listIntegrationCandidates(): Promise<ServiceEntry[]> {
  return integrationCandidates.map((service) => ({ ...service }));
}

export async function listExistingSsoCatalog(): Promise<ExistingCatalogEntry[]> {
  return existingSsoCatalog.map((service) => ({ ...service }));
}
