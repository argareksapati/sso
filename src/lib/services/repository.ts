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
    description: "Wadah jurnalistik warga untuk berita dan liputan seputar Kota Bandung.",
    category: "PUBLIC",
    owner: "Diskominfo Kota Bandung",
    logoPath: "/services/bcj.png",
  },
  {
    id: "dpmptsp-bandung",
    name: "DPMPTSP Bandung",
    description: "Pelayanan penanaman modal dan perizinan terpadu satu pintu.",
    category: "PUBLIC",
    owner: "DPMPTSP Kota Bandung",
    logoPath: "/services/dpmptsp-logo.png",
    sourceUrl: "https://dpmptsp.bandung.go.id/",
  },
  {
    id: "salaman",
    name: "SALAMAN",
    description: "Sistem layanan administrasi kependudukan Kota Bandung.",
    category: "PUBLIC",
    owner: "Disdukcapil Kota Bandung",
    logoPath: "/services/salaman-logo.png",
    sourceUrl: "https://www.bandung.go.id/",
  },
  {
    id: "new-bimma",
    name: "New Bimma",
    description: "Aplikasi bimbingan manajemen dan tata kelola kinerja ASN.",
    category: "INTERNAL",
    owner: "Pemerintah Kota Bandung",
    logoPath: "/services/new-bimma.png",
  },
  {
    id: "bandung-smart-map-plus",
    name: "Bandung Smart Map Plus",
    description: "Sistem informasi geografis dan pemetaan interaktif Kota Bandung.",
    category: "INNOVATION",
    owner: "Pemerintah Kota Bandung",
  },
  {
    id: "bandung-opendata",
    name: "Bandung Opendata",
    description: "Portal resmi data terbuka Pemerintah Kota Bandung.",
    category: "INNOVATION",
    owner: "Diskominfo Kota Bandung",
    logoPath: "/services/bandung-opendata-logo.png",
    sourceUrl: "https://opendata.bandung.go.id/",
  },
  {
    id: "arimbi-bandung",
    name: "Arimbi Bandung",
    description: "Platform informasi dan operasional internal Pemerintah Kota Bandung.",
    category: "INTERNAL",
    owner: "Pemerintah Kota Bandung",
    logoPath: "/services/arimbi-logo.png",
    sourceUrl: "https://diskominfo.bandung.go.id/",
  },
  {
    id: "bandung-kita",
    name: "Bandung Kita",
    description: "Akses informasi publik dan partisipasi warga Kota Bandung.",
    category: "PUBLIC",
    owner: "Pemerintah Kota Bandung",
  },
  {
    id: "bandung-sadayana",
    name: "Bandung Sadayana",
    description: "Portal terpadu layanan publik warga Kota Bandung.",
    category: "PUBLIC",
    owner: "Pemerintah Kota Bandung",
    logoPath: "/services/sadayana.png",
  },
  {
    id: "ai-asisten-bandung",
    name: "AI Asisten Bandung",
    description: "Layanan kecerdasan buatan untuk membantu pencarian informasi kota.",
    category: "INNOVATION",
    owner: "Diskominfo Kota Bandung",
    logoPath: "/services/teh-ai-logo.png",
    sourceUrl: "https://sso.bandung.go.id/",
  },
  {
    id: "gercep-asik",
    name: "Gercep Asik",
    description: "Layanan respons cepat dan kolaborasi pelayanan warga.",
    category: "PUBLIC",
    owner: "Pemerintah Kota Bandung",
    logoPath: "/services/gercep.png",
  },
  {
    id: "bsm-pro",
    name: "BSM Pro",
    description: "Bandung Smart Maps Professional untuk kebutuhan operasional perangkat daerah.",
    category: "INTERNAL",
    owner: "Pemerintah Kota Bandung",
    logoPath: "/services/bsm-pro-logo.png",
    sourceUrl: "https://bsm.bandung.go.id/",
  },
  {
    id: "perizinan-bandung",
    name: "Perizinan Bandung",
    description: "Akses layanan dan pemantauan proses perizinan Kota Bandung.",
    category: "PUBLIC",
    owner: "DPMPTSP Kota Bandung",
  },
  {
    id: "management-pemdi",
    name: "Management PEMDI",
    description: "Aplikasi pengelolaan data dan layanan internal pemerintahan.",
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
