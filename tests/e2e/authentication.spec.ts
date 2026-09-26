import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const identifier = "pengguna.uji@example.test";
const password = "local-test-password-only";

async function login(page: import("@playwright/test").Page) {
  await page.goto("/login");
  await page.getByLabel("Alamat email").fill(identifier);
  await page.getByLabel("Kata sandi", { exact: true }).fill(password);
  await solveCaptcha(page);
  await page.getByRole("button", { name: "Masuk", exact: true }).click();
  await expect(page).toHaveURL(/\/portal$/);
}

async function solveCaptcha(page: import("@playwright/test").Page) {
  const question = page.locator("[aria-label^='Berapa'][aria-label*='ditambah']");
  const prompt = await question.getAttribute("aria-label");
  const numbers = prompt?.match(/\d+/g)?.map(Number) || [];
  expect(numbers).toHaveLength(2);
  await page.getByLabel("Verifikasi keamanan (Captcha)").fill(String(numbers[0] + numbers[1]));
}

test("login mock, portal, dan logout", async ({ page }) => {
  await login(page);
  await expect(page.getByRole("heading", { name: "Profil Saya", level: 1 })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Aksi Cepat" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Frekuensi Penggunaan" })).toBeVisible();
  await page.getByRole("button", { name: "Keluar" }).click();
  await expect(page).toHaveURL(/\/login$/);
});

test("seluruh halaman akun terlindungi dan dapat dinavigasi", async ({ page }) => {
  const routes = [
    ["/portal/layanan", "Pilih layanan yang Anda perlukan"],
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

test("pencarian layanan memfilter inventaris", async ({ page }) => {
  await login(page);
  await page.goto("/portal/layanan");
  const search = page.locator("main input[name='q']");
  await search.fill("SIPETRUK");
  await search.press("Enter");
  await expect(page).toHaveURL(/\/portal\/layanan\?q=SIPETRUK$/);
  await expect(page.getByRole("heading", { name: "SIPETRUK" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "SIMPELMAN" })).toHaveCount(0);
});

test("login gagal memakai pesan generik", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("Alamat email").fill("akun.tidak.ada@example.test");
  await page.getByLabel("Kata sandi", { exact: true }).fill("wrong-password");
  await solveCaptcha(page);
  await page.getByRole("button", { name: "Masuk", exact: true }).click();
  await expect(
    page.getByRole("region", { name: "Akses SSO Bandung" }).getByRole("alert"),
  ).toContainText("Identitas akun atau kata sandi tidak sesuai");
  expect(new URL(page.url()).search).not.toContain("wrong-password");
});

test("return URL eksternal ditolak", async ({ page }) => {
  await page.goto("/login?returnTo=https://evil.example/path");
  await page.getByLabel("Alamat email").fill(identifier);
  await page.getByLabel("Kata sandi", { exact: true }).fill(password);
  await solveCaptcha(page);
  await page.getByRole("button", { name: "Masuk", exact: true }).click();
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
  await page.getByRole("button", { name: "Masuk dengan Gmail" }).click();
  await expect(page).toHaveURL(/\/login\?oauthError=unavailable$/);
  await expect(page.getByRole("alert")).toContainText("Login Google hanya tersedia saat Supabase Auth digunakan");
});

test("login dapat dioperasikan dengan keyboard dan lolos axe", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByLabel("Alamat email")).toBeFocused();
  await page.getByLabel("Alamat email").fill(identifier);
  await page.getByLabel("Kata sandi", { exact: true }).fill(password);

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
  await page.getByLabel("Kata sandi", { exact: true }).fill(password);
  await page.getByLabel("Verifikasi keamanan (Captcha)").fill("99");
  await page.getByRole("button", { name: "Masuk", exact: true }).click();
  await expect(page.locator("#captcha-error")).toContainText("Jawaban verifikasi keamanan belum tepat");
  await expect(page).toHaveURL(/\/login$/);
});

test("katalog login memuat seluruh logo dan marquee dapat dijeda", async ({ page }) => {
  await page.goto("/login", { waitUntil: "networkidle" });
  const catalog = page.getByRole("region", { name: /Daftar 14 layanan terintegrasi/ });
  await expect(catalog.getByRole("listitem")).toHaveCount(14);

  const logos = catalog.locator("img");
  await expect(logos).toHaveCount(22);
  await expect.poll(
    () => logos.evaluateAll((images) => images.every((image) => {
      const logo = image as HTMLImageElement;
      return logo.complete && logo.naturalWidth > 0;
    })),
  ).toBe(true);

  const track = catalog.locator(":scope > div").first();
  const before = await track.evaluate((element) => getComputedStyle(element).transform);
  await page.waitForTimeout(500);
  const after = await track.evaluate((element) => getComputedStyle(element).transform);
  expect(after).not.toBe(before);

  await catalog.hover();
  await page.waitForTimeout(100);
  const pausedAt = await track.evaluate((element) => getComputedStyle(element).transform);
  await page.waitForTimeout(500);
  expect(await track.evaluate((element) => getComputedStyle(element).transform)).toBe(pausedAt);
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
  await expect(page).toHaveScreenshot("login-mobile.png", { fullPage: true });

  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/login", { waitUntil: "networkidle" });
  await page.locator("img").evaluateAll((images) => Promise.all(
    images.map((image) => (image as HTMLImageElement).decode()),
  ));
  await page.evaluate(() => new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
  await expect(page).toHaveScreenshot("login-desktop.png", { fullPage: true });
});

test("portal kandidat integrasi responsif, aksesibel, dan stabil secara visual", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await login(page);

  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter((item) => ["serious", "critical"].includes(item.impact || ""))).toEqual([]);
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth),
  ).toBeLessThanOrEqual(1);
  await expect(page).toHaveScreenshot("portal-mobile.png", { fullPage: true, caret: "initial" });

  await page.setViewportSize({ width: 1280, height: 900 });
  await page.reload();
  await expect(page).toHaveScreenshot("portal-desktop.png", { fullPage: true, caret: "initial" });
});
