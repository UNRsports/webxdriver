/**
 * EN: Launch headless Chrome / Firefox with an unpacked extension loaded.
 * JA: アンパック拡張をロードした headless Chrome / Firefox を起動する。
 */

import { rmSync } from "node:fs"
import { Builder, type WebDriver } from "selenium-webdriver"
import chrome from "selenium-webdriver/chrome.js"
import firefox from "selenium-webdriver/firefox.js"
import { chromeExtensionIdFromPath } from "./chrome-extension-id.js"
import { resolveUnpackedExtensionPath } from "./extension-path.js"
import { readGeckoId } from "./gecko-id.js"
import { createProfileDir } from "./profile.js"
import { resolveFirefoxExtensionUuid } from "./resolve-firefox-extension-uuid.js"
import type { ExtensionSession, LaunchExtensionSessionOptions } from "./types.js"

/**
 * EN: Branded Chrome 137+ dropped `--load-extension`. Pin Chrome for Testing via Selenium Manager.
 * JA: ブランド版 Chrome 137+ は `--load-extension` 不可。Selenium Manager で Chrome for Testing を固定。
 */
const DEFAULT_CHROME_FOR_TESTING_VERSION = "141.0.7390.78"

function resolveChromeVersion(options: LaunchExtensionSessionOptions): string {
  if (typeof options.chromeVersion === "string" && options.chromeVersion.trim() !== "") {
    return options.chromeVersion.trim()
  }
  const fromEnv = process.env.WEBXDRIVER_CHROME_VERSION?.trim()
  if (fromEnv) {
    return fromEnv
  }
  return DEFAULT_CHROME_FOR_TESTING_VERSION
}

function resolveHeadless(options: LaunchExtensionSessionOptions): boolean {
  if (typeof options.headless === "boolean") {
    return options.headless
  }
  return true
}

async function quitDriverBestEffort(driver: WebDriver): Promise<void> {
  try {
    await driver.quit()
  } catch {
    /* EN: Driver may already be dead. */
  }
}

function removeProfileBestEffort(userDataDir: string): void {
  try {
    rmSync(userDataDir, { recursive: true, force: true })
  } catch {
    /* ignore */
  }
}

async function launchChrome(
  extensionPath: string,
  options: LaunchExtensionSessionOptions
): Promise<ExtensionSession> {
  const userDataDir = createProfileDir("chrome", options.profileBaseDir)
  const headless = resolveHeadless(options)
  const chromeOptions = new chrome.Options()
  chromeOptions.setBrowserVersion(resolveChromeVersion(options))

  const args: string[] = [
    "--disable-gpu",
    "--no-sandbox",
    "--disable-dev-shm-usage",
    `--user-data-dir=${userDataDir}`,
    `--disable-extensions-except=${extensionPath}`,
    `--load-extension=${extensionPath}`
  ]
  if (headless) {
    // EN: New headless supports extensions; Chrome for Testing keeps --load-extension.
    args.unshift("--headless=new")
  }
  chromeOptions.addArguments(...args)

  let driver: WebDriver
  try {
    driver = await new Builder().forBrowser("chrome").setChromeOptions(chromeOptions).build()
  } catch (err) {
    removeProfileBestEffort(userDataDir)
    throw err
  }

  const extensionId = chromeExtensionIdFromPath(extensionPath)
  const extensionOrigin = `chrome-extension://${extensionId}`

  return {
    browser: "chrome",
    driver,
    extensionPath,
    extensionOrigin,
    userDataDir,
    quit: async () => {
      await quitDriverBestEffort(driver)
      removeProfileBestEffort(userDataDir)
    }
  }
}

async function launchFirefoxOnce(
  extensionPath: string,
  options: LaunchExtensionSessionOptions
): Promise<ExtensionSession> {
  const userDataDir = createProfileDir("firefox", options.profileBaseDir)
  const headless = resolveHeadless(options)
  const firefoxOptions = new firefox.Options()
  if (headless) {
    firefoxOptions.addArguments("-headless")
  }
  firefoxOptions.addArguments("-profile", userDataDir)
  firefoxOptions.setPreference("xpinstall.signatures.required", false)
  firefoxOptions.setPreference("extensions.autoDisableScopes", 0)
  firefoxOptions.setPreference("devtools.debugger.remote-enabled", true)

  // EN: Required to use Marionette chrome context (open moz-extension:// pages).
  const service = new firefox.ServiceBuilder().addArguments("--allow-system-access")

  let driver: firefox.Driver
  try {
    driver = (await new Builder()
      .forBrowser("firefox")
      .setFirefoxOptions(firefoxOptions)
      .setFirefoxService(service)
      .build()) as firefox.Driver
  } catch (err) {
    removeProfileBestEffort(userDataDir)
    throw err
  }

  try {
    await driver.installAddon(extensionPath, true)
    const geckoId = readGeckoId(extensionPath)
    const uuid = await resolveFirefoxExtensionUuid(userDataDir, geckoId, 60_000)
    const extensionOrigin = `moz-extension://${uuid}`

    return {
      browser: "firefox",
      driver,
      extensionPath,
      extensionOrigin,
      userDataDir,
      quit: async () => {
        await quitDriverBestEffort(driver)
        removeProfileBestEffort(userDataDir)
      }
    }
  } catch (err) {
    await quitDriverBestEffort(driver)
    removeProfileBestEffort(userDataDir)
    throw err
  }
}

/**
 * EN: Retry Firefox launch — rapid create/destroy can wedge Marionette prefs.
 *     Backoff after a failed attempt only (not a correctness timing wait).
 */
async function launchFirefox(
  extensionPath: string,
  options: LaunchExtensionSessionOptions
): Promise<ExtensionSession> {
  const maxAttempts = 3
  let lastError: unknown
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      return await launchFirefoxOnce(extensionPath, options)
    } catch (err) {
      lastError = err
      await new Promise((resolve) => setTimeout(resolve, 750 * attempt))
    }
  }
  throw lastError
}

/**
 * EN: Launch a headless browser with the given unpacked extension loaded.
 * JA: 指定のアンパック拡張をロードしたブラウザを起動する。
 */
export async function launchExtensionSession(
  options: LaunchExtensionSessionOptions
): Promise<ExtensionSession> {
  if (options === null || typeof options !== "object") {
    throw new Error("launchExtensionSession options must be an object")
  }
  if (options.browser !== "chrome" && options.browser !== "firefox") {
    throw new Error(`Unsupported browser=${JSON.stringify(options.browser)} (use chrome|firefox)`)
  }
  const extensionPath = resolveUnpackedExtensionPath(options.extensionPath)
  if (options.browser === "firefox") {
    return launchFirefox(extensionPath, options)
  }
  return launchChrome(extensionPath, options)
}
