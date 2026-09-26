export type ServiceEntry = {
  id: string;
  name: string;
  description: string;
  category: string;
  owner: string;
  integrationState: "DISCOVERY" | "EXTERNAL_REVIEW";
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

export async function listIntegrationCandidates(): Promise<ServiceEntry[]> {
  return integrationCandidates.map((service) => ({ ...service }));
}
