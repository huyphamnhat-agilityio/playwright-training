import { devices } from "@playwright/test";

export const BROWSERS = {
  CHROMIUM: "chromium",
  FIREFOX: "firefox",
  WEBKIT: "webkit",
} as const;

export const BROWSER_CONFIGS = [
  {
    name: BROWSERS.CHROMIUM,
    device: devices["Desktop Chrome"],
  },
  {
    name: BROWSERS.FIREFOX,
    device: devices["Desktop Firefox"],
  },
  {
    name: BROWSERS.WEBKIT,
    device: devices["Desktop Safari"],
  },
] as const;

export const AUTH_STATE_PATH = "playwright/.auth/user.json";

export const TEST_PATTERNS = {
  SETUP: /.*\.setup\.ts/,
  AUTH: /auth\.spec\.ts/,
} as const;
