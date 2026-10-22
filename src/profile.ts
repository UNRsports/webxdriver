/**
 * EN: Temporary browser profile directories for extension sessions.
 * JA: 拡張セッション用の一時プロファイルディレクトリ。
 */

import { mkdirSync, mkdtempSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"

/**
 * EN: Create a unique profile dir under `profileBaseDir` (or tmp default).
 * JA: `profileBaseDir`（未指定時は tmp）配下に一意なプロファイルを作る。
 */
export function createProfileDir(prefix: string, profileBaseDir?: string): string {
  const base =
    typeof profileBaseDir === "string" && profileBaseDir.trim() !== ""
      ? profileBaseDir
      : join(tmpdir(), "webxdriver-profiles")
  mkdirSync(base, { recursive: true })
  return mkdtempSync(join(base, `${prefix}-`))
}
