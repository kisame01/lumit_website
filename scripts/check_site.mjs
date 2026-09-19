import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://lumittechnology.com';

function rel(abs) {
  return path.relative(root, abs).split(path.sep).join('/');
}

function lineAt(source, index) {
  return 1 + source.slice(0, index).split('\n').length - 1;
}

function findPages() {
  const pages = [];
  const rootIndex = path.join(root, 'index.html');
  if (fs.existsSync(rootIndex)) {
    pages.push({ abs: rootIndex, file: 'index.html', urlPath: '/' });
  }
  const entries = fs.readdirSync(root, { withFileTypes: true });
  entries.sort((a, b) => a.name.localeCompare(b.name));
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const abs = path.join(root, entry.name, 'index.html');
    if (fs.existsSync(abs)) {
      pages.push({
        abs,
        file: `${entry.name}/index.html`,
        urlPath: `/${entry.name}/`,
      });
    }
  }
  return pages;
}

function isInternal(target) {
  return target.startsWith('/') && !target.startsWith('//');
}

function collectAttrs(html) {
  const links = [];
  const assets = [];
  const re = /\b(href|src)="([^"]*)"/g;
  let match;
  while ((match = re.exec(html))) {
    const target = match[2];
    if (!isInternal(target)) continue;
    const rec = { target, line: lineAt(html, match.index) };
    if (match[1] === 'href') links.push(rec);
    else assets.push(rec);
  }
  return { links, assets };
}

function resolveOnDisk(target) {
  const bare = target.split('#')[0].split('?')[0];
  const relative = bare.endsWith('/') ? `${bare.slice(1)}index.html` : bare.slice(1);
  return path.join(root, relative);
}

function matchAll(html, re) {
  const out = [];
  const flags = re.flags.includes('g') ? re.flags : `${re.flags}g`;
  const global = new RegExp(re.source, flags);
  let match;
  while ((match = global.exec(html))) {
    out.push({
      text: match[0],
      group: match[1],
      line: lineAt(html, match.index),
    });
  }
  return out;
}

function extractBlocks(html, startTag, endTag) {
  const blocks = [];
  let from = 0;
  for (;;) {
    const start = html.indexOf(startTag, from);
    if (start < 0) break;
    const end = html.indexOf(endTag, start);
    if (end < 0) break;
    blocks.push({
      text: html.slice(start, end + endTag.length),
      line: lineAt(html, start),
    });
    from = end + endTag.length;
  }
  return blocks;
}

function extractBlock(html, startTag, endTag) {
  const blocks = extractBlocks(html, startTag, endTag);
  return blocks.length === 0 ? null : blocks[0];
}

const CHROME = [
  {
    key: 'header',
    start: '<header class="masthead">',
    end: '</header>',
    label: 'header',
  },
  {
    key: 'closing',
    start: '<section class="closing">',
    end: '</section>',
    label: 'closing block',
  },
  {
    key: 'footer',
    start: '<footer>',
    end: '</footer>',
    label: 'footer',
  },
];

function checkChromeCount(page, html, violations) {
  const ok = { header: true, closing: true, footer: true };
  for (const block of CHROME) {
    const found = extractBlocks(html, block.start, block.end);
    if (found.length === 1) continue;
    const line = found[1]?.line ?? 1;
    violations.push(
      `${page.file}:${line}  B-005 ${block.label} occurs ${found.length} times, expected exactly 1`,
    );
    ok[block.key] = false;
  }
  return ok;
}

function tagNameFromStart(startTag) {
  const match = /^<([A-Za-z][A-Za-z0-9]*)/.exec(startTag);
  return match ? match[1].toLowerCase() : null;
}

const BALANCE_TAGS = [];
{
  const seen = new Set();
  for (const name of [...CHROME.map((block) => tagNameFromStart(block.start)), 'script']) {
    if (!name || seen.has(name)) continue;
    seen.add(name);
    BALANCE_TAGS.push(name);
  }
}

function checkTagBalance(page, html, violations) {
  for (const name of BALANCE_TAGS) {
    const starts = matchAll(html, new RegExp(`<${name}(?=[\\s>/])`, 'gi'));
    const ends = matchAll(html, new RegExp(`</${name}(?=[\\s>])`, 'gi'));
    if (starts.length === ends.length) continue;
    const unmatched =
      starts.length > ends.length ? starts[ends.length] : ends[starts.length];
    const line = unmatched?.line ?? 1;
    violations.push(
      `${page.file}:${line}  B-007 <${name}> has ${starts.length} start and ${ends.length} end tags`,
    );
  }
}

function chromeNorm(block, key) {
  if (!block) return null;
  return key === 'header'
    ? block.text.replaceAll(' aria-current="page"', '')
    : block.text;
}

