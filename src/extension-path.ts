/**
 * EN: Validate an unpacked extension directory before launch.
 * JA: 起動前にアンパック拡張ディレクトリを検証する。
 */

import { existsSync } from "node:fs"
import { isAbsolute, resolve } from "node:path"

export function resolveUnpackedExtensionPath(extensionPath: string): string {
  if (typeof extensionPath !== "string" || extensionPath.trim() === "") {
    throw new Error("extensionPath must be a non-empty string")
  }
  const absolute = isAbsolute(extensionPath) ? extensionPath : resolve(extensionPath)
  const manifestPath = resolve(absolute, "manifest.json")
  if (!existsSync(manifestPath)) {
    throw new Error(`Missing manifest.json under ${absolute}`)
  }
  return absolute
}
