// Hand-verified RFC 9309 / Google robots.txt-spec oracle cases, independent
// of this package's implementation — drawn from the published examples in
// RFC 9309 §2.2.2 ("Longest Match") and Google's "How Google interprets the
// robots.txt specification" (order-of-precedence examples). Used by both
// is_allowed_test.ts and is_disallowed_test.ts so the two nodes are checked
// against the identical, independently-sourced truth table.

export interface OracleCase {
  name: string;
  robotsTxt: string;
  path: string;
  userAgent: string;
  expectedAllowed: boolean;
}

export const ORACLE_CASES: OracleCase[] = [
  {
    // RFC 9309 / Google spec: "allow: /p" vs "disallow: /" — the longer
    // matching pattern (the Allow) wins, so /page is allowed.
    name: 'longer Allow pattern beats shorter Disallow prefix',
    robotsTxt: 'User-agent: *\nAllow: /p\nDisallow: /',
    path: '/page',
    userAgent: 'AnyBot',
    expectedAllowed: true,
  },
  {
    // Same document, a path the Allow does NOT cover but Disallow "/" does.
    name: 'Disallow "/" still blocks a path the Allow does not cover',
    robotsTxt: 'User-agent: *\nAllow: /p\nDisallow: /',
    path: '/other',
    userAgent: 'AnyBot',
    expectedAllowed: false,
  },
  {
    // Google spec: equal-length Allow "/folder" and Disallow "/folder" —
    // ties resolve to Allow (least restrictive).
    name: 'equal-length Allow/Disallow tie resolves to Allow',
    robotsTxt: 'User-agent: *\nAllow: /folder\nDisallow: /folder',
    path: '/folder/page.html',
    userAgent: 'AnyBot',
    expectedAllowed: true,
  },
  {
    // Google spec: "allow: /page" vs "disallow: /*.htm" — the wildcard
    // pattern is longer (6 chars vs 5) and matches "/page.htm", so it wins.
    name: 'longer wildcard Disallow beats shorter literal Allow',
    robotsTxt: 'User-agent: *\nAllow: /page\nDisallow: /*.htm',
    path: '/page.htm',
    userAgent: 'AnyBot',
    expectedAllowed: false,
  },
  {
    // Same document: a path the wildcard Disallow does not match at all.
    name: 'Allow applies when the wildcard Disallow does not match',
    robotsTxt: 'User-agent: *\nAllow: /page\nDisallow: /*.htm',
    path: '/page',
    userAgent: 'AnyBot',
    expectedAllowed: true,
  },
  {
    // "$" end-anchor: "Disallow: /*.pdf$" blocks exact .pdf URLs but not
    // ones that merely start with a .pdf-looking prefix.
    name: '"$" end-anchor blocks an exact suffix match',
    robotsTxt: 'User-agent: *\nDisallow: /*.pdf$',
    path: '/file.pdf',
    userAgent: 'AnyBot',
    expectedAllowed: false,
  },
  {
    name: '"$" end-anchor does not match a path that continues past it',
    robotsTxt: 'User-agent: *\nDisallow: /*.pdf$',
    path: '/file.pdf.html',
    userAgent: 'AnyBot',
    expectedAllowed: true,
  },
  {
    // RFC 9309: an empty Disallow value means "disallow nothing".
    name: 'an empty Disallow: value disallows nothing',
    robotsTxt: 'User-agent: *\nDisallow:',
    path: '/anything/at/all',
    userAgent: 'AnyBot',
    expectedAllowed: true,
  },
  {
    // No matching group or rule at all: RFC 9309 default-allow.
    name: 'no matching rule at all defaults to allowed',
    robotsTxt: 'User-agent: SomeOtherBot\nDisallow: /secret/',
    path: '/secret/x',
    userAgent: 'AnyBot',
    expectedAllowed: true,
  },
  {
    // A specific named group takes precedence over the wildcard group for
    // its own user-agent.
    name: 'a specific named group overrides the wildcard group',
    robotsTxt: 'User-agent: *\nDisallow: /\nUser-agent: GoodBot\nDisallow:',
    path: '/anything',
    userAgent: 'GoodBot',
    expectedAllowed: true,
  },
];
