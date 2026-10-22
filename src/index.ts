/**
 * EN: webXdriver — Chrome + Firefox unpacked-extension WebDriver lifecycle.
 * JA: webXdriver — Chrome / Firefox アンパック拡張の WebDriver ライフサイクル。
 *
 * Not affiliated with the Selenium project.
 */

export { resolveE2eBrowser, type ResolveE2eBrowserOptions } from "./browser.js"
export { chromeExtensionIdFromPath } from "./chrome-extension-id.js"
export { resolveUnpackedExtensionPath } from "./extension-path.js"
export { readGeckoId } from "./gecko-id.js"
export { launchExtensionSession } from "./launch.js"
export {
  openExtensionPage,
  reloadExtensionPage,
  resolveExtensionPageUrl
} from "./open-page.js"
export { createProfileDir } from "./profile.js"
export { resolveFirefoxExtensionUuid } from "./resolve-firefox-extension-uuid.js"
export type {
  E2eBrowser,
  ExtensionSession,
  LaunchExtensionSessionOptions
} from "./types.js"
