import { ParseSitemapIndexInput, ParseSitemapIndexOutput, SitemapIndexEntry, RobotsToolsError } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { checkEmpty, checkSize } from './lib/guard';
import { parseRoot, toIndexEntries, MAX_XML_BYTES } from './lib/sitemap';

function errorOutput(code: string, message: string): ParseSitemapIndexOutput {
  const err = new RobotsToolsError();
  err.setCode(code);
  err.setMessage(message);
  const out = new ParseSitemapIndexOutput();
  out.setOk(false);
  out.setError(err);
  return out;
}

/**
 * Parse a sitemap-index XML document into its list of child sitemap
 * entries: loc and lastmod for each <sitemap>. Same XXE-rejection and
 * 50,000-entry cap as ParseSitemap. A document that is not a sitemapindex
 * returns a structured error naming the actual root element.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function parseSitemapIndex(ax: AxiomContext, input: ParseSitemapIndexInput): ParseSitemapIndexOutput {
  const xml = input.getDoc()?.getXml() ?? '';

  const emptyErr = checkEmpty(xml, 'doc.xml');
  if (emptyErr) return errorOutput(emptyErr.code, emptyErr.message);

  const sizeErr = checkSize(xml, MAX_XML_BYTES, 'doc.xml');
  if (sizeErr) return errorOutput(sizeErr.code, sizeErr.message);

  const root = parseRoot(xml);
  if ('error' in root) return errorOutput(root.error.code, root.error.message);

  if (root.type !== 'sitemapindex') {
    return errorOutput(
      'WRONG_ROOT_ELEMENT',
      `Expected root element <sitemapindex>, found <${root.rootKey ?? 'unknown'}>.`
    );
  }

  const { entries, truncated } = toIndexEntries(root.data);

  const out = new ParseSitemapIndexOutput();
  out.setSitemapsList(
    entries.map((e) => {
      const entry = new SitemapIndexEntry();
      entry.setLoc(e.loc);
      entry.setLastmod(e.lastmod);
      return entry;
    })
  );
  out.setCount(entries.length);
  out.setTruncated(truncated);
  out.setOk(true);
  return out;
}
