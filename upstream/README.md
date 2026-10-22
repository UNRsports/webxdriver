# upstream/ (provenance only)

EN: Historical extract from [BMXt](https://github.com/UNRsports/bmxt) used to bootstrap webXdriver.
**Do not import these files from application code.** The supported API is under `../src/`.

JA: [BMXt](https://github.com/UNRsports/bmxt) から取り出した出典スナップショット。
**アプリケーションコードから import しないこと。** サポート対象の API は `../src/`。

| Kept file | Note |
|-----------|------|
| `tests/e2e/chrome-extension-id.ts` | Generic Chromium unpacked ID helper |
| `tests/e2e/resolve-firefox-extension-uuid.ts` | Generic Firefox UUID resolver |
| `tests/unit/e2e/*.test.ts` | Original unit tests (historical) |

The original BMXt `harness.ts` mixed lifecycle with product UI (prompt / tutorial / `.bmxt-*`).
That mixed file is **not** kept here. Lifecycle logic lives in `src/`; BMXt-specific helpers stay in BMXt.

| Field | Value |
|-------|-------|
| Source repo | [UNRsports/bmxt](https://github.com/UNRsports/bmxt) |
| Source commit | `1fc62059fa32d140d7f760395c6de8820b0e84d5` |
| Extract stamp (UTC) | `20261022T044443Z` |
