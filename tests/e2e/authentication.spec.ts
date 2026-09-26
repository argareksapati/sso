import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const identifier = "pengguna.uji@example.test";
const password = "local-test-password-only";

async function login(page: import("@playwright/test").Page) {
  await page.goto("/login");
  await page.getByLabel("Identitas akun").fill(identifier);
  await page.getByLabel("Kata sandi").fill(password);
  await page.getByRole("button", { name: "Masuk", exact: true }).click();
  await expect(page).toHaveURL(/\/portal$/);
}

test("login mock, portal, dan logout", async ({ page }) => {
  await login(page);
  await expect(page.getByRole("heading", { name: "Pilih layanan yang Anda perlukan" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Kandidat integrasi" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "SIPETRUK" })).toBeVisible();
  await expect(page.getByText("6 aplikasi tercatat untuk tahap discovery.")).toBeVisible();
  await page.getByRole("button", { name: "Keluar" }).click();
  await expect(page).toHaveURL(/\/login$/);
});

test("login gagal memakai pesan generik", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("Identitas akun").fill("akun.tidak.ada@example.test");
  await page.getByLabel("Kata sandi").fill("wrong-password");
  await page.getByRole("button", { name: "Masuk", exact: true }).click();
  await expect(
    page.getByRole("region", { name: "Akses SSO Bandung" }).getByRole("alert"),
  ).toContainText("Identitas akun atau kata sandi tidak sesuai");
  expect(new URL(page.url()).search).not.toContain("wrong-password");
});

test("return URL eksternal ditolak", async ({ page }) => {
  await page.goto("/login?returnTo=https://evil.example/path");
  await page.getByLabel("Identitas akun").fill(identifier);
  await page.getByLabel("Kata sandi").fill(password);
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

test("login dapat dioperasikan dengan keyboard dan lolos axe", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByLabel("Identitas akun")).toBeFocused();
  await page.getByLabel("Identitas akun").fill(identifier);
  await page.getByLabel("Kata sandi").fill(password);

  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter((item) => ["serious", "critical"].includes(item.impact || ""))).toEqual([]);
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
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/login");
  await page.evaluate(() => new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
  await expect(page).toHaveScreenshot("login-mobile.png", { fullPage: true });

  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/login");
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
  await expect(page).toHaveScreenshot("portal-mobile.png", { fullPage: true });

  await page.setViewportSize({ width: 1280, height: 900 });
  await page.reload();
  await expect(page).toHaveScreenshot("portal-desktop.png", { fullPage: true });
});
