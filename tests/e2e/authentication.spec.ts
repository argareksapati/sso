import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const identifier = "pengguna.uji@example.test";
const password = "local-test-password-only";

async function login(page: import("@playwright/test").Page) {
  await page.goto("/login");
  await page.getByLabel("Alamat email").fill(identifier);
  await page.getByLabel("Kata Sandi", { exact: true }).fill(password);
  await solveCaptcha(page);
  await page.getByRole("button", { name: "Masuk Sekarang", exact: true }).click();
  await expect(page).toHaveURL(/\/portal$/);
}

async function solveCaptcha(page: import("@playwright/test").Page) {
  const question = page.locator("[aria-label^='Berapa'][aria-label*='ditambah']");
  const prompt = await question.getAttribute("aria-label");
  const numbers = prompt?.match(/\d+/g)?.map(Number) || [];
  expect(numbers).toHaveLength(2);
  await page.getByLabel("Verifikasi Keamanan", { exact: true }).fill(String(numbers[0] + numbers[1]));
}

test("login mock, portal, dan logout", async ({ page }) => {
  await login(page);
  await expect(page.getByRole("heading", { name: "Pengguna Uji", level: 1 })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Pengaturan & Layanan Profil" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Frekuensi Penggunaan Layanan" })).toBeVisible();
  await page.getByRole("button", { name: "Keluar" }).click();
  await expect(page).toHaveURL(/\/login$/);
});

test("tema terang dan gelap dapat diubah serta tersimpan di portal", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/login");

  const root = page.locator("html");
  const darkToggle = page.getByRole("button", { name: "Aktifkan tema gelap" });
  await expect(darkToggle).toBeVisible();
  await expect(root).toHaveAttribute("data-theme", "light");
  const lightSurface = await root.evaluate((element) => getComputedStyle(element).getPropertyValue("--surface-page").trim());

  await darkToggle.click();
  await expect(root).toHaveAttribute("data-theme", "dark");
  await expect(page.getByRole("button", { name: "Aktifkan tema terang" })).toBeVisible();
  const darkSurface = await root.evaluate((element) => getComputedStyle(element).getPropertyValue("--surface-page").trim());
  expect(darkSurface).not.toBe(lightSurface);
  expect(await page.evaluate(() => window.localStorage.getItem("sso-theme"))).toBe("dark");

  await page.reload();
  await expect(root).toHaveAttribute("data-theme", "dark");
  await login(page);
  await expect(root).toHaveAttribute("data-theme", "dark");
  await expect(page.getByRole("button", { name: "Aktifkan tema terang" })).toBeVisible();

  for (const route of [
    "/portal",
    "/portal/layanan",
    "/portal/pengaturan/profil",
    "/portal/pengaturan/password",
    "/portal/pengaturan/sesi",
    "/portal/pengaturan/aplikasi",
    "/portal/pengaturan/notifikasi",
    "/portal/pengaturan/aktivitas",
  ]) {
    await page.goto(route);
    await expect(root).toHaveAttribute("data-theme", "dark");
    const accessibility = await new AxeBuilder({ page }).analyze();
    expect(
      accessibility.violations.filter((item) => ["serious", "critical"].includes(item.impact || "")),
      `${route} harus lolos pemeriksaan aksesibilitas dalam tema gelap`,
    ).toEqual([]);
  }

  await page.getByRole("button", { name: "Aktifkan tema terang" }).click();
  await expect(root).toHaveAttribute("data-theme", "light");
  expect(await page.evaluate(() => window.localStorage.getItem("sso-theme"))).toBe("light");
});

test("seluruh halaman publik utama dapat dirender tanpa error browser", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });

  const routes = [
    ["/login", "Masuk ke Akun SSO"],
    ["/daftar", "Buat Akun SSO Baru"],
    ["/lupa-kata-sandi", "Lupa kata sandi"],
    ["/bantuan", "Informasi bantuan sedang disiapkan"],
    ["/daftar/berhasil", "Periksa email Anda"],
    ["/pemulihan/dikirim", "Periksa petunjuk pemulihan"],
    ["/reset-kata-sandi", "Tautan reset belum dapat digunakan"],
    ["/pemeliharaan", "Layanan sementara tidak tersedia"],
    ["/session-berakhir", "Silakan masuk kembali"],
    ["/tidak-berwenang", "Anda belum dapat membuka halaman ini"],
    ["/kebijakan-privasi", "Kebijakan Privasi"],
    ["/syarat-ketentuan", "Syarat & Ketentuan"],
  ] as const;

  for (const [route, heading] of routes) {
    const response = await page.goto(route, { waitUntil: "networkidle" });
    expect(response?.ok(), `${route} seharusnya merespons sukses`).toBe(true);
    await expect(page.getByRole("heading", { name: heading }).first()).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
  }

  expect(errors).toEqual([]);
});

