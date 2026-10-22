/**
 * EN: Shared session types for webXdriver.
 * JA: webXdriver の共有セッション型。
 */

import type { WebDriver } from "selenium-webdriver"

export type E2eBrowser = "chrome" | "firefox"

export type ExtensionSession = {
  browser: E2eBrowser
  driver: WebDriver
  /** Absolute path to the unpacked extension directory that was loaded. */
  extensionPath: string
  /**
   * Origin for extension pages, e.g. `chrome-extension://…` or `moz-extension://…`
   * (no trailing slash).
   */
  extensionOrigin: string
  /** Profile directory used for this session, or null if not applicable. */
  userDataDir: string | null
  quit: () => Promise<void>
}

export type LaunchExtensionSessionOptions = {
  browser: E2eBrowser
  /** Absolute or relative path to an unpacked extension directory (`manifest.json`). */
  extensionPath: string
  /**
   * Parent directory for temporary browser profiles.
   * Defaults to `<os.tmpdir()>/webxdriver-profiles`.
   * Prefer a project-local path when `/tmp` quotas break Chrome prefs writes.
   */
  profileBaseDir?: string
  /**
   * Chrome for Testing version for Selenium Manager (`setBrowserVersion`).
   * Defaults to a pinned version that still supports `--load-extension` under headless.
   * Override with this option or `WEBXDRIVER_CHROME_VERSION`.
   */
  chromeVersion?: string
  /**
   * Headless mode (default `true`). Chrome uses `--headless=new`; Firefox uses `-headless`.
   */
  headless?: boolean
}
