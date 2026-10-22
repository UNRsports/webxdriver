# webXdriver seed extract (from BMXt)

EN: Provenance notes for the BMXt → webXdriver extract.
The supported package API is under `src/`. Files under `upstream/` are historical only.

JA: BMXt → webXdriver 抽出の出典メモ。
サポート対象のパッケージ API は `src/`。`upstream/` は歴史的参照のみ。

## Provenance

| Field | Value |
|-------|-------|
| Source repo | [UNRsports/bmxt](https://github.com/UNRsports/bmxt) |
| Source commit | `1fc62059fa32d140d7f760395c6de8820b0e84d5` |
| Extract stamp (UTC) | `20261022T044443Z` |
| License | Apache-2.0 (same as BMXt) |

## Layout

| Path | Role |
|------|------|
| `src/` | Public API (`launchExtensionSession`, `openExtensionPage`, …) |
| `tests/unit/` | Unit tests (run with `pnpm test`) |
| `upstream/` | Provenance only — see [`upstream/README.md`](./upstream/README.md) |
| `EXTRACT.md` | This file |
| `MANIFEST.sha256` | SHA-256 of files under `upstream/` (+ this tree’s tracked provenance files as listed) |

## Not in the public API (remain in BMXt)

- `BMXT_E2E_*` / host `.output/{chrome,firefox}-mv3` path helpers
- `launchBmxtSession` / `openBmxtPage` / tutorial dismiss
- Prompt / picker / mirror / `.bmxt-*` selectors
- `seedHttpsTab`

The original mixed BMXt `harness.ts` (lifecycle + product UI) is **not** shipped under `upstream/`.

## Env (webXdriver)

| Variable | Role |
|----------|------|
| `WEBXDRIVER_BROWSER` | `chrome` \| `firefox` (via `resolveE2eBrowser`) |
| `WEBXDRIVER_CHROME_VERSION` | Chrome for Testing pin (optional) |

## Roadmap

① extract done → ② API generalization done → ③ fixture e2e (pending) → ④ 0.1.0 → ⑤ BMXt thin wrapper → ⑥ BMXt verify
