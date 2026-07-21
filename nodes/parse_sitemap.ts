import { ParseSitemapInput, ParseSitemapOutput, SitemapUrlEntry, RobotsToolsError } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { checkEmpty, checkSize } from './lib/guard';
import { parseRoot, toUrlsetEntries, MAX_XML_BYTES } from './lib/sitemap';

function errorOutput(code: string, message: string): ParseSitemapOutput {
  const err = new RobotsToolsError();
  err.setCode(code);
  err.setMessage(message);
  const out = new ParseSitemapOutput();
  out.setOk(false);
  out.setError(err);
  return out;
}

/**
 * Parse a sitemap.xml <urlset> document into its list of URL entries: loc,
 * lastmod, changefreq, and priority for each <url>. External XML entities
 * and DTDs are rejected outright (no XXE); parsing stops and
 * `truncated=true` is reported past the sitemaps.org 50,000-URL-per-file
 * limit. A document that is not a urlset (e.g. a sitemap-index) returns a
 * structured error naming the actual root element.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function parseSitemap(ax: AxiomContext, input: ParseSitemapInput): ParseSitemapOutput {
  const xml = input.getDoc()?.getXml() ?? '';

  const emptyErr = checkEmpty(xml, 'doc.xml');
  if (emptyErr) return errorOutput(emptyErr.code, emptyErr.message);

  const sizeErr = checkSize(xml, MAX_XML_BYTES, 'doc.xml');
  if (sizeErr) return errorOutput(sizeErr.code, sizeErr.message);

  const root = parseRoot(xml);
  if ('error' in root) return errorOutput(root.error.code, root.error.message);

  if (root.type !== 'urlset') {
    return errorOutput(
      'WRONG_ROOT_ELEMENT',
      `Expected root element <urlset>, found <${root.rootKey ?? 'unknown'}>.`
    );
  }

  const { entries, truncated } = toUrlsetEntries(root.data);

  const out = new ParseSitemapOutput();
  out.setUrlsList(
    entries.map((e) => {
      const entry = new SitemapUrlEntry();
      entry.setLoc(e.loc);
      entry.setLastmod(e.lastmod);
      entry.setChangefreq(e.changefreq);
      if (e.priority !== null) {
        entry.setPriority(e.priority);
        entry.setHasPriority(true);
      }
      return entry;
    })
  );
  out.setCount(entries.length);
  out.setTruncated(truncated);
  out.setOk(true);
  return out;
}
