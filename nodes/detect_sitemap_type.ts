import { DetectSitemapTypeInput, DetectSitemapTypeOutput, RobotsToolsError } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { checkEmpty } from './lib/guard';
import { parseRoot } from './lib/sitemap';

function errorOutput(code: string, message: string): DetectSitemapTypeOutput {
  const err = new RobotsToolsError();
  err.setCode(code);
  err.setMessage(message);
  const out = new DetectSitemapTypeOutput();
  out.setOk(false);
  out.setError(err);
  return out;
}

/**
 * Classify an XML document as a sitemap urlset, a sitemap-index, or neither
 * ("unknown"), by its root element — without parsing its entries. The
 * cheap dispatch check before calling ParseSitemap or ParseSitemapIndex.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function detectSitemapType(ax: AxiomContext, input: DetectSitemapTypeInput): DetectSitemapTypeOutput {
  const xml = input.getDoc()?.getXml() ?? '';

  const emptyErr = checkEmpty(xml, 'doc.xml');
  if (emptyErr) return errorOutput(emptyErr.code, emptyErr.message);

  const root = parseRoot(xml);
  if ('error' in root) return errorOutput(root.error.code, root.error.message);

  const out = new DetectSitemapTypeOutput();
  out.setDocType(root.type);
  out.setOk(true);
  return out;
}
