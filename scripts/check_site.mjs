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

// The three root files no page links to. Everything else is discovered.
const DEPLOY_UNLINKED = ['.htaccess', 'robots.txt', 'sitemap.xml'];

function isDeployPathSafe(src) {
  if (src.startsWith('/') || /^[A-Za-z]:/.test(src)) return false;
  if (/[*?\[\]{}]/.test(src)) return false;
  return src.split('/').every((part) => part !== '' && part !== '..');
}

function rememberDeployDir(created, dir) {
  const parts = dir.split('/');
  for (let n = 1; n <= parts.length; n++) {
    created.add(parts.slice(0, n).join('/'));
  }
}

function checkDeploy(loaded, violations) {
  const manifestFile = '.cpanel.yml';
  const manifestAbs = path.join(root, manifestFile);
  if (!fs.existsSync(manifestAbs) || !fs.statSync(manifestAbs).isFile()) {
    violations.push(`${manifestFile}:1  B-008 .cpanel.yml not found`);
    return;
  }

  const text = fs.readFileSync(manifestAbs, 'utf8');
  const lines = text.split('\n');
  let tasksStarted = false;
  const tasks = [];
  for (let i = 0; i < lines.length; i++) {
    if (!tasksStarted) {
      if (/^\s*tasks:\s*$/.test(lines[i])) tasksStarted = true;
      continue;
    }
    const match = /^\s*-\s+(.+)$/.exec(lines[i]);
    if (match) tasks.push({ task: match[1], line: i + 1 });
  }

  const expectedExport = 'export DEPLOYPATH=$HOME/public_html';
  if (tasks.length === 0 || tasks[0].task !== expectedExport) {
    const line = tasks[0] ? tasks[0].line : 1;
    violations.push(
      `${manifestFile}:${line}  B-008 first task must be ${expectedExport}`,
    );
  }

  const createdDirs = new Set();
  const deployed = [];
  for (let i = 1; i < tasks.length; i++) {
    const task = tasks[i].task;
    const line = tasks[i].line;

    if (task.startsWith('/bin/mkdir -p ')) {
      const args = task
        .slice('/bin/mkdir -p '.length)
        .split(/\s+/)
        .filter((arg) => arg !== '');
      const dirs = [];
      let allowed = args.length > 0;
      for (const arg of args) {
        if (!arg.startsWith('$DEPLOYPATH/')) {
          allowed = false;
          break;
        }
        const dir = arg.slice('$DEPLOYPATH/'.length);
        if (!isDeployPathSafe(dir)) {
          allowed = false;
          break;
        }
        dirs.push(dir);
      }
      if (!allowed) {
        violations.push(`${manifestFile}:${line}  B-008 task not allowed: ${task}`);
        continue;
      }
      for (const dir of dirs) rememberDeployDir(createdDirs, dir);
      continue;
    }

    if (task.startsWith('/bin/cp ')) {
      const rest = task.slice('/bin/cp '.length);
      const marker = ' $DEPLOYPATH/';
      const idx = rest.indexOf(marker);
      const later = idx === -1 ? -1 : rest.indexOf(marker, idx + marker.length);
      const src = idx > 0 ? rest.slice(0, idx) : '';
      const dest = idx > 0 ? rest.slice(idx + marker.length) : '';
      // A disallowed task is not a deployment: its source is not counted.
      const shapeOk = idx > 0 && later === -1 && src === dest && isDeployPathSafe(src);
      if (!shapeOk) {
        violations.push(`${manifestFile}:${line}  B-008 task not allowed: ${task}`);
        continue;
      }
      const slash = src.lastIndexOf('/');
      const destDir = slash === -1 ? '' : src.slice(0, slash);
      if (destDir !== '' && !createdDirs.has(destDir)) {
        violations.push(
          `${manifestFile}:${line}  B-008 destination directory for ${src} does not exist yet`,
        );
      }
      const abs = path.join(root, src);
      if (!fs.existsSync(abs) || !fs.statSync(abs).isFile()) {
        violations.push(`${manifestFile}:${line}  B-008 ${src} does not exist as a file`);
      }
      deployed.push({ file: src, line });
      continue;
    }

    violations.push(`${manifestFile}:${line}  B-008 task not allowed: ${task}`);
  }

  const site = new Set();
  for (const page of loaded) site.add(page.file);
  for (const page of loaded) {
    for (const ref of [...page.links, ...page.assets]) {
      const abs = resolveOnDisk(ref.target);
      if (fs.existsSync(abs) && fs.statSync(abs).isFile()) site.add(rel(abs));
    }
  }
  for (const name of DEPLOY_UNLINKED) site.add(name);

  const seen = new Set();
  for (const item of deployed) {
    if (seen.has(item.file)) {
      violations.push(
        `${manifestFile}:${item.line}  B-008 ${item.file} is deployed more than once`,
      );
    } else {
      seen.add(item.file);
    }
    if (!site.has(item.file)) {
      violations.push(
        `${manifestFile}:${item.line}  B-008 ${item.file} is deployed but is not part of the site`,
      );
    }
  }
  for (const file of site) {
    if (!seen.has(file)) {
      violations.push(
        `${manifestFile}:1  B-008 ${file} is part of the site but is not deployed`,
      );
    }
  }
}

function symbolIds(text) {
  const ids = new Set();
  const re = /<symbol\b[^>]*\bid="([^"]*)"/g;
  let match;
  while ((match = re.exec(text))) ids.add(match[1]);
  return ids;
}

function checkIcons(loaded, violations) {
  const cache = new Map();
  function idsAt(abs) {
    if (cache.has(abs)) return cache.get(abs);
    const ids = symbolIds(fs.readFileSync(abs, 'utf8'));
    cache.set(abs, ids);
    return ids;
  }

  const useRe = /<use\b[^>]*?\bhref="([^"]*)"/g;
  for (const page of loaded) {
    useRe.lastIndex = 0;
    let match;
    while ((match = useRe.exec(page.html))) {
      const href = match[1];
      const line = lineAt(page.html, match.index);
      const hash = href.indexOf('#');
      const fragment = hash < 0 ? '' : href.slice(hash + 1);
      if (fragment === '') {
        violations.push(
          `${page.file}:${line}  B-009 <use> has no #fragment: ${href}`,
        );
        continue;
      }
      const filePart = href.slice(0, hash);
      let ids;
      let label;
      if (filePart === '') {
        ids = symbolIds(page.html);
        label = page.file;
      } else if (isInternal(filePart)) {
        const abs = resolveOnDisk(filePart);
        if (!fs.existsSync(abs) || !fs.statSync(abs).isFile()) continue;
        ids = idsAt(abs);
        label = filePart.split('?')[0];
      } else {
        continue;
      }
      if (!ids.has(fragment)) {
        violations.push(
          `${page.file}:${line}  B-009 #${fragment} is not a <symbol> in ${label}`,
        );
      }
    }
  }
}

function checkInlineStyles(loaded, violations) {
  const re = / style="/g;
  for (const page of loaded) {
    re.lastIndex = 0;
    let match;
    while ((match = re.exec(page.html))) {
      violations.push(
        `${page.file}:${lineAt(page.html, match.index)}  B-010 inline style attribute`,
      );
    }
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

checkDeploy(loaded, violations);
checkIcons(loaded, violations);
checkInlineStyles(loaded, violations);

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
