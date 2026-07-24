# robotstxt-tools

Deterministic parsing and RFC 9309 evaluation of web-crawling control files —
**robots.txt** and **sitemap.xml** / **sitemap-index.xml** — over
caller-supplied **text only**. This package never fetches anything over the
network; retrieving the documents is the caller's job, this package only
evaluates the text you already have.

Built for the [Axiom](https://axiomide.com) marketplace, handle
`christiangeorgelucas`.

## Use it from your agent or app

Every node in this package is a **live, auto-scaling API endpoint** on the
[Axiom](https://axiomide.com) marketplace — call it from an AI agent or your own
code, with nothing to self-host.

**📦 See it on the marketplace:**
https://dev.axiomide.com/marketplace/christiangeorgelucas/robotstxt-tools@0.1.1

**Hook it up to an AI agent (MCP).** Add Axiom's hosted MCP server to any MCP
client and every node becomes a typed tool your agent can call — search the
catalog, inspect a schema, and invoke it directly.

```bash
# Claude Code
claude mcp add --transport http axiom https://api.axiomide.com/mcp \
  --header "Authorization: Bearer $AXIOM_API_KEY"
```

Claude Desktop, Cursor, or any config-based client:

```json
{
  "mcpServers": {
    "axiom": {
      "type": "http",
      "url": "https://api.axiomide.com/mcp",
      "headers": { "Authorization": "Bearer YOUR_AXIOM_API_KEY" }
    }
  }
}
```

**Call it from the CLI.**

```bash
axiom invoke christiangeorgelucas/robotstxt-tools/ParseRobotsTxt --input '{ ... }'
```

**Call it over HTTP.**

```bash
curl -X POST https://api.axiomide.com/invocations/v1/nodes/christiangeorgelucas/robotstxt-tools/0.1.1/ParseRobotsTxt \
  -H "Authorization: Bearer $AXIOM_API_KEY" \
  -H 'Content-Type: application/json' \
  -d '{ ... }'
```

> Input/output schema for each node is on the marketplace page above, or via
> `axiom inspect node christiangeorgelucas/robotstxt-tools/ParseRobotsTxt`.

### Get started free

Install the CLI:

```bash
# macOS / Linux — Homebrew
brew install axiomide/tap/axiom

# macOS / Linux — install script
curl -fsSL https://raw.githubusercontent.com/AxiomIDE/axiom-releases/main/install.sh | sh
```

**Windows:** download the `windows/amd64` `.zip` from the
[releases page](https://github.com/AxiomIDE/axiom-releases/releases), unzip it,
and put `axiom.exe` on your `PATH`.

Then `axiom version` to verify, `axiom login` (GitHub or Google) to authenticate,
and create an API key under **Console → API Keys**. Docs and sign-up at
**[axiomide.com](https://axiomide.com)**.

## What it wraps

- **[robots-parser](https://github.com/samclarke/robots-parser)** (MIT, Sam
  Clarke) — owns the RFC 9309 hard part: wildcard (`*`) and end-anchor (`$`)
  path matching with longest-match precedence (an Allow/Disallow tie resolves
  to Allow).
- **[fast-xml-parser](https://github.com/NaturalIntelligence/fast-xml-parser)**
  (MIT, NaturalIntelligence) — parses sitemap XML. External entities and DTDs
  are rejected outright (no XXE) rather than resolved.

## Nodes

**robots.txt**

| Node | What it does |
|---|---|
| `ParseRobotsTxt` | Full structured parse: every rule group (user-agents, Allow/Disallow rules with line numbers, Crawl-delay), plus Sitemap: URLs and the Host: directive. |
| `IsAllowed` | Is a URL/path allowed for a user-agent? RFC 9309 longest-match precedence. |
| `IsDisallowed` | The disallowed-ness view of the same decision (same output shape as `IsAllowed`). |
| `GetCrawlDelay` | The Crawl-delay declared for a user-agent, with `*` wildcard fallback. |
| `ListUserAgents` | Every user-agent token mentioned in the document. |
| `ExtractRobotsSitemapUrls` | Every `Sitemap:` URL declared in the document. |
| `ListDisallowedPaths` | Every Disallow path in the rule group that applies to a user-agent. |
| `GetEffectiveRuleGroup` | Which rule group governs a user-agent (named match, or `*` fallback). |
| `GetPreferredHost` | The `Host:` directive value, if any. |
| `GetMatchingLine` | The source line number of the rule that governs a URL/user-agent pair — for auditing a decision. |

**sitemap.xml / sitemap-index.xml**

| Node | What it does |
|---|---|
| `ParseSitemap` | Parse a `<urlset>` into its URL entries: loc, lastmod, changefreq, priority. |
| `ParseSitemapIndex` | Parse a `<sitemapindex>` into its child sitemap entries: loc, lastmod. |
| `DetectSitemapType` | Classify a document as `urlset`, `sitemapindex`, or `unknown`, by root element. |
| `CountSitemapUrls` | Count the entries in a sitemap document of either kind. |
| `ExtractSitemapLocs` | Just the `<loc>` values, from either document kind. |

## Notes

- Malformed input always returns a structured `{code, message}` error —
  never a crash.
- Every node is a pure, stateless, single-input-to-single-output transform:
  no network calls, no wall-clock, no randomness.
- The platform owns request/response size and resource limits; this package
  contains no size or resource caps of its own.

## License

MIT — Copyright (c) 2026 Christian George Lucas.
