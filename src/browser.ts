/**
 * EN: Resolve target browser from an explicit value or environment variable.
 * JA: 明示値または環境変数から対象ブラウザを解決する。
 */

import type { E2eBrowser } from "./types.js"

const DEFAULT_ENV_KEY = "WEBXDRIVER_BROWSER"

export type ResolveE2eBrowserOptions = {
  /** Explicit browser string (`chrome` / `firefox` / aliases). Wins over env. */
  value?: string
  /** Env var name (default `WEBXDRIVER_BROWSER`). */
  envKey?: string
  /** Used when neither `value` nor env is set (default `chrome`). */
  defaultBrowser?: E2eBrowser
}

/**
 * EN: Accept `chrome|chromium|firefox|gecko`.
 * JA: `chrome|chromium|firefox|gecko` を受け付ける。
 */
export function resolveE2eBrowser(options?: ResolveE2eBrowserOptions): E2eBrowser {
  const envKey = options?.envKey ?? DEFAULT_ENV_KEY
  const defaultBrowser = options?.defaultBrowser ?? "chrome"
  const fromValue = options?.value?.trim()
  const fromEnv = process.env[envKey]?.trim()
  const raw = (fromValue || fromEnv || defaultBrowser).toLowerCase()

  if (raw === "firefox" || raw === "gecko") {
    return "firefox"
  }
  if (raw === "chrome" || raw === "chromium") {
    return "chrome"
  }
  throw new Error(
    `Unsupported browser=${JSON.stringify(raw)} (use chrome|firefox; env ${envKey})`
  )
}
