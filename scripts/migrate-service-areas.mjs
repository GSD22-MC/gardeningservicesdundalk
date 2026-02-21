/**
 * Migrate WordPress service-area combination pages
 * (e.g., grass-cutting-lawn-care-annagassan, decking-services-dundalk)
 * into Astro content collection files.
 */

import { createReadStream, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { parse } from 'csv-parse';
import TurndownService from 'turndown';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, '..');
const CONTENT_DIR = join(PROJECT_ROOT, 'src', 'content', 'service-areas');
const CSV_PATH = join(PROJECT_ROOT, '..', 'wp_posts.csv');

const turndown = new TurndownService({ headingStyle: 'atx', bulletListMarker: '-' });

function stripWpBlocks(html) {
  if (!html) return '';
  return html
    .replace(/<!-- \/?wp:\S+[\s\S]*?-->/g, '')
    .replace(/\[\/?[a-z_]+[^\]]*\]/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function htmlToMarkdown(html) {
  if (!html) return '';
  const cleaned = stripWpBlocks(html);
  try {
    return turndown.turndown(cleaned).trim();
  } catch (e) {
    return cleaned.replace(/<[^>]+>/g, '').trim();
  }
}

// Service-area slug patterns
const SERVICE_PATTERNS = [
  'grass-cutting-lawn-care',
  'decking-services',
  'fencing-installation',
  'garden-clearance',
  'garden-landscaping',
  'garden-maintenance',
  'hedge-trimming-services',
  'hedge-trimming-cutting',
  'patio-paving-installation',
];

async function main() {
  console.log('🌿 Migrating service-area combination pages...\n');

  mkdirSync(CONTENT_DIR, { recursive: true });

  const records = [];

  const parser = createReadStream(CSV_PATH).pipe(
    parse({
      columns: true,
      relax_column_count: true,
      relax_quotes: true,
      quote: '"',
      escape: '"',
      trim: true,
    })
  );

  for await (const record of parser) {
    if (record.post_status !== 'publish' || record.post_type !== 'page') continue;

    const slug = record.post_name || '';
    const isServiceArea = SERVICE_PATTERNS.some(p => slug.startsWith(p));

    // Also include the base service pages (no area suffix)
    const isBaseService = [
      'grass-cutting-lawn-care',
      'fencing',
      'garden-clearance',
      'garden-maintenance',
      'hedge-trimming-cutting',
      'paving',
      'outdoor-rooms-garden-sheds-dundalk',
    ].includes(slug);

    if (isServiceArea || isBaseService) {
      records.push(record);
    }
  }

  console.log(`Found ${records.length} service-area pages\n`);

  let count = 0;
  for (const page of records) {
    const slug = page.post_name;
    const title = (page.post_title || 'Untitled').replace(/"/g, '\\"');
    const content = htmlToMarkdown(page.post_content);

    const frontmatter = [
      '---',
      `title: "${title}"`,
      `slug: "${slug}"`,
      `date: "${page.post_date}"`,
      '---',
    ].join('\n');

    writeFileSync(join(CONTENT_DIR, `${slug}.md`), frontmatter + '\n\n' + content, 'utf-8');
    count++;
  }

  console.log(`✅ Wrote ${count} service-area pages to src/content/service-areas/`);
}

main().catch(err => {
  console.error('❌ Failed:', err.message);
  process.exit(1);
});
