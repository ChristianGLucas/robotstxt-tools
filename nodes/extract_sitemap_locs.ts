import { ExtractSitemapLocsInput, ExtractSitemapLocsOutput, RobotsToolsError } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { checkEmpty, checkSize } from './lib/guard';
import { parseRoot, toUrlsetEntries, toIndexEntries, MAX_XML_BYTES } from './lib/sitemap';

function errorOutput(code: string, message: string): ExtractSitemapLocsOutput {
  const err = new RobotsToolsError();
  err.setCode(code);
  err.setMessage(message);
  const out = new ExtractSitemapLocsOutput();
  out.setOk(false);
  out.setError(err);
  return out;
}

/**
 * Extract just the URLs (<loc> values) from a sitemap document of either
 * kind — a urlset's page URLs, or a sitemap-index's child sitemap URLs —
 * without the lastmod/changefreq/priority detail
 * ParseSitemap/ParseSitemapIndex also return. Same XXE-rejection and
 * 50,000-entry cap.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function extractSitemapLocs(ax: AxiomContext, input: ExtractSitemapLocsInput): ExtractSitemapLocsOutput {
  const xml = input.getDoc()?.getXml() ?? '';

  const emptyErr = checkEmpty(xml, 'doc.xml');
  if (emptyErr) return errorOutput(emptyErr.code, emptyErr.message);

  const sizeErr = checkSize(xml, MAX_XML_BYTES, 'doc.xml');
  if (sizeErr) return errorOutput(sizeErr.code, sizeErr.message);

  const root = parseRoot(xml);
  if ('error' in root) return errorOutput(root.error.code, root.error.message);

  if (root.type === 'unknown') {
    return errorOutput(
      'WRONG_ROOT_ELEMENT',
      `Expected root element <urlset> or <sitemapindex>, found <${root.rootKey ?? 'unknown'}>.`
    );
  }

  const { entries, truncated } = root.type === 'urlset' ? toUrlsetEntries(root.data) : toIndexEntries(root.data);

  const out = new ExtractSitemapLocsOutput();
  out.setLocsList(entries.map((e) => e.loc));
  out.setDocType(root.type);
  out.setTruncated(truncated);
  out.setOk(true);
  return out;
}
