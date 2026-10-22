import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { resolveE2eBrowser } from "../../src/browser.ts"

describe("resolveE2eBrowser", () => {
  it("maps aliases", () => {
    assert.equal(resolveE2eBrowser({ value: "chrome" }), "chrome")
    assert.equal(resolveE2eBrowser({ value: "chromium" }), "chrome")
    assert.equal(resolveE2eBrowser({ value: "firefox" }), "firefox")
    assert.equal(resolveE2eBrowser({ value: "gecko" }), "firefox")
  })

  it("uses defaultBrowser when unset", () => {
    const previous = process.env.WEBXDRIVER_BROWSER
    delete process.env.WEBXDRIVER_BROWSER
    try {
      assert.equal(resolveE2eBrowser({ defaultBrowser: "firefox" }), "firefox")
    } finally {
      if (previous === undefined) {
        delete process.env.WEBXDRIVER_BROWSER
      } else {
        process.env.WEBXDRIVER_BROWSER = previous
      }
    }
  })

  it("rejects unknown values", () => {
    assert.throws(() => resolveE2eBrowser({ value: "safari" }), /Unsupported browser/)
  })
})
