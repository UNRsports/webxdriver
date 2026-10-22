# webXdriver seed extract (from BMXt)

EN: Snapshot of BMXt WebDriver lifecycle sources used to create **webXdriver**.
Step ② (API generalization) lives under `src/`; `upstream/` remains read-only provenance.

JA: **webXdriver** 作成に使った BMXt WebDriver ライフサイクルのスナップショット。
手順②（API 汎用化）は `src/`。`upstream/` は読み取り専用の出典。

## Provenance

| Field | Value |
|-------|-------|
| Source repo | BMXt (`bmxt_demo`) |
| Source path | `/home/jun/dev/bmxt` |
| Git commit | `1fc62059fa32d140d7f760395c6de8820b0e84d5` |
| Extract stamp (UTC) | `20261022T044443Z` |
| License | Apache-2.0 (copy of BMXt `LICENSE`) |

## Layout after step ②

| Path | Role |
|------|------|
| `src/` | Generalized public API (`launchExtensionSession`, `openExtensionPage`, …) |
| `tests/unit/` | Unit tests for core helpers |
| `upstream/` | Unmodified BMXt extract (do not import from package code) |
| `EXTRACT.md` | This file |
| `MANIFEST.sha256` | Checksums of the original staged seed files under `upstream/` + `LICENSE` |

## Removed from the public API (stay in BMXt)

- `BMXT_E2E_*` / `.output/{chrome,firefox}-mv3` path helpers
- `launchBmxtSession` / `openBmxtPage` / tutorial dismiss
- Prompt / picker / mirror / `.bmxt-*` selectors
- `seedHttpsTab`

## Env (webXdriver)

| Variable | Role |
|----------|------|
| `WEBXDRIVER_BROWSER` | `chrome` \| `firefox` (via `resolveE2eBrowser`) |
| `WEBXDRIVER_CHROME_VERSION` | Chrome for Testing pin (optional) |

## Next steps

① done → **② done** → ③ unit + fixture e2e → ④ 0.1.0 → ⑤ BMXt thin wrapper → ⑥ verify
