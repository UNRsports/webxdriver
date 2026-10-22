# webXdriver (`webxdriver`)

> **English** documentation is first; the complete **Japanese** version follows below ([jump to 日本語](#japanese)).

## Table of contents

- [Status](#status)
- [Introduction](#introduction)
- [Install](#install)
- [Quick start](#quick-start)
- [API (lifecycle)](#api-lifecycle)
  - [Options](#options)
- [Environment variables](#environment-variables)
- [Notes](#notes)
- [Development](#development)
- [Provenance](#provenance)
- [License](#license)
- [日本語](#japanese)

<a id="status"></a>

## Status

- **Scope:** browser **extensions only** (unpacked Chrome + Firefox). Not a general website E2E framework.
- **Maturity:** `0.x` — public API may change without a major bump until `1.0.0`.
- **Tests today:** unit tests (`pnpm test`). Minimal fixture / browser e2e is planned (roadmap item ③).
- **Consumers:** intended first consumer is [BMXt](https://github.com/UNRsports/bmxt) via a thin wrapper (not switched yet).

<a id="introduction"></a>

## Introduction

**webXdriver** is a headless **WebDriver** harness for **unpacked** Chrome and Firefox extensions.

It covers the lifecycle that product E2E suites usually reimplement by hand:

1. Load an unsigned / unpacked extension
2. Resolve `extensionOrigin` (`chrome-extension://…` or `moz-extension://…`)
3. Open extension pages — including `moz-extension://` via Firefox chrome-context

It is **runner-agnostic** (Node’s `node:test`, Vitest, Mocha, and similar). The peer dependency is [`selenium-webdriver`](https://www.npmjs.com/package/selenium-webdriver).

> Not affiliated with the Selenium / WebDriver projects.

**About the name** — a play on **Web** + e**X**tension + **WebDriver**:

- **web** — browser automation
- **X** — cross-browser (Chrome + Firefox) and extension-focused
- **driver** — WebDriver session lifecycle

<a id="install"></a>

## Install

From npm (when published):

```bash
pnpm add -D webxdriver selenium-webdriver
```

From GitHub (until npm `0.1.0`):

```bash
pnpm add -D selenium-webdriver github:UNRsports/webxdriver
```

<a id="quick-start"></a>

## Quick start

```ts
import {
  launchExtensionSession,
  openExtensionPage,
  resolveE2eBrowser
} from "webxdriver"

const browser = resolveE2eBrowser() // WEBXDRIVER_BROWSER=chrome|firefox
const session = await launchExtensionSession({
  browser,
  extensionPath: "/absolute/path/to/unpacked-extension"
  // Prefer a project-local dir if /tmp quotas break Chrome prefs:
  // profileBaseDir: join(process.cwd(), ".output", "e2e-profiles"),
})

await openExtensionPage(session, "/popup.html")
// …assertions with session.driver…

await session.quit()
```

<a id="api-lifecycle"></a>

## API (lifecycle)

| Export | Role |
|--------|------|
| `launchExtensionSession(options)` | Chrome (CFT + `--load-extension`) / Firefox (`installAddon` + UUID) |
| `openExtensionPage(session, pathOrUrl)` | Open extension page (`/` path or absolute `chrome-extension://` / `moz-extension://`) |
| `reloadExtensionPage(session, pathOrUrl)` | Reload (Firefox re-opens via chrome-context) |
| `resolveExtensionPageUrl(session, pathOrUrl)` | Build URL without navigating |
| `resolveE2eBrowser(options?)` | `WEBXDRIVER_BROWSER` / explicit value |
| `chromeExtensionIdFromPath(path)` | Chromium unpacked ID |
| `resolveFirefoxExtensionUuid(profile, geckoId)` | Temporary addon UUID |
| `readGeckoId(extensionPath)` | `browser_specific_settings.gecko.id` |

<a id="options"></a>

### Options

```ts
type LaunchExtensionSessionOptions = {
  browser: "chrome" | "firefox"
  extensionPath: string
  profileBaseDir?: string
  chromeVersion?: string // or WEBXDRIVER_CHROME_VERSION
  headless?: boolean // default true
}
```

<a id="environment-variables"></a>

## Environment variables

| Variable | Role |
|----------|------|
| `WEBXDRIVER_BROWSER` | `chrome` \| `firefox` (consumed by `resolveE2eBrowser`) |
| `WEBXDRIVER_CHROME_VERSION` | Optional Chrome for Testing pin |

<a id="notes"></a>

## Notes

- **Chrome:** Branded Chrome 137+ dropped `--load-extension`. webXdriver pins **Chrome for Testing** via Selenium Manager (override with `chromeVersion` / `WEBXDRIVER_CHROME_VERSION`).
- **Firefox:** geckodriver runs with `--allow-system-access` so Marionette can open `moz-extension://` pages.
- **Profiles:** Pass `profileBaseDir` when `/tmp` quotas break Chrome prefs writes (common in CI/agent sandboxes).

<a id="development"></a>

## Development

```bash
pnpm install
pnpm run build
pnpm test
pnpm run typecheck
```

<a id="provenance"></a>

## Provenance

Generalized from the [BMXt](https://github.com/UNRsports/bmxt) extension E2E harness.
See [`EXTRACT.md`](./EXTRACT.md) and [`upstream/`](./upstream/) (reference only — not part of the package API).

<a id="license"></a>

## License

This project is licensed under [Apache License 2.0](./LICENSE).

---

<a id="japanese"></a>

# webXdriver（日本語）

> 英語版は上記を参照してください。[English の先頭へ](#introduction)

## 目次

- [ステータス](#status-ja)
- [はじめに](#introduction-ja)
- [インストール](#install-ja)
- [クイックスタート](#quick-start-ja)
- [API（ライフサイクル）](#api-lifecycle-ja)
  - [オプション](#options-ja)
- [環境変数](#environment-variables-ja)
- [注意点](#notes-ja)
- [開発](#development-ja)
- [出典](#provenance-ja)
- [ライセンス](#license-ja)

<a id="status-ja"></a>

## ステータス

- **対象:** ブラウザ**拡張機能のみ**（アンパック Chrome + Firefox）。一般サイト向け E2E フレームワークではありません。
- **成熟度:** `0.x` — `1.0.0` まではメジャー番号なしで API が変わり得ます。
- **現状のテスト:** unit（`pnpm test`）。最小 fixture / ブラウザ e2e は今後（ロードマップ③）。
- **想定消費者:** 当面は [BMXt](https://github.com/UNRsports/bmxt)（thin wrapper 切替は未実施）。

<a id="introduction-ja"></a>

## はじめに

**webXdriver** は、**アンパック**した Chrome / Firefox 拡張向けの headless **WebDriver** ハーネスです。

製品の E2E で毎回自前実装しがちな次のライフサイクルを扱います。

1. 未署名／アンパック拡張のロード
2. `extensionOrigin` の解決（`chrome-extension://…` または `moz-extension://…`）
3. 拡張ページを開く（`moz-extension://` は Firefox の chrome コンテキスト経由）

**ランナー非依存**です（Node の `node:test`、Vitest、Mocha など）。peer 依存は [`selenium-webdriver`](https://www.npmjs.com/package/selenium-webdriver) です。

> Selenium / WebDriver プロジェクトとは無関係・非提携です。

**名前について** — **Web** + e**X**tension + **WebDriver** のもじりです。

- **web** — ブラウザ自動化
- **X** — クロスブラウザ（Chrome + Firefox）と拡張向け
- **driver** — WebDriver セッションのライフサイクル

<a id="install-ja"></a>

## インストール

npm 公開後:

```bash
pnpm add -D webxdriver selenium-webdriver
```

GitHub から（npm `0.1.0` まで）:

```bash
pnpm add -D selenium-webdriver github:UNRsports/webxdriver
```

<a id="quick-start-ja"></a>

## クイックスタート

```ts
import {
  launchExtensionSession,
  openExtensionPage,
  resolveE2eBrowser
} from "webxdriver"

const browser = resolveE2eBrowser() // WEBXDRIVER_BROWSER=chrome|firefox
const session = await launchExtensionSession({
  browser,
  extensionPath: "/absolute/path/to/unpacked-extension"
  // /tmp のクォータで Chrome prefs が落ちる場合はプロジェクト配下を指定:
  // profileBaseDir: join(process.cwd(), ".output", "e2e-profiles"),
})

await openExtensionPage(session, "/popup.html")
// …session.driver でアサート…

await session.quit()
```

<a id="api-lifecycle-ja"></a>

## API（ライフサイクル）

| Export | 役割 |
|--------|------|
| `launchExtensionSession(options)` | Chrome（CFT + `--load-extension`）／Firefox（`installAddon` + UUID） |
| `openExtensionPage(session, pathOrUrl)` | 拡張ページを開く（`/` パス、または `chrome-extension://` / `moz-extension://` 絶対 URL） |
| `reloadExtensionPage(session, pathOrUrl)` | リロード（Firefox は chrome コンテキストで開き直し） |
| `resolveExtensionPageUrl(session, pathOrUrl)` | 遷移せず URL だけ組み立てる |
| `resolveE2eBrowser(options?)` | `WEBXDRIVER_BROWSER`／明示値 |
| `chromeExtensionIdFromPath(path)` | Chromium アンパック ID |
| `resolveFirefoxExtensionUuid(profile, geckoId)` | 一時アドオンの UUID |
| `readGeckoId(extensionPath)` | `browser_specific_settings.gecko.id` |

<a id="options-ja"></a>

### オプション

```ts
type LaunchExtensionSessionOptions = {
  browser: "chrome" | "firefox"
  extensionPath: string
  profileBaseDir?: string
  chromeVersion?: string // または WEBXDRIVER_CHROME_VERSION
  headless?: boolean // 既定 true
}
```

<a id="environment-variables-ja"></a>

## 環境変数

| 変数 | 役割 |
|------|------|
| `WEBXDRIVER_BROWSER` | `chrome` \| `firefox`（`resolveE2eBrowser` が参照） |
| `WEBXDRIVER_CHROME_VERSION` | 任意。Chrome for Testing の固定バージョン |

<a id="notes-ja"></a>

## 注意点

- **Chrome:** ブランド版 Chrome 137+ では `--load-extension` が使えません。webXdriver は Selenium Manager 経由で **Chrome for Testing** を固定します（`chromeVersion` / `WEBXDRIVER_CHROME_VERSION` で上書き可）。
- **Firefox:** geckodriver を `--allow-system-access` 付きで起動し、Marionette から `moz-extension://` を開けるようにします。
- **プロファイル:** `/tmp` のクォータで Chrome の prefs 書き込みが失敗する場合は `profileBaseDir` を指定してください（CI／エージェント環境でよくあります）。

<a id="development-ja"></a>

## 開発

```bash
pnpm install
pnpm run build
pnpm test
pnpm run typecheck
```

<a id="provenance-ja"></a>

## 出典

[BMXt](https://github.com/UNRsports/bmxt) 拡張の E2E ハーネスを汎用化したものです。
[`EXTRACT.md`](./EXTRACT.md) および [`upstream/`](./upstream/)（参照専用・パッケージ API 外）を参照してください。

<a id="license-ja"></a>

## ライセンス

本プロジェクトは [Apache License 2.0](./LICENSE) です。