function checkHead(page, html, violations) {
  const h1s = matchAll(html, /<h1\b/);
  if (h1s.length !== 1) {
    const line = h1s[0]?.line ?? 1;
    violations.push(
      `${page.file}:${line}  B-002 expected exactly one <h1>, found ${h1s.length}`,
    );
  }

  const titles = matchAll(html, /<title>([\s\S]*?)<\/title>/);
  if (titles.length !== 1) {
    const line = titles[0]?.line ?? 1;
    violations.push(
      `${page.file}:${line}  B-002 expected exactly one <title>, found ${titles.length}`,
    );
  } else if (titles[0].group.trim() === '') {
    violations.push(`${page.file}:${titles[0].line}  B-002 <title> is empty`);
  }

  const descriptions = matchAll(
    html,
    /<meta\s+name="description"\s+content="([^"]*)"\s*\/?>/,
  );
  if (descriptions.length !== 1) {
    const line = descriptions[0]?.line ?? 1;
    violations.push(
      `${page.file}:${line}  B-002 expected exactly one <meta name="description">, found ${descriptions.length}`,
    );
  } else if (descriptions[0].group.trim() === '') {
    violations.push(
      `${page.file}:${descriptions[0].line}  B-002 meta description is empty`,
    );
  }

  const canonicals = matchAll(
    html,
    /<link\s+rel="canonical"\s+href="([^"]*)"\s*\/?>/,
  );
  const expected = `${SITE}${page.urlPath}`;
  if (canonicals.length !== 1) {
    const line = canonicals[0]?.line ?? 1;
    violations.push(
      `${page.file}:${line}  B-002 expected exactly one canonical, found ${canonicals.length}`,
    );
  } else if (canonicals[0].group !== expected) {
    const got = canonicals[0].group.startsWith(SITE)
      ? canonicals[0].group.slice(SITE.length) || '/'
      : canonicals[0].group;
    violations.push(
      `${page.file}:${canonicals[0].line}  B-002 canonical is ${got} but the page is at ${page.urlPath}`,
    );
  }
}

const pages = findPages();
const loaded = pages.map((page) => {
  const html = fs.readFileSync(page.abs, 'utf8');
  const refs = collectAttrs(html);
  return { ...page, html, ...refs };
});

const violations = [];
let linkCount = 0;
let assetCount = 0;

for (const page of loaded) {
  linkCount += page.links.length;
  assetCount += page.assets.length;
  for (const ref of [...page.links, ...page.assets]) {
    const abs = resolveOnDisk(ref.target);
    if (!fs.existsSync(abs) || !fs.statSync(abs).isFile()) {
      violations.push(
        `${page.file}:${ref.line}  B-001 ${ref.target} does not resolve`,
      );
    }
  }
  checkHead(page, page.html, violations);
}

const sitemapAbs = path.join(root, 'sitemap.xml');
const sitemapFile = 'sitemap.xml';
const pageLocs = new Set(loaded.map((page) => `${SITE}${page.urlPath}`));
const sitemapLocs = new Map();
if (!fs.existsSync(sitemapAbs)) {
  violations.push(`${sitemapFile}:1  B-003 sitemap.xml is missing`);
} else {
  const sitemap = fs.readFileSync(sitemapAbs, 'utf8');
  const locRe = /<loc>([^<]*)<\/loc>/g;
  let match;
  while ((match = locRe.exec(sitemap))) {
    sitemapLocs.set(match[1], lineAt(sitemap, match.index));
  }
  for (const page of loaded) {
    const loc = `${SITE}${page.urlPath}`;
    if (!sitemapLocs.has(loc)) {
      violations.push(
        `${page.file}:1  B-003 page ${loc} is missing from sitemap.xml`,
      );
    }
  }
  for (const [loc, line] of sitemapLocs) {
    if (!pageLocs.has(loc)) {
      violations.push(
        `${sitemapFile}:${line}  B-003 sitemap entry with no page: ${loc}`,
      );
    }
  }
}

const chromeOk = new Map();
for (const page of loaded) {
  chromeOk.set(page.file, checkChromeCount(page, page.html, violations));
}

for (const page of loaded) {
  checkTagBalance(page, page.html, violations);
}

if (loaded.length > 0) {
  const first = loaded[0];
  const rest = loaded.slice(1);

  for (const block of CHROME) {
    if (!chromeOk.get(first.file)[block.key]) continue;
    const firstBlock = extractBlock(first.html, block.start, block.end);
    const firstNorm = chromeNorm(firstBlock, block.key);
    const others = rest.map((page) => {
      const extracted = extractBlock(page.html, block.start, block.end);
      return {
        page,
        extracted,
        norm: chromeNorm(extracted, block.key),
        ok: chromeOk.get(page.file)[block.key],
      };
    });

    const allOthersIdentical =
      others.length > 0 && others.every((item) => item.norm === others[0].norm);
    if (allOthersIdentical && others[0].norm !== firstNorm) {
      const line = firstBlock?.line ?? 1;
      violations.push(
        `${first.file}:${line}  B-004 ${block.label} differs from the other ${others.length} pages`,
      );
      continue;
    }

    for (const item of others) {
      if (!item.ok) continue;
      if (!firstBlock || !item.extracted) {
        const line = item.extracted?.line ?? 1;
        violations.push(
          `${item.page.file}:${line}  B-004 ${block.label} missing compared with ${first.file}`,
        );
      } else if (item.norm !== firstNorm) {
        violations.push(
          `${item.page.file}:${item.extracted.line}  B-004 ${block.label} differs from ${first.file}`,
        );
      }
    }
  }
}

process.stdout.write(
  `site check: ${loaded.length} pages | ${linkCount} internal links | ${assetCount} assets\n`,
);
for (const violation of violations) {
  process.stdout.write(`${violation}\n`);
}
if (violations.length === 0) {
  process.stdout.write('site check ok\n');
  process.exit(0);
}
process.stdout.write(`site check FAILED: ${violations.length} violations\n`);
process.exit(1);