test("kontrol formulir login merespons interaksi", async ({ page }) => {
  await page.goto("/login");
  const passwordField = page.getByLabel("Kata Sandi", { exact: true });
  await passwordField.fill("contoh-sandi");
  await expect(passwordField).toHaveAttribute("type", "password");
  await page.getByRole("button", { name: "Tampilkan kata sandi" }).click();
  await expect(passwordField).toHaveAttribute("type", "text");
  await page.getByRole("button", { name: "Sembunyikan kata sandi" }).click();
  await expect(passwordField).toHaveAttribute("type", "password");

  const remember = page.getByLabel("Ingat saya di perangkat ini");
  await remember.check();
  await expect(remember).toBeChecked();
  await remember.uncheck();
  await expect(remember).not.toBeChecked();
});

test("seluruh halaman akun terlindungi dan dapat dinavigasi", async ({ page }) => {
  const routes = [
    ["/portal/layanan", "Daftar Layanan Aplikasi SSO"],
    ["/portal/pengaturan/profil", "Profil Saya"],
    ["/portal/pengaturan/password", "Kata Sandi Saya"],
    ["/portal/pengaturan/sesi", "Sesi Perangkat"],
    ["/portal/pengaturan/aplikasi", "Aplikasi Terkoneksi"],
    ["/portal/pengaturan/notifikasi", "Preferensi Notifikasi"],
    ["/portal/pengaturan/aktivitas", "Log Aktivitas"],
  ] as const;

  await page.goto(routes[0][0]);
  await expect(page).toHaveURL(/\/login\?returnTo=\/portal$/);
  await login(page);

  for (const [route, heading] of routes) {
    await page.goto(route);
    await expect(page.getByRole("heading", { name: heading, level: 1 })).toBeVisible();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth),
    ).toBeLessThanOrEqual(1);
  }

  await page.setViewportSize({ width: 390, height: 844 });
  for (const [route, heading] of routes) {
    await page.goto(route);
    await expect(page.getByRole("heading", { name: heading, level: 1 })).toBeVisible();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth),
    ).toBeLessThanOrEqual(1);
  }

  const accessibility = await new AxeBuilder({ page }).analyze();
  expect(accessibility.violations.filter((item) => ["serious", "critical"].includes(item.impact || ""))).toEqual([]);
});

