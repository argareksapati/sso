export type ServiceEntry = {
  id: string;
  name: string;
  description: string;
  category: string;
  owner: string;
  logoPath?: string;
  integrationState: "DISCOVERY" | "EXTERNAL_REVIEW";
};

export type ExistingCatalogEntry = {
  id: string;
  name: string;
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
    description: "Layanan tata ruang Dinas Cipta Bintar yang saat ini memiliki proses masuk mandiri.",
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
    description: "Layanan penerimaan murid baru dengan kebutuhan akun warga dan operator yang bersifat musiman.",
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
  { id: "bandung-citizen-journalism", name: "Bandung Citizen Journalism", owner: "Pemilik client perlu diverifikasi" },
  {
    id: "dpmptsp-bandung",
    name: "DPMPTSP Bandung",
    owner: "DPMPTSP Kota Bandung",
    logoPath: "/services/dpmptsp.png",
    sourceUrl: "https://dpmptsp.bandung.go.id/",
  },
  {
    id: "salaman",
    name: "SALAMAN",
    owner: "Disdukcapil Kota Bandung",
    logoPath: "/services/salaman.jpg",
    sourceUrl: "https://www.bandung.go.id/",
  },
  { id: "new-bimma", name: "New Bimma", owner: "Pemilik client perlu diverifikasi" },
  { id: "bandung-smart-map-plus", name: "Bandung Smart Map Plus", owner: "Pemilik client perlu diverifikasi" },
  {
    id: "bandung-opendata",
    name: "Bandung Opendata",
    owner: "Pemerintah Kota Bandung",
    logoPath: "/services/bandung-opendata.png",
    sourceUrl: "https://opendata.bandung.go.id/",
  },
  {
    id: "arimbi-bandung",
    name: "Arimbi Bandung",
    owner: "Pemerintah Kota Bandung",
    logoPath: "/services/arimbi.jpg",
    sourceUrl: "https://diskominfo.bandung.go.id/",
  },
  { id: "bandung-kita", name: "Bandung Kita", owner: "Pemilik client perlu diverifikasi" },
  {
    id: "bandung-sadayana",
    name: "Bandung Sadayana",
    owner: "Pemerintah Kota Bandung",
    logoPath: "/services/sso-bandung.png",
  },
  {
    id: "ai-asisten-bandung",
    name: "AI Asisten Bandung",
    owner: "Pemerintah Kota Bandung",
    logoPath: "/services/teh-ai.png",
    sourceUrl: "https://sso.bandung.go.id/",
  },
  { id: "gercep-asik", name: "Gercep Asik", owner: "Pemilik client perlu diverifikasi" },
  {
    id: "bsm-pro",
    name: "BSM Pro",
    owner: "Pemerintah Kota Bandung",
    logoPath: "/services/bsm-pro.svg",
    sourceUrl: "https://bsm.bandung.go.id/",
  },
  { id: "perizinan-bandung", name: "Perizinan Bandung", owner: "Pemilik client perlu diverifikasi" },
  { id: "management-pemdi", name: "Management PEMDI", owner: "Pemilik client perlu diverifikasi" },
] as const satisfies readonly ExistingCatalogEntry[];

export async function listIntegrationCandidates(): Promise<ServiceEntry[]> {
  return integrationCandidates.map((service) => ({ ...service }));
}

export async function listExistingSsoCatalog(): Promise<ExistingCatalogEntry[]> {
  return existingSsoCatalog.map((service) => ({ ...service }));
}
