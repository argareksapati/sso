"use client";

import Image from "next/image";
import { useMemo, useState, type ChangeEvent, type FormEvent } from "react";

import { MaterialIcon } from "@/components/ui/material-icon";
import type { ExistingCatalogEntry, ServiceCategory } from "@/lib/services/repository";
import styles from "@/app/portal/layanan/catalog.module.css";

type CategoryFilter = "ALL" | ServiceCategory;
type ManagedService = ExistingCatalogEntry & {
  integrationStatus?: "Terhubung SSO" | "Integrasi API" | "Maintenance";
  logoUrl?: string;
  logoFileName?: string;
  clientId?: string;
  redirectUrl?: string;
};

type ServiceDraft = {
  name: string;
  category: ServiceCategory;
  integrationStatus: NonNullable<ManagedService["integrationStatus"]>;
  description: string;
  logoUrl: string;
  logoFileName: string;
  clientId: string;
  redirectUrl: string;
};

const emptyDraft: ServiceDraft = {
  name: "",
  category: "PUBLIC",
  integrationStatus: "Terhubung SSO",
  description: "",
  logoUrl: "",
  logoFileName: "",
  clientId: "",
  redirectUrl: "",
};

const categories: { value: CategoryFilter; label: string }[] = [
  { value: "ALL", label: "Semua" },
  { value: "PUBLIC", label: "Pelayanan Publik" },
  { value: "INTERNAL", label: "Internal Pemkot" },
  { value: "INNOVATION", label: "Inovasi & Data" },
];

const categoryLabels: Record<ServiceCategory, string> = {
  PUBLIC: "Publik",
  INTERNAL: "Internal",
  INNOVATION: "Inovasi & Data",
};

function CatalogIcon({ id }: { id: string }) {
  if (id === "bandung-kita") return <MaterialIcon name="newspaper" size={24} />;
  return <MaterialIcon name="account_balance" size={24} />;
}