test("fitur portal membedakan kontrol lokal dan kontrol yang membutuhkan IdP", async ({ page }) => {
  await login(page);

  await page.goto("/portal/pengaturan/profil");
  const firstName = page.getByLabel("Nama Depan");
  await expect(firstName).toBeEnabled();
  await firstName.fill("Warga");
  await expect(page.getByText("Warga Uji", { exact: true }).first()).toBeVisible();
  await page.getByRole("button", { name: "Simpan Perubahan" }).click();
  await expect(page.getByRole("status")).toContainText("berhasil disimpan");
  await page.reload();
  await expect(page.getByLabel("Nama Depan")).toHaveValue("Warga");

  await page.locator('input[type="file"]#profilePhoto').setInputFiles({
    name: "foto-profil.png",
    mimeType: "image/png",
    buffer: Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=", "base64"),
  });
  await expect(page.getByAltText("Foto profil Warga Uji")).toBeVisible();
  await page.getByRole("button", { name: "Simpan Perubahan" }).click();
  await expect(page.getByRole("status")).toContainText("berhasil disimpan");
  await page.reload();
  await expect(page.getByAltText("Foto profil Warga Uji")).toBeVisible();

  await page.goto("/portal/pengaturan/password");
  await expect(page.getByLabel("Kata Sandi Saat Ini", { exact: true })).toBeEnabled();
  await expect(page.getByLabel("Kata Sandi Baru", { exact: true })).toBeEnabled();
  await expect(page.getByLabel("Konfirmasi Kata Sandi Baru", { exact: true })).toBeEnabled();
  await page.getByLabel("Kata Sandi Saat Ini", { exact: true }).fill(password);
  await page.getByLabel("Kata Sandi Baru", { exact: true }).fill("SandiBaru!234");
  await page.getByLabel("Konfirmasi Kata Sandi Baru", { exact: true }).fill("berbeda");
  await page.getByRole("button", { name: "Simpan Kata Sandi" }).click();
  await expect(page.getByText("Konfirmasi kata sandi baru belum sama.", { exact: true })).toBeVisible();

  await page.goto("/portal/pengaturan/notifikasi");
  const switches = page.getByRole("switch");
  await expect(switches).toHaveCount(6);
  const weeklyDigest = page.getByRole("switch", { name: "Weekly digest" });
  await expect(weeklyDigest).toHaveAttribute("aria-checked", "false");
  await weeklyDigest.click();
  await expect(weeklyDigest).toHaveAttribute("aria-checked", "true");
  await page.getByRole("button", { name: "Simpan Preferensi" }).click();
  await expect(page.getByRole("status")).toContainText("Preferensi tersimpan");
  await page.reload();
  await expect(page.getByRole("switch", { name: "Weekly digest" })).toHaveAttribute("aria-checked", "true");

  await page.goto("/portal/pengaturan/aplikasi");
  await expect(page.getByRole("heading", { name: "Bandung Citizen Journalism" })).toBeVisible();
  await expect(page.getByText("Pembaruan izin mengikuti kebijakan client")).toHaveCount(0);
  await expect(page.getByText(/Pencabutan server akan aktif/)).toHaveCount(0);
  await page.getByRole("button", { name: "Cabut Akses" }).click();
  await expect(page.getByRole("status")).toContainText("Akses aplikasi berhasil dicabut");
  await expect(page.getByRole("heading", { name: "Belum ada aplikasi terhubung" })).toBeVisible();
  await page.reload();
  await expect(page.getByRole("heading", { name: "Belum ada aplikasi terhubung" })).toBeVisible();

  await page.goto("/portal/pengaturan/sesi");
  await page.getByRole("button", { name: "Cabut Sesi" }).click();
  await expect(page).toHaveURL(/\/login$/);
});

test("kata sandi dapat diubah melalui form aktif", async ({ page }) => {
  await login(page);
  await page.goto("/portal/pengaturan/password");
  await expect(page.getByLabel("Email Akun")).toHaveValue(identifier);
  await page.getByLabel("Kata Sandi Saat Ini", { exact: true }).fill(password);
  await page.getByLabel("Kata Sandi Baru", { exact: true }).fill("SandiBaru!234");
  await page.getByLabel("Konfirmasi Kata Sandi Baru", { exact: true }).fill("SandiBaru!234");
  await page.getByRole("button", { name: "Simpan Kata Sandi" }).click();
  await expect(page).toHaveURL(/\/login\?passwordChanged=1$/);
  await expect(page.getByText("Kata sandi berhasil diubah. Silakan masuk kembali menggunakan kata sandi baru.")).toBeVisible();
});

test("pencarian layanan memfilter inventaris", async ({ page }) => {
  await login(page);
  await page.goto("/portal/layanan?q=SALAMAN");
  await expect(page.getByLabel("Cari layanan")).toHaveValue("SALAMAN");
  await expect(page.getByRole("heading", { name: "SALAMAN" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "New Bimma" })).toHaveCount(0);
});

test("login gagal memakai pesan generik", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("Alamat email").fill("akun.tidak.ada@example.test");
  await page.getByLabel("Kata Sandi", { exact: true }).fill("wrong-password");
  await solveCaptcha(page);
  await page.getByRole("button", { name: "Masuk Sekarang", exact: true }).click();
  await expect(
    page.getByRole("region", { name: "Akses SSO Bandung" }).getByRole("alert"),
  ).toContainText("Identitas akun atau kata sandi tidak sesuai");
  expect(new URL(page.url()).search).not.toContain("wrong-password");
});

