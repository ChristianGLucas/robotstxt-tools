# robotstxt-tools

Deterministic parsing and RFC 9309 evaluation of web-crawling control files —
**robots.txt** and **sitemap.xml** / **sitemap-index.xml** — over
caller-supplied **text only**. This package never fetches anything over the
network; retrieving the documents is the caller's job, this package only
evaluates the text you already have.

Built for the [Axiom](https://axiomide.com) marketplace, handle
`christiangeorgelucas`.

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
