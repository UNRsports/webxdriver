import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { resolveExtensionPageUrl } from "../../src/open-page.ts"
import type { ExtensionSession } from "../../src/types.ts"

function fakeSession(origin: string): ExtensionSession {
  return {
    browser: "chrome",
    driver: null as unknown as ExtensionSession["driver"],
    extensionPath: "/tmp/ext",
    extensionOrigin: origin,
    userDataDir: null,
    quit: async () => undefined
  }
}

describe("resolveExtensionPageUrl", () => {
  it("joins origin and path", () => {
    const session = fakeSession("chrome-extension://abcdefghijklmnopabcdefghijklmnop")
    assert.equal(
      resolveExtensionPageUrl(session, "/popup.html"),
      "chrome-extension://abcdefghijklmnopabcdefghijklmnop/popup.html"
    )
    assert.equal(
      resolveExtensionPageUrl(session, "popup.html"),
      "chrome-extension://abcdefghijklmnopabcdefghijklmnop/popup.html"
    )
  })

  it("passes through extension absolute URLs", () => {
    const session = fakeSession("moz-extension://11111111-2222-3333-4444-555555555555")
    const url = "moz-extension://11111111-2222-3333-4444-555555555555/index.html"
    assert.equal(resolveExtensionPageUrl(session, url), url)
  })

  it("rejects http(s) URLs", () => {
    const session = fakeSession("chrome-extension://abcdefghijklmnopabcdefghijklmnop")
    assert.throws(() => resolveExtensionPageUrl(session, "https://example.com/"), /Expected an extension page/)
  })
})