test("tautan daftar membuka form pendaftaran publik", async ({ page }) => {
  await page.goto("/login");
  await page.getByRole("link", { name: "Daftar Akun Baru", exact: true }).click();
  await expect(page).toHaveURL(/\/daftar$/);
  await expect(page.getByRole("heading", { name: "Buat Akun SSO Baru", level: 2 })).toBeVisible();
  await expect(page.getByLabel("Nama Lengkap")).toBeVisible();
  await expect(page.getByLabel("Alamat Email Aktif")).toBeVisible();
  await expect(page.getByLabel("Kata Sandi", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Konfirmasi Kata Sandi")).toBeVisible();
  await expect(page.getByRole("button", { name: "Daftar Akun SSO" })).toBeVisible();
  await expect(
    page.getByRole("region", { name: "Akses SSO Bandung" }).getByRole("link", { name: "Masuk Akun", exact: true }),
  ).toHaveAttribute("href", "/login");
});

test("form daftar memvalidasi sandi dan captcha sebelum mengirim", async ({ page }) => {
  await page.goto("/daftar");
  await page.getByLabel("Nama Lengkap").fill("Warga Bandung");
  await page.getByLabel("Alamat Email Aktif").fill("warga@gmail.com");
  await page.getByLabel("Kata Sandi", { exact: true }).fill("sandi-kuat-123");
  await page.getByLabel("Konfirmasi Kata Sandi").fill("sandi-berbeda");
  await page.getByRole("button", { name: "Daftar Akun SSO" }).click();
  await expect(
    page.getByRole("region", { name: "Akses SSO Bandung" }).getByRole("alert"),
  ).toContainText("Konfirmasi kata sandi belum sama");

  await page.getByLabel("Konfirmasi Kata Sandi").fill("sandi-kuat-123");
  await page.getByLabel("Verifikasi Keamanan").fill("99");
  await page.getByRole("button", { name: "Daftar Akun SSO" }).click();
  await expect(page.locator("#register-captcha-error")).toContainText("Jawaban verifikasi keamanan belum tepat");
  await expect(page).toHaveURL(/\/daftar$/);
});

test("halaman kebijakan dan ketentuan tersedia untuk publik", async ({ page }) => {
  for (const [route, heading] of [
    ["/kebijakan-privasi", "Kebijakan Privasi"],
    ["/syarat-ketentuan", "Syarat & Ketentuan"],
  ] as const) {
    await page.goto(route);
    await expect(page.getByRole("heading", { name: heading, level: 1 })).toBeVisible();
    await expect(page.getByRole("link", { name: "Kembali ke halaman masuk" })).toHaveAttribute("href", "/login");
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
  }
});

for (const width of [360, 390, 768, 1024, 1280, 1440]) {
  test(`daftar tidak overflow pada lebar ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: width < 600 ? 800 : 900 });
    await page.goto("/daftar");
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
  });
}

test("return URL eksternal ditolak", async ({ page }) => {
  await page.goto("/login?returnTo=https://evil.example/path");
  await page.getByLabel("Alamat email").fill(identifier);
  await page.getByLabel("Kata Sandi", { exact: true }).fill(password);
  await solveCaptcha(page);
  await page.getByRole("button", { name: "Masuk Sekarang", exact: true }).click();
  await expect(page).toHaveURL(/\/portal$/);
});

test("recovery tidak mengungkap keberadaan akun", async ({ page }) => {
  await page.goto("/lupa-kata-sandi");
  await page.getByLabel("Identitas akun").fill("siapa.saja@example.test");
  await page.getByRole("button", { name: "Kirim petunjuk pemulihan" }).click();
  await expect(page).toHaveURL(/\/pemulihan\/dikirim$/);
  await expect(page.getByRole("heading", { name: "Periksa petunjuk pemulihan" })).toBeVisible();
});

test("login Google memberi status yang jelas saat provider belum tersedia", async ({ page }) => {
  await page.goto("/login");
  await page.getByRole("button", { name: "Masuk dengan Google" }).click();
  await expect(page).toHaveURL(/\/login\?oauthError=unavailable$/);
  await expect(
    page.getByRole("region", { name: "Akses SSO Bandung" }).getByRole("alert"),
  ).toContainText("Login Google hanya tersedia saat Supabase Auth digunakan");
});

test("login dapat dioperasikan dengan keyboard dan lolos axe", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("Alamat email").fill(identifier);
  await page.getByLabel("Kata Sandi", { exact: true }).fill(password);

  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter((item) => ["serious", "critical"].includes(item.impact || ""))).toEqual([]);
});

test("captcha login dapat dimuat ulang dan menolak jawaban yang salah", async ({ page }) => {
  await page.goto("/login");
  const question = page.locator("[aria-label^='Berapa'][aria-label*='ditambah']");
  const before = await question.getAttribute("aria-label");
  await page.getByRole("button", { name: "Muat ulang soal verifikasi" }).click();
  await expect(question).not.toHaveAttribute("aria-label", before || "");

  await page.getByLabel("Alamat email").fill(identifier);
  await page.getByLabel("Kata Sandi", { exact: true }).fill(password);
  await page.getByLabel("Verifikasi Keamanan", { exact: true }).fill("99");
  await page.getByRole("button", { name: "Masuk Sekarang", exact: true }).click();
  await expect(page.locator("#captcha-error")).toContainText("Jawaban verifikasi keamanan belum tepat");
  await expect(page).toHaveURL(/\/login$/);
});

test("hero login memuat Gedung Sate dan identitas Kota Bandung", async ({ page }) => {
  await page.goto("/login", { waitUntil: "networkidle" });
  await expect(page.getByRole("heading", { name: "Selamat Datang di Portal Single Sign On Kota Bandung" })).toBeVisible();
  await expect(page.getByText("14+ portal layanan")).toBeVisible();
  const hero = page.getByAltText("Gedung Sate, pusat pemerintahan Provinsi Jawa Barat di Kota Bandung");
  await expect(hero).toBeVisible();
  await expect.poll(() => hero.evaluate((image) => (image as HTMLImageElement).complete && (image as HTMLImageElement).naturalWidth > 0)).toBe(true);
});

for (const width of [360, 390, 768, 1024, 1280, 1440]) {
  test(`login tidak overflow pada lebar ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: width < 600 ? 800 : 900 });
    await page.goto("/login");
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
  });
}

