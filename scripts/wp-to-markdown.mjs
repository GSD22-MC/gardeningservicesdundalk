/**
 * WordPress CSV to Astro Markdown Migration Script
 *
 * Reads wp_posts.csv export from phpMyAdmin and generates:
 * - src/content/blog/*.md (published posts)
 * - src/content/reviews/*.yaml (site-review post type)
 * - Logs pages for manual review
 *
 * Usage: node scripts/wp-to-markdown.mjs
 */

import { createReadStream, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { parse } from 'csv-parse';
import TurndownService from 'turndown';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, '..');
const CONTENT_DIR = join(PROJECT_ROOT, 'src', 'content');
const CSV_PATH = join(PROJECT_ROOT, '..', 'wp_posts.csv');

// Initialize Turndown (HTML to Markdown)
const turndown = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  bulletListMarker: '-',
});

// Strip WordPress block comments
function stripWpBlocks(html) {
  if (!html) return '';
  return html
    .replace(/<!-- \/?wp:\S+[\s\S]*?-->/g, '') // Remove WP block comments
    .replace(/\[caption[^\]]*\]([\s\S]*?)\[\/caption\]/g, '$1') // Strip caption shortcodes
    .replace(/\[\/?[a-z_]+[^\]]*\]/g, '') // Strip remaining shortcodes
    .replace(/\n{3,}/g, '\n\n') // Collapse excessive newlines
    .trim();
}

// Sanitize slug for filename
function sanitizeSlug(slug) {
  return slug
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// Escape YAML string
function escapeYaml(str) {
  if (!str) return '""';
  // If contains special chars, wrap in quotes and escape internal quotes
  if (str.includes('"') || str.includes(':') || str.includes('#') || str.includes('\n')) {
    return '"' + str.replace(/"/g, '\\"').replace(/\n/g, ' ') + '"';
  }
  return '"' + str + '"';
}

// Convert HTML content to Markdown
function htmlToMarkdown(html) {
  if (!html) return '';
  const cleaned = stripWpBlocks(html);
  try {
    return turndown.turndown(cleaned).trim();
  } catch (e) {
    // Fallback: strip all HTML tags
    return cleaned.replace(/<[^>]+>/g, '').trim();
  }
}

async function main() {
  console.log('🌿 WordPress to Astro Migration');
  console.log('================================\n');

  if (!existsSync(CSV_PATH)) {
    console.error(`❌ CSV file not found at: ${CSV_PATH}`);
    console.error('   Expected: wp_posts.csv in the gardeningservicesdundalk folder');
    process.exit(1);
  }

  // Ensure output directories exist
  const blogDir = join(CONTENT_DIR, 'blog');
  const reviewsDir = join(CONTENT_DIR, 'reviews');
  mkdirSync(blogDir, { recursive: true });
  mkdirSync(reviewsDir, { recursive: true });

  console.log(`📂 Reading: ${CSV_PATH}`);

  const records = [];

  // Parse CSV
  const parser = createReadStream(CSV_PATH).pipe(
    parse({
      columns: true,
      skip_empty_lines: true,
      relax_column_count: true,
      relax_quotes: true,
      quote: '"',
      escape: '"',
      trim: true,
      cast: false,
      on_record: (record) => {
        // Only keep published posts, pages, and reviews
        if (record.post_status === 'publish' &&
            ['post', 'page', 'site-review'].includes(record.post_type)) {
          return record;
        }
        return null;
      },
    })
  );

  for await (const record of parser) {
    if (record) records.push(record);
  }

  console.log(`\n📊 Found ${records.length} published items\n`);

  // Separate by type
  const posts = records.filter(r => r.post_type === 'post');
  const reviews = records.filter(r => r.post_type === 'site-review');
  const pages = records.filter(r => r.post_type === 'page');

  console.log(`  📝 Blog posts: ${posts.length}`);
  console.log(`  ⭐ Reviews: ${reviews.length}`);
  console.log(`  📄 Pages: ${pages.length}`);
  console.log('');

  // ---- MIGRATE BLOG POSTS ----
  let blogCount = 0;
  for (const post of posts) {
    const slug = sanitizeSlug(post.post_name || `post-${post.ID}`);
    const title = (post.post_title || 'Untitled').replace(/"/g, '\\"');
    const date = post.post_date || '2024-01-01';
    const content = htmlToMarkdown(post.post_content);
    const excerpt = (post.post_excerpt || '').replace(/"/g, '\\"').replace(/\n/g, ' ').substring(0, 300);

    const frontmatter = [
      '---',
      `title: "${title}"`,
      `date: "${date}"`,
      excerpt ? `description: "${excerpt}"` : null,
      'draft: false',
      '---',
    ].filter(Boolean).join('\n');

    const filepath = join(blogDir, `${slug}.md`);
    writeFileSync(filepath, frontmatter + '\n\n' + content, 'utf-8');
    blogCount++;
  }
  console.log(`✅ Wrote ${blogCount} blog posts to src/content/blog/`);

  // ---- MIGRATE REVIEWS ----
  let reviewCount = 0;
  // Write all reviews to a single YAML array file for simplicity
  const reviewEntries = [];
  for (const review of reviews) {
    const name = (review.post_title || 'Anonymous').trim();
    const text = (review.post_content || '')
      .replace(/<[^>]+>/g, '') // Strip HTML
      .replace(/\n+/g, ' ')
      .trim();

    if (!text) continue;

    reviewEntries.push({
      name,
      text,
      rating: 5,
      date: review.post_date || '2024-01-01',
      source: 'Google Review',
      featured: reviewCount < 6,
    });
    reviewCount++;
  }

  // Write individual YAML files for each review
  for (let i = 0; i < reviewEntries.length; i++) {
    const r = reviewEntries[i];
    const filename = `review-${String(i + 1).padStart(3, '0')}.yaml`;
    const yaml = [
      `name: ${escapeYaml(r.name)}`,
      `text: ${escapeYaml(r.text)}`,
      `rating: ${r.rating}`,
      `date: "${r.date}"`,
      `source: "${r.source}"`,
      `featured: ${r.featured}`,
    ].join('\n');

    writeFileSync(join(reviewsDir, filename), yaml, 'utf-8');
  }
  console.log(`✅ Wrote ${reviewCount} reviews to src/content/reviews/`);

  // ---- LOG PAGES FOR REFERENCE ----
  console.log(`\n📄 Pages found (${pages.length}):`);
  const pageLog = [];
  for (const page of pages) {
    const slug = page.post_name || `page-${page.ID}`;
    const title = page.post_title || 'Untitled';
    pageLog.push(`  - /${slug}/ — ${title}`);
  }
  // Sort and print
  pageLog.sort().forEach(l => console.log(l));

  // Write pages log
  writeFileSync(
    join(PROJECT_ROOT, 'scripts', 'pages-export.log'),
    `WordPress Pages Export\n${'='.repeat(40)}\n\n${pageLog.join('\n')}`,
    'utf-8'
  );
  console.log(`\n📋 Pages list saved to scripts/pages-export.log`);

  console.log('\n✅ Migration complete!\n');
  console.log('Next steps:');
  console.log('  1. Review blog posts in src/content/blog/');
  console.log('  2. Review reviews in src/content/reviews/');
  console.log('  3. Run: npm run dev');
}

main().catch(err => {
  console.error('❌ Migration failed:', err.message);
  process.exit(1);
});
