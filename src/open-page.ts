/**
 * EN: Open / reload extension pages (including moz-extension:// via chrome-context).
 * JA: 拡張ページのオープン／リロード（moz-extension:// は chrome コンテキスト経由）。
 */

import type { WebDriver } from "selenium-webdriver"
import firefox from "selenium-webdriver/firefox.js"
import type { ExtensionSession } from "./types.js"

function isExtensionPageUrl(value: string): boolean {
  return (
    value.startsWith("chrome-extension://") ||
    value.startsWith("moz-extension://")
  )
}

/**
 * EN: Build a full extension URL from `extensionOrigin` + path, or pass through absolute URLs.
 * JA: origin + パスから URL を組み立てる。絶対 URL はそのまま使う。
 */
export function resolveExtensionPageUrl(session: ExtensionSession, pagePathOrUrl: string): string {
  if (typeof pagePathOrUrl !== "string" || pagePathOrUrl.trim() === "") {
    throw new Error("pagePathOrUrl must be a non-empty string")
  }
  const trimmed = pagePathOrUrl.trim()
  if (isExtensionPageUrl(trimmed)) {
    return trimmed
  }
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    throw new Error(
      `Expected an extension page path or chrome-extension:// / moz-extension:// URL, got ${trimmed}`
    )
  }
  const origin = session.extensionOrigin.replace(/\/$/, "")
  const path = trimmed.startsWith("/") ? trimmed : `/${trimmed}`
  return `${origin}${path}`
}

function urlMatches(current: string, expected: string): boolean {
  return (
    current === expected ||
    current.startsWith(`${expected}?`) ||
    current.startsWith(`${expected}#`)
  )
}

/**
 * EN: Marionette blocks `driver.get(moz-extension://…)`. Open via chrome-context trusted navigation.
 * JA: Marionette は `driver.get(moz-extension://…)` を拒否するため、chrome コンテキストで開く。
 */
async function openFirefoxExtensionPage(driver: WebDriver, url: string): Promise<void> {
  const fx = driver as firefox.Driver
  await fx.setContext(firefox.Context.CHROME)
  try {
    await fx.executeScript(
      `
      const pageUrl = arguments[0];
      const win = Services.wm.getMostRecentWindow("navigator:browser");
      if (!win) {
        throw new Error("no navigator:browser window");
      }
      if (typeof win.openTrustedLinkIn === "function") {
        win.openTrustedLinkIn(pageUrl, "tab");
        return;
      }
      if (win.gBrowser && typeof win.gBrowser.addTrustedTab === "function") {
        win.gBrowser.addTrustedTab(pageUrl);
        return;
      }
      throw new Error("no trusted tab opener available");
      `,
      url
    )
  } finally {
    await fx.setContext(firefox.Context.CONTENT)
  }

  await driver.wait(async () => {
    for (const handle of await driver.getAllWindowHandles()) {
      await driver.switchTo().window(handle)
      const current = await driver.getCurrentUrl()
      if (urlMatches(current, url)) {
        return true
      }
    }
    return false
  }, 60_000)
}

async function waitForExtensionPageUrl(driver: WebDriver, url: string): Promise<void> {
  await driver.wait(async () => {
    for (const handle of await driver.getAllWindowHandles()) {
      await driver.switchTo().window(handle)
      const current = await driver.getCurrentUrl()
      if (urlMatches(current, url)) {
        return true
      }
    }
    return false
  }, 60_000)
}

/**
 * EN: Navigate to an extension page. Path form: `/popup.html` (joined with `extensionOrigin`).
 * JA: 拡張ページへ遷移する。パス形式（`/popup.html`）は `extensionOrigin` と結合。
 */
export async function openExtensionPage(
  session: ExtensionSession,
  pagePathOrUrl: string
): Promise<void> {
  const pageUrl = resolveExtensionPageUrl(session, pagePathOrUrl)
  if (session.browser === "firefox") {
    await openFirefoxExtensionPage(session.driver, pageUrl)
    return
  }
  await session.driver.get(pageUrl)
  await waitForExtensionPageUrl(session.driver, pageUrl)
}

/**
 * EN: Reload the extension page. Firefox closes the tab and re-opens via chrome-context
 *     (`navigate().refresh()` is unreliable for moz-extension under Marionette).
 * JA: 拡張ページをリロードする。Firefox はタブを閉じて chrome コンテキストで開き直す。
 */
export async function reloadExtensionPage(
  session: ExtensionSession,
  pagePathOrUrl: string
): Promise<void> {
  const pageUrl = resolveExtensionPageUrl(session, pagePathOrUrl)
  if (session.browser === "firefox") {
    const previous = await session.driver.getWindowHandle()
    await openFirefoxExtensionPage(session.driver, pageUrl)
    const handles = await session.driver.getAllWindowHandles()
    for (const handle of handles) {
      if (handle === previous) {
        try {
          await session.driver.switchTo().window(handle)
          await session.driver.close()
        } catch {
          /* EN: Tab may already be gone. */
        }
        break
      }
    }
    await waitForExtensionPageUrl(session.driver, pageUrl)
    return
  }
  await session.driver.navigate().refresh()
  await waitForExtensionPageUrl(session.driver, pageUrl)
}