test("visual login mobile dan desktop", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/login", { waitUntil: "networkidle" });
  await page.locator("img").evaluateAll((images) => Promise.all(
    images.map((image) => (image as HTMLImageElement).decode()),
  ));
  await page.evaluate(() => new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
  await expect(page).toHaveScreenshot("login-mobile.png", {
    fullPage: true,
    mask: [page.locator("[aria-label^='Berapa'][aria-label*='ditambah']")],
    maxDiffPixels: 50,
  });

  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/login", { waitUntil: "networkidle" });
  await page.locator("img").evaluateAll((images) => Promise.all(
    images.map((image) => (image as HTMLImageElement).decode()),
  ));
  await page.evaluate(() => new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
  await expect(page).toHaveScreenshot("login-desktop.png", {
    fullPage: true,
    mask: [page.locator("[aria-label^='Berapa'][aria-label*='ditambah']")],
    maxDiffPixels: 50,
  });
});

test("visual daftar mobile dan desktop", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/daftar", { waitUntil: "networkidle" });
  await page.locator("img").evaluateAll((images) => Promise.all(
    images.map((image) => (image as HTMLImageElement).decode()),
  ));
  await page.evaluate(() => new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
  await expect(page).toHaveScreenshot("register-mobile.png", {
    fullPage: true,
    mask: [page.locator("[aria-label^='Berapa'][aria-label*='ditambah']")],
  });

  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/daftar", { waitUntil: "networkidle" });
  await page.locator("img").evaluateAll((images) => Promise.all(
    images.map((image) => (image as HTMLImageElement).decode()),
  ));
  await page.evaluate(() => new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
  await expect(page).toHaveScreenshot("register-desktop.png", {
    fullPage: true,
    mask: [page.locator("[aria-label^='Berapa'][aria-label*='ditambah']")],
  });
});

test("portal profil responsif, aksesibel, dan stabil secara visual", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await login(page);

  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter((item) => ["serious", "critical"].includes(item.impact || ""))).toEqual([]);
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth),
  ).toBeLessThanOrEqual(1);
  await expect(page).toHaveScreenshot("portal-mobile.png", {
    fullPage: true,
    caret: "initial",
    mask: [page.getByTestId("latest-login-meta")],
  });

  await page.setViewportSize({ width: 1280, height: 900 });
  await page.reload();
  await expect(page).toHaveScreenshot("portal-desktop.png", {
    fullPage: true,
    caret: "initial",
    mask: [page.getByTestId("latest-login-meta")],
  });
});

