import { CountSitemapUrlsInput, CountSitemapUrlsOutput, RobotsToolsError } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { checkEmpty, checkSize } from './lib/guard';
import { parseRoot, toUrlsetEntries, toIndexEntries, MAX_XML_BYTES } from './lib/sitemap';

function errorOutput(code: string, message: string): CountSitemapUrlsOutput {
  const err = new RobotsToolsError();
  err.setCode(code);
  err.setMessage(message);
  const out = new CountSitemapUrlsOutput();
  out.setOk(false);
  out.setError(err);
  return out;
}

/**
 * Count the entries in a sitemap document — <url> children for a urlset,
 * <sitemap> children for a sitemap-index — without materializing the full
 * entry list. Reports which kind of document it counted;
 * `truncated=true` past the 50,000-entry cap (the reported count is
 * capped, not the true total).
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function countSitemapUrls(ax: AxiomContext, input: CountSitemapUrlsInput): CountSitemapUrlsOutput {
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

  const out = new CountSitemapUrlsOutput();
  out.setCount(entries.length);
  out.setDocType(root.type);
  out.setTruncated(truncated);
  out.setOk(true);
  return out;
}
