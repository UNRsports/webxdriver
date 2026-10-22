/**
 * EN: Read `browser_specific_settings.gecko.id` from an unpacked extension manifest.
 * JA: アンパック拡張の manifest から gecko.id を読む。
 */

import { readFileSync } from "node:fs"
import { join } from "node:path"

export function readGeckoId(extensionPath: string): string {
  const raw = readFileSync(join(extensionPath, "manifest.json"), "utf8")
  const manifest = JSON.parse(raw) as {
    browser_specific_settings?: { gecko?: { id?: unknown } }
  }
  const id = manifest.browser_specific_settings?.gecko?.id
  if (typeof id !== "string" || id.trim() === "") {
    throw new Error(`Missing browser_specific_settings.gecko.id in ${extensionPath}`)
  }
  return id
}
