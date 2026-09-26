import { chromium } from "playwright";

const origin = process.env.PRODUCTION_VERIFY_ORIGIN ?? "http://127.0.0.1:3200";

const browser = await chromium.launch({ headless: true });

try {
  const context = await browser.newContext();
  const page = await context.newPage();
  const consoleErrors = [];

  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });

  const response = await page.goto(`${origin}/login`);
  if (!response?.ok()) throw new Error(`Halaman login merespons ${response?.status()}.`);

  const csp = response.headers()["content-security-policy"] ?? "";
  if (!csp.includes("'strict-dynamic'") || !csp.includes("'nonce-")) {
    throw new Error("CSP production tidak memuat nonce dan strict-dynamic.");
  }
  if (csp.includes("'unsafe-eval'")) {
    throw new Error("CSP production masih mengizinkan unsafe-eval.");
  }

  const scriptNonces = await page
    .locator("script[src]")
    .evaluateAll((scripts) => scripts.map((script) => script.nonce));
  if (!scriptNonces.length || scriptNonces.some((nonce) => !nonce)) {
    throw new Error("Ada script framework tanpa nonce CSP.");
  }

  const passwordInput = page.getByLabel("Kata sandi");
  await passwordInput.fill("uji-hidrasi");
  await page.getByRole("button", { name: "Tampilkan" }).click();
  if ((await passwordInput.getAttribute("type")) !== "text") {
    throw new Error("Client login tidak terhidrasi.");
  }
  if (consoleErrors.length) {
    throw new Error(`Browser console errors: ${consoleErrors.join(" | ")}`);
  }

  console.log(
    JSON.stringify({
      csp: "PASS",
      scriptNonces: "PASS",
      hydration: "PASS",
      consoleErrors: 0,
    }),
  );
} finally {
  await browser.close();
}