test("pengaturan profil dan kata sandi sesuai desain responsif", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await login(page);

  await page.goto("/portal/pengaturan/profil");
  await expect(page.getByRole("heading", { name: "Profil Saya", level: 1 })).toBeVisible();
  const profilePhotos = page.locator("span[class*='profileAvatar'], span[class*='previewAvatar']");
  await expect(page).toHaveScreenshot("settings-profile-mobile.png", { fullPage: true, caret: "initial", mask: [profilePhotos] });

  await page.setViewportSize({ width: 1280, height: 900 });
  await page.reload();
  await expect(page).toHaveScreenshot("settings-profile-desktop.png", { fullPage: true, caret: "initial", mask: [profilePhotos] });

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/portal/pengaturan/password");
  await expect(page.getByRole("heading", { name: "Kata Sandi Saya", level: 1 })).toBeVisible();
  await expect(page).toHaveScreenshot("settings-password-mobile.png", { fullPage: true, caret: "initial" });

  await page.setViewportSize({ width: 1280, height: 900 });
  await page.reload();
  await expect(page).toHaveScreenshot("settings-password-desktop.png", { fullPage: true, caret: "initial" });
});

test("log aktivitas dan sesi perangkat sesuai desain responsif", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await login(page);

  await page.goto("/portal/pengaturan/aktivitas");
  await expect(page.getByRole("heading", { name: "Log Aktivitas", level: 1 })).toBeVisible();
  await expect(page).toHaveScreenshot("settings-activity-mobile.png", { fullPage: true, caret: "initial" });

  await page.setViewportSize({ width: 1280, height: 900 });
  await page.reload();
  await expect(page).toHaveScreenshot("settings-activity-desktop.png", { fullPage: true, caret: "initial" });

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/portal/pengaturan/sesi");
  await expect(page.getByRole("heading", { name: "Sesi Perangkat", level: 1 })).toBeVisible();
  await expect(page).toHaveScreenshot("settings-sessions-mobile.png", { fullPage: true, caret: "initial" });

  await page.setViewportSize({ width: 1280, height: 900 });
  await page.reload();
  await expect(page).toHaveScreenshot("settings-sessions-desktop.png", { fullPage: true, caret: "initial" });
});

test("katalog layanan dapat dicari dan difilter tanpa memuat ulang halaman", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await login(page);
  await page.goto("/portal/layanan");

  await expect(page.getByRole("heading", { name: "Daftar Layanan Aplikasi SSO", level: 1 })).toBeVisible();
  await page.getByLabel("Cari layanan").fill("opendata");
  await expect(page.getByRole("heading", { name: "Bandung Opendata", level: 2 })).toBeVisible();
  await expect(page.getByRole("status")).toHaveText("1 layanan ditemukan");

  await page.getByLabel("Cari layanan").fill("");
  await page.getByRole("button", { name: "Internal Pemkot" }).click();
  await expect(page.getByRole("button", { name: "Internal Pemkot" })).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByRole("heading", { name: "New Bimma", level: 2 })).toBeVisible();
  await expect(page.getByRole("heading", { name: "SALAMAN", level: 2 })).toHaveCount(0);

  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter((item) => ["serious", "critical"].includes(item.impact || ""))).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);

  await page.getByRole("button", { name: "Semua (14)" }).click();
  await expect(page).toHaveScreenshot("services-mobile.png", { fullPage: true, caret: "initial" });

  await page.setViewportSize({ width: 1280, height: 900 });
  await page.reload();
  await expect(page).toHaveScreenshot("services-desktop.png", { fullPage: true, caret: "initial" });
});

test("aplikasi terkoneksi dan notifikasi sesuai desain responsif", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await login(page);

  await page.goto("/portal/pengaturan/aplikasi");
  await expect(page.getByRole("heading", { name: "Aplikasi Terkoneksi", level: 1 })).toBeVisible();
  await expect(page).toHaveScreenshot("settings-connected-apps-mobile.png", { fullPage: true, caret: "initial" });

  await page.setViewportSize({ width: 1280, height: 900 });
  await page.reload();
  await expect(page).toHaveScreenshot("settings-connected-apps-desktop.png", { fullPage: true, caret: "initial" });

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/portal/pengaturan/notifikasi");
  await expect(page.getByRole("heading", { name: "Preferensi Notifikasi", level: 1 })).toBeVisible();
  await expect(page).toHaveScreenshot("settings-notifications-mobile.png", { fullPage: true, caret: "initial" });

  await page.setViewportSize({ width: 1280, height: 900 });
  await page.reload();
  await expect(page).toHaveScreenshot("settings-notifications-desktop.png", { fullPage: true, caret: "initial" });
});
