# webXdriver seed extract (from BMXt)

EN: Read-only snapshot of BMXt WebDriver lifecycle sources for forking into an
independent **webXdriver** repository. No API generalization applied yet (step ②).

JA: 独立リポジトリ **webXdriver** 用に BMXt から取り出した WebDriver ライフサイクル
ソースの読み取り専用スナップショット。API 汎用化（手順②）は未適用。

## Provenance

| Field | Value |
|-------|-------|
| Source repo | BMXt (`bmxt_demo`) |
| Source path | `/home/jun/dev/bmxt` |
| Git commit | `1fc62059fa32d140d7f760395c6de8820b0e84d5` |
| Extract stamp (UTC) | `20261022T044443Z` |
| License | Apache-2.0 (copy of BMXt `LICENSE`) |

## Included files

| Path in archive | Role for webXdriver |
|-----------------|---------------------|
| `upstream/tests/e2e/chrome-extension-id.ts` | **Core** — Chrome unpacked ID |
| `upstream/tests/e2e/resolve-firefox-extension-uuid.ts` | **Core** — Firefox moz-extension UUID |
| `upstream/tests/e2e/harness.ts` | **Mixed** — full upstream snapshot; split in step ② |
| `upstream/tests/unit/e2e/chrome-extension-id.test.ts` | Unit for core |
| `upstream/tests/unit/e2e/resolve-firefox-extension-uuid.test.ts` | Unit for core |
| `LICENSE` | Apache-2.0 |
| `MANIFEST.sha256` | Per-file SHA-256 of staged contents |

## harness.ts boundary (for step ②)

**Keep / generalize into webXdriver**

- Types: `E2eBrowser`, session shape (`driver`, `extensionOrigin`, `userDataDir`, `quit`)
- `readGeckoId`
- Chrome launch (CFT pin, `--load-extension`, profile dir)
- Firefox launch (`installAddon`, `--allow-system-access`, UUID resolve, retry)
- `openFirefoxExtensionPage` (chrome-context / `openTrustedLinkIn`)
- Navigate / reload extension page (without `.bmxt-*` waits)

**Leave in BMXt (do not publish as webXdriver API)**

- `resolveE2eBrowser` / `BMXT_E2E_*` / `.output/{chrome,firefox}-mv3`
- `launchBmxtSession` / `openBmxtPage` / tutorial dismiss
- Prompt / picker / mirror / `runPromptLine` / `.bmxt-*` selectors
- `seedHttpsTab` (optional later; BMXt-oriented today)

## Intentionally excluded

- `tests/e2e/*.test.ts` (BMXt product specs)
- `tests/e2e/command-matrix.ts`
- `tests/e2e/helpers/**`

## Integrity

1. Verify staged files: `sha256sum -c MANIFEST.sha256` (from this directory).
2. Verify the tarball: `sha256sum -c webXdriver-seed-from-bmxt-1fc6205-20261022T044443Z.tar.gz.sha256`.

## Next steps

① done (this archive) → ② API 汎用化 → ③ unit + fixture e2e → ④ 0.1.0 → ⑤ BMXt thin wrapper → ⑥ verify
