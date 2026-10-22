import assert from "node:assert/strict"
import { mkdtempSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { describe, it } from "node:test"
import { readGeckoId } from "../../src/gecko-id.ts"

describe("readGeckoId", () => {
  it("reads browser_specific_settings.gecko.id", () => {
    const dir = mkdtempSync(join(tmpdir(), "webxdriver-gecko-"))
    writeFileSync(
      join(dir, "manifest.json"),
      JSON.stringify({
        browser_specific_settings: { gecko: { id: "demo@example.com" } }
      }),
      "utf8"
    )
    assert.equal(readGeckoId(dir), "demo@example.com")
  })

  it("throws when gecko.id is missing", () => {
    const dir = mkdtempSync(join(tmpdir(), "webxdriver-gecko-"))
    writeFileSync(join(dir, "manifest.json"), "{}", "utf8")
    assert.throws(() => readGeckoId(dir), /Missing browser_specific_settings.gecko.id/)
  })
})