export function ServiceCatalog({ services, initialQuery = "", admin = false }: {
  services: ExistingCatalogEntry[];
  initialQuery?: string;
  admin?: boolean;
}) {
  const [entries, setEntries] = useState<ManagedService[]>(services);
  const [query, setQuery] = useState(initialQuery.slice(0, 120));
  const [category, setCategory] = useState<CategoryFilter>("ALL");
  const [editingId, setEditingId] = useState<string>();
  const [draft, setDraft] = useState<ServiceDraft>(emptyDraft);
  const [modalOpen, setModalOpen] = useState(false);
  const [logoError, setLogoError] = useState("");

  const visibleServices = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("id-ID");
    return entries.filter((service) => {
      const matchesCategory = category === "ALL" || service.category === category;
      const matchesQuery = !normalized || [service.name, service.description, service.owner]
        .some((value) => value.toLocaleLowerCase("id-ID").includes(normalized));
      return matchesCategory && matchesQuery;
    });
  }, [category, entries, query]);

  function openAdd() {
    setEditingId(undefined);
    setDraft(emptyDraft);
    setLogoError("");
    setModalOpen(true);
  }

  function openEdit(service: ManagedService) {
    setEditingId(service.id);
    setDraft({
      name: service.name,
      category: service.category,
      integrationStatus: service.integrationStatus ?? "Terhubung SSO",
      description: service.description,
      logoUrl: service.logoUrl ?? "",
      logoFileName: service.logoFileName ?? "",
      clientId: service.clientId ?? "",
      redirectUrl: service.redirectUrl ?? service.sourceUrl ?? "",
    });
    setModalOpen(true);
    setLogoError("");
  }

  function closeModal() {
    setModalOpen(false);
    setEditingId(undefined);
    setDraft(emptyDraft);
    setLogoError("");
  }

  function selectLogoFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    if (!file) return;

    const allowedTypes = new Set(["image/png", "image/jpeg", "image/webp"]);
    if (!allowedTypes.has(file.type)) {
      setLogoError("Gunakan gambar PNG, JPG, atau WEBP.");
      event.currentTarget.value = "";
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setLogoError("Ukuran logo maksimal 2 MB.");
      event.currentTarget.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") return;
      setDraft((current) => ({ ...current, logoUrl: reader.result as string, logoFileName: file.name }));
      setLogoError("");
    };
    reader.onerror = () => setLogoError("Logo tidak dapat dibaca. Silakan pilih file lain.");
    reader.readAsDataURL(file);
  }

  function saveService(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = draft.name.trim();
    const description = draft.description.trim();
    if (!name || !description) return;

    if (editingId) {
      setEntries((current) => current.map((service) => service.id === editingId ? {
        ...service,
        ...draft,
        name,
        description,
        sourceUrl: draft.redirectUrl.trim() || service.sourceUrl,
      } : service));
    } else {
      const baseId = name.toLocaleLowerCase("id-ID").normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "layanan";
      const id = `${baseId}-${Date.now().toString(36)}`;
      setEntries((current) => [...current, {
        id,
        name,
        description,
        category: draft.category,
        owner: "Pemerintah Kota Bandung",
        integrationStatus: draft.integrationStatus,
        logoUrl: draft.logoUrl.trim(),
        clientId: draft.clientId.trim(),
        redirectUrl: draft.redirectUrl.trim(),
        ...(draft.redirectUrl.trim() ? { sourceUrl: draft.redirectUrl.trim() } : {}),
      }]);
    }
    closeModal();
  }

  function removeService(service: ManagedService) {
    if (window.confirm(`Hapus ${service.name} dari portal SSO Kota Bandung?`)) {
      setEntries((current) => current.filter((item) => item.id !== service.id));
    }
  }

  return (
    <>
      <section className={styles.catalogHero} aria-labelledby="services-title">
        <div className={styles.colorRail} aria-hidden="true"><span /><span /><span /></div>
        <div className={styles.catalogHeading}>
          <div>
            <span className={styles.ecosystemBadge}><i /> Ekosistem Terintegrasi SSO Kota Bandung</span>
            <h1 id="services-title">Daftar Layanan Aplikasi SSO</h1>
            <p>Akses seluruh portal resmi pelayanan publik, informasi data terbuka, dan aplikasi operasional Pemerintah Kota Bandung menggunakan satu akun terverifikasi.</p>
          </div>
          <div className={styles.headingActions}>
            {admin && <button className={styles.addService} type="button" onClick={openAdd}><MaterialIcon name="add_circle" size={18} /> Tambah Layanan</button>}
            <div className={styles.totalServices}><small>Total Layanan</small><strong>{entries.length} Aplikasi</strong></div>
          </div>
        </div>

        <div className={styles.catalogTools}>
          <label className={styles.searchField}>
            <span className="sr-only">Cari layanan</span>
            <MaterialIcon name="search" size={20} />
            <input
              value={query}
              maxLength={120}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Cari nama aplikasi atau deskripsi layanan..."
              type="search"
            />
          </label>
          <div className={styles.filters} aria-label="Filter kategori layanan">
            {categories.map((item) => (
              <button
                type="button"
                key={item.value}
                aria-pressed={category === item.value}
                onClick={() => setCategory(item.value)}
              >
                {item.label}{item.value === "ALL" ? ` (${entries.length})` : ""}
              </button>
            ))}
          </div>
        </div>
      </section>

      <span className="sr-only" role="status" aria-live="polite">{visibleServices.length} layanan ditemukan</span>

      {visibleServices.length > 0 ? (
        <section className={styles.serviceGrid} aria-label="Daftar aplikasi SSO">
          {visibleServices.map((service) => (
            <article className={styles.serviceCard} key={service.id}>
              <div>
                <div className={styles.serviceTop}>
                  <span className={styles.serviceLogo} data-service-id={service.id} aria-hidden="true">
                    {service.logoUrl
                      ? <Image src={service.logoUrl} alt="" width={48} height={48} sizes="48px" unoptimized />
                      : service.logoPath
                      ? <Image src={service.logoPath} alt="" width={48} height={48} sizes="48px" />
                      : <CatalogIcon id={service.id} />}
                  </span>
                  <span className={styles.categoryBadge} data-category={service.category}>{categoryLabels[service.category]}</span>
                </div>
                <h2>{service.name}</h2>
                <p>{service.description}</p>
              </div>
              <footer className={styles.serviceFooter}>
                <span className={styles.connected}><i /> {service.integrationStatus ?? "Terhubung SSO"}</span>
                <div className={styles.cardActions}>
                  {admin && <>
                    <button type="button" onClick={() => openEdit(service)} aria-label={`Edit ${service.name}`} title="Edit Layanan"><MaterialIcon name="edit" size={16} /></button>
                    <button className={styles.deleteAction} type="button" onClick={() => removeService(service)} aria-label={`Hapus ${service.name}`} title="Hapus Layanan"><MaterialIcon name="delete" size={16} /></button>
                  </>}
                  <a
                    href={service.sourceUrl ?? "#"}
                    target={service.sourceUrl ? "_blank" : undefined}
                    rel={service.sourceUrl ? "noopener noreferrer" : undefined}
                    onClick={service.sourceUrl ? undefined : (event) => event.preventDefault()}
                  >
                    Buka <MaterialIcon name="arrow_forward" size={14} />
                  </a>
                </div>
              </footer>
            </article>
          ))}
        </section>
      ) : (
        <section className={styles.catalogEmpty}>
          <MaterialIcon name="search_off" size={34} />
          <h2>Layanan Tidak Ditemukan</h2>
          <p>Coba gunakan kata kunci pencarian lain atau ganti kategori filter.</p>
        </section>
      )}

      {admin && modalOpen && (
        <div className={styles.modalBackdrop} role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) closeModal(); }}>
          <section className={styles.modalCard} role="dialog" aria-modal="true" aria-labelledby="service-modal-title">
            <div className={styles.colorRail} aria-hidden="true"><span /><span /><span /></div>
            <header className={styles.modalHeader}>
              <span className={styles.modalIcon}><MaterialIcon name={editingId ? "edit_note" : "add_box"} size={22} /></span>
              <div><h2 id="service-modal-title">{editingId ? "Edit Layanan SSO" : "Tambah Layanan SSO Baru"}</h2><p>Kelola informasi portal aplikasi terintegrasi SSO Kota Bandung.</p></div>
              <button type="button" onClick={closeModal} aria-label="Tutup dialog"><MaterialIcon name="close" size={20} /></button>
            </header>
            <form className={styles.modalForm} onSubmit={saveService}>
              <label><span>Nama Aplikasi / Layanan <b>*</b></span><input required maxLength={120} value={draft.name} onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))} placeholder="Contoh: MBI Kota Bandung" /></label>
              <div className={styles.formColumns}>
                <label><span>Kategori Layanan <b>*</b></span><select value={draft.category} onChange={(event) => setDraft((current) => ({ ...current, category: event.target.value as ServiceCategory }))}><option value="PUBLIC">Pelayanan Publik</option><option value="INTERNAL">Internal Pemkot</option><option value="INNOVATION">Inovasi &amp; Data</option></select></label>
                <label><span>Status Integrasi <b>*</b></span><select value={draft.integrationStatus} onChange={(event) => setDraft((current) => ({ ...current, integrationStatus: event.target.value as ServiceDraft["integrationStatus"] }))}><option>Terhubung SSO</option><option>Integrasi API</option><option>Maintenance</option></select></label>
              </div>
              <label><span>Deskripsi Singkat Layanan <b>*</b></span><textarea required rows={2} maxLength={260} value={draft.description} onChange={(event) => setDraft((current) => ({ ...current, description: event.target.value }))} placeholder="Jelaskan fungsi utama aplikasi ini secara singkat..." /></label>
              <label className={styles.fileUpload}>
                <span>Unggah Logo / Icon dari Folder</span>
                <input type="file" accept="image/png,image/jpeg,image/webp" onChange={selectLogoFile} />
                <span className={styles.uploadControl}>
                  <MaterialIcon name="upload_file" size={22} />
                  <span><strong>{draft.logoFileName || "Pilih file gambar"}</strong><small>PNG, JPG, atau WEBP maksimal 2 MB</small></span>
                </span>
              </label>
              {logoError && <p className={styles.logoError} role="alert">{logoError}</p>}
              {draft.logoUrl && <div className={styles.logoPreview}><Image src={draft.logoUrl} alt="Pratinjau logo layanan" width={52} height={52} unoptimized /><span>{draft.logoFileName || "Logo dari URL"}</span><button type="button" onClick={() => setDraft((current) => ({ ...current, logoUrl: "", logoFileName: "" }))}>Hapus</button></div>}
              <label>URL Logo / Icon Aplikasi <small>(opsional)</small><input type="url" value={draft.logoFileName ? "" : draft.logoUrl} onChange={(event) => setDraft((current) => ({ ...current, logoUrl: event.target.value, logoFileName: "" }))} placeholder="https://sso.bandung.go.id/logo.png" disabled={Boolean(draft.logoFileName)} /></label>
              <div className={styles.formColumns}>
                <label>SSO Client ID / API Key<input value={draft.clientId} onChange={(event) => setDraft((current) => ({ ...current, clientId: event.target.value }))} placeholder="sso_client_bdg_x89" /></label>
                <label>Redirect Callback URL<input type="url" value={draft.redirectUrl} onChange={(event) => setDraft((current) => ({ ...current, redirectUrl: event.target.value }))} placeholder="https://aplikasi.bandung.go.id/callback" /></label>
              </div>
              <footer className={styles.modalFooter}><span><i /> Siap Disimpan</span><div><button type="button" onClick={closeModal}>Batal</button><button type="submit">Simpan Layanan <MaterialIcon name="arrow_forward" size={14} /></button></div></footer>
            </form>
          </section>
        </div>
      )}
    </>
  );
}
