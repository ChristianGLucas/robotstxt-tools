// Shared sitemap.xml / sitemap-index.xml parsing helpers, built on
// fast-xml-parser (MIT, NaturalIntelligence). fast-xml-parser owns the hard
// part (real XML tokenizing/parsing); this file only shapes its generic
// object output into the sitemaps.org vocabulary and enforces the safety
// bounds every node needs (size cap, external-entity rejection, the
// sitemaps.org 50,000-entry-per-file limit).
//
// Security note: fast-xml-parser does not resolve external entities or DTDs
// at all — it throws ("External entities are not supported") rather than
// silently inlining file/network content, so this wrapper is XXE-safe by
// construction; we surface that throw as a structured error instead of
// letting it crash the node.

import { XMLParser, XMLValidator } from 'fast-xml-parser';
import { GuardError } from './guard';

export const MAX_XML_BYTES = 3 * 1024 * 1024; // 3 MiB
export const MAX_ENTRIES = 50000; // sitemaps.org protocol limit per file

export type SitemapType = 'urlset' | 'sitemapindex' | 'unknown';

export interface UrlsetEntry {
  loc: string;
  lastmod: string;
  changefreq: string;
  priority: number | null;
}

export interface IndexEntry {
  loc: string;
  lastmod: string;
}

interface ParsedRoot {
  type: SitemapType;
  rootKey: string | null;
  // Raw fast-xml-parser object for the root element's children (never the
  // wrapping root key itself).
  data: Record<string, unknown>;
}

function buildParser(): XMLParser {
  return new XMLParser({
    ignoreAttributes: true,
    // Keep every value a raw string — we convert types (priority -> number)
    // explicitly per-field below, rather than letting the parser guess and
    // silently coerce a loc/lastmod/changefreq value that merely *looks*
    // numeric or boolean.
    parseTagValue: false,
    trimValues: true,
    isArray: (_name: string, jpath: string) => jpath === 'urlset.url' || jpath === 'sitemapindex.sitemap',
  });
}

/**
 * Validate, then parse, an XML document and classify its root element.
 * Returns a structured error for empty input, malformed XML, or an XML
 * construct fast-xml-parser refuses to process (e.g. external entities).
 */
export function parseRoot(xml: string): ParsedRoot | { error: GuardError } {
  const validation = XMLValidator.validate(xml, { allowBooleanAttributes: true });
  if (validation !== true) {
    return {
      error: {
        code: 'PARSE_ERROR',
        message: `Malformed XML: ${validation.err.msg} (line ${validation.err.line ?? '?'}).`,
      },
    };
  }

  let parsed: Record<string, unknown>;
  try {
    parsed = buildParser().parse(xml);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    return { error: { code: 'XML_UNSAFE_ENTITY', message } };
  }

  const rootKeys = Object.keys(parsed).filter((k) => k !== '?xml' && !k.startsWith('#'));
  if (rootKeys.length !== 1) {
    return { type: 'unknown', rootKey: rootKeys[0] ?? null, data: {} };
  }

  const rootKey = rootKeys[0];
  const type: SitemapType = rootKey === 'urlset' ? 'urlset' : rootKey === 'sitemapindex' ? 'sitemapindex' : 'unknown';
  const data = (parsed[rootKey] ?? {}) as Record<string, unknown>;
  return { type, rootKey, data };
}

function toStr(v: unknown): string {
  if (v === undefined || v === null) return '';
  return typeof v === 'string' ? v : String(v);
}

export function toUrlsetEntries(data: Record<string, unknown>): { entries: UrlsetEntry[]; truncated: boolean; totalCount: number } {
  const raw = data.url;
  const list: unknown[] = Array.isArray(raw) ? raw : raw !== undefined ? [raw] : [];
  const truncated = list.length > MAX_ENTRIES;
  const capped = truncated ? list.slice(0, MAX_ENTRIES) : list;

  const entries: UrlsetEntry[] = capped.map((u) => {
    const obj = typeof u === 'object' && u !== null ? (u as Record<string, unknown>) : {};
    let priority: number | null = null;
    const rawPriority = obj.priority;
    if (rawPriority !== undefined && rawPriority !== '') {
      const n = Number(rawPriority);
      if (!Number.isNaN(n)) priority = n;
    }
    return {
      loc: toStr(obj.loc),
      lastmod: toStr(obj.lastmod),
      changefreq: toStr(obj.changefreq),
      priority,
    };
  });

  return { entries, truncated, totalCount: list.length };
}

export function toIndexEntries(data: Record<string, unknown>): { entries: IndexEntry[]; truncated: boolean; totalCount: number } {
  const raw = data.sitemap;
  const list: unknown[] = Array.isArray(raw) ? raw : raw !== undefined ? [raw] : [];
  const truncated = list.length > MAX_ENTRIES;
  const capped = truncated ? list.slice(0, MAX_ENTRIES) : list;

  const entries: IndexEntry[] = capped.map((s) => {
    const obj = typeof s === 'object' && s !== null ? (s as Record<string, unknown>) : {};
    return { loc: toStr(obj.loc), lastmod: toStr(obj.lastmod) };
  });

  return { entries, truncated, totalCount: list.length };
}
