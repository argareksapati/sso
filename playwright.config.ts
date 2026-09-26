import { defineConfig, devices } from "@playwright/test";

const port = 3100;
const baseURL = `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
  ],
  webServer: {
    command: `npm run dev -- --port ${port}`,
    url: `${baseURL}/login`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: {
      ...process.env,
      APP_ORIGIN: baseURL,
      AUTH_PROVIDER: "mock",
      AUTH_MOCK_IDENTIFIER: "pengguna.uji@example.test",
      AUTH_MOCK_PASSWORD: "local-test-password-only",
      AUTH_MOCK_DISPLAY_NAME: "Pengguna Uji",
      AUTH_SESSION_SECRET: "development-test-secret-with-at-least-32-characters",
    },
  },
});
