Task Contract LWS-P1A-008 — self-hosted fonts, a one-row tablet nav, and a gate that reads CSS

> ROLE: you implement this contract. You do not write contracts. If a line here looks wrong, say
> which line and why in your report — do not rewrite it and do not hand back a task.

Task: LWS-P1A-008 — eighth task in this repository, third for Cursor running Grok 4.7 High.
Risk: **R2 — every page head, the stylesheet, `.htaccess` and six new deployed files.**
No text a visitor reads changes.
Repository: `D:\dev\projects\lumit_website`
Behaviour IDs: **B-011** (new); **B-001 and B-008 extended to read CSS**. B-002 to B-010 must not regress.

House rules as before: **no `git` command of any kind**, byte counts and hashes are the scope proof,
mutations one at a time and restored from your own copy.

---

## 0. Why this task exists

1. **Every page loads Work Sans and JetBrains Mono from Google.** So every visitor's IP address goes
   to a third party, on a site whose contact page says it runs no tracking. **D-LWS-005.** The fonts
   are SIL Open Font License, so self-hosting them is permitted.
2. **The gate cannot see files referenced from CSS.** The review of LWS-P1A-006 (§5) found it, and
   the planner's prototype of this task hit it immediately: with the fonts listed in `.cpanel.yml`,
   B-008 rejects all four as "not part of the site", because only the HTML pages feed the site set.
   Remove them from `.cpanel.yml` instead and the gate goes green while every font 404s live.
3. **Between 768 and 976px wide, the masthead nav wraps onto two rows.** That predates the restyle.
   **The owner chose 2026-10-08 to compact it so all six links fit on one row from 768px**, keeping
   the phone menu below 768px exactly as it is.
4. **Nothing stops a third-party request coming back.** B-011 does.

**As with LWS-P1A-007, the planner built and measured this before writing it.** Every size, hash,
banner and mutation line below comes from running it.

## 1. Supporting files — exact, already in the repository

| file | bytes | SHA-256 (first 16) |
|---|---:|---|
| `docs/context/cursor/grok/4_7/high/lws_p1a_008_styles.css` | **17,846** | `128111ee27982d6b` |
| `docs/context/cursor/grok/4_7/high/lws_p1a_008_pages.diff` | **6,509** | `e5da0fa5aa68cd70` |
| `docs/context/cursor/grok/4_7/high/lws_p1a_008_fonts/work-sans-latin-wght-normal.woff2` | 50,316 | `1dd49afc07fb2231` |
| `…/lws_p1a_008_fonts/jetbrains-mono-latin-400-normal.woff2` | 21,168 | `14425ba9c695763c` |
| `…/lws_p1a_008_fonts/jetbrains-mono-latin-500-normal.woff2` | 21,832 | `cb182feeed4d798f` |
| `…/lws_p1a_008_fonts/jetbrains-mono-latin-700-normal.woff2` | 21,908 | `d0d4e818808f2a0b` |
| `…/lws_p1a_008_fonts/OFL-work-sans.txt` | 4,515 | `e7c426573d51f3d2` |
| `…/lws_p1a_008_fonts/OFL-jetbrains-mono.txt` | 4,524 | `403581b69dac5cff` |

**Where the fonts came from**, recorded so anyone can re-derive them — you do not need to download
anything:

| package | tarball | npm integrity |
|---|---|---|
| `@fontsource-variable/work-sans@5.3.0` | `https://registry.npmjs.org/@fontsource-variable/work-sans/-/work-sans-5.3.0.tgz` | `sha512-le8h/OIIuhm5Z7TdvuMw0yKg2gaCZUiMec8zaumsVVjzeJRBPEF0bQI/MkaZDHCVzZDvZoP/O2LiGOSfDLSbaw==` |
| `@fontsource/jetbrains-mono@5.3.0` | `https://registry.npmjs.org/@fontsource/jetbrains-mono/-/jetbrains-mono-5.3.0.tgz` | `sha512-fqDfB5I9f1p1TV486aUgB9t8zP84P0O1FtQR5Ol9vjwPy+S+EIGlVYm1cvj2W5shcZMTg2nZFdVMoH5wFu8a1A==` |

Files taken: the Latin subset only — **Work Sans as one variable file covering every weight**, and
**JetBrains Mono at 400, 500 and 700**, the only mono weights the stylesheet uses. No italic: nothing
on the site is set in italic. Each package's `LICENSE` became the `OFL-*.txt` beside it. **The
`.woff2` files carry the copyright line but not the licence text**, so the licence files are deployed
with them — SIL OFL §2.

**Known and accepted:** the `→` in the buttons is not in either font's Latin subset, so it renders
from the system monospace font. **That is also true today** — Google's Latin subset omits U+2192 too.

## 2. What changes

```
assets/fonts/                                  CREATE  directory
assets/fonts/work-sans-latin-wght-normal.woff2 CREATE  copy, byte for byte
assets/fonts/jetbrains-mono-latin-400-normal.woff2  CREATE  copy, byte for byte
assets/fonts/jetbrains-mono-latin-500-normal.woff2  CREATE  copy, byte for byte
assets/fonts/jetbrains-mono-latin-700-normal.woff2  CREATE  copy, byte for byte
assets/fonts/OFL-work-sans.txt                 CREATE  copy, byte for byte
assets/fonts/OFL-jetbrains-mono.txt            CREATE  copy, byte for byte
styles.css                                     REPLACE with lws_p1a_008_styles.css
index.html + the five page index.html files    MODIFY  per lws_p1a_008_pages.diff
.htaccess                                      MODIFY  per lws_p1a_008_pages.diff
.cpanel.yml                                    MODIFY  per lws_p1a_008_pages.diff
.gitattributes                                 MODIFY  per lws_p1a_008_pages.diff
scripts/check_site.mjs                         MODIFY  §4
```

**Nothing else.** Not `robots.txt`, `sitemap.xml`, either SVG, `package.json`, `README.md`, the
records, or anything under `docs/`. **Copy the binary fonts with a binary-safe copy** — Explorer, or
`Copy-Item` — and confirm each hash after copying. A text-mode copy corrupts a `.woff2` silently.

**Apply the diff by any means except `git`.** It is 10 hunks across nine files, applied against
`main` = `d1a4b0d`, and it reproduced the planner's files exactly.

## 3. What the diff and the stylesheet do

**Every page, identically**, in `<head>` (not gated chrome, but must match on all six):

- the three Google lines go — two `preconnect`s and the font stylesheet;
- `styles.css?v=3` → **`styles.css?v=4`**.

**`styles.css`** = the LWS-P1A-007 stylesheet plus exactly two changes:

1. **Four `@font-face` rules at the top**, each `font-display:swap`, each
   `url(/assets/fonts/<file>.woff2?v=1)` — root-absolute and versioned like every other asset.
2. **One new media block, `768px` to `1023.98px`,** that tightens only the masthead: link padding,
   gaps, the brand name's letter-spacing, the masthead button's padding. Measured with the real
   fonts: **one row at every width from 768px, masthead 65.2px, 18px to spare at 768px.** Above
   1024px nothing changes (67.8px, as now); below 768px nothing changes (61px closed, as now).

**`.htaccess`:** `AddType font/woff2 .woff2` in a `mod_mime` block, and
`ExpiresByType font/woff2 "access plus 1 year"` — safe because the URL carries `?v=1`.

**`.cpanel.yml`:** `$DEPLOYPATH/assets/fonts` added to the `mkdir`, and six `cp` lines for the four
fonts and two licences. 917 → **1,632 bytes**.

**`.gitattributes`:** `*.woff2 binary` appended, with a comment. `text=auto` would already detect them
as binary; this makes it certain. 902 → **967 bytes**.

## 4. The gate

### 4.1 B-001 and B-008 learn to read CSS

**Which stylesheets:** every internal `href` on any page whose resolved file ends in `.css` and
exists. Each stylesheet is read once, however many pages link it.

**What is read:** every `url(…)` in it — with or without quotes, whitespace tolerated. For each:

| the target | result |
|---|---|
| starts `data:` | ignored, and not counted |
| `http:`, `https:` or `//` with a host other than `lumittechnology.com` | **B-011** — §4.2 |
| not root-absolute (`fonts/x.woff2`, `../x.png`, or an absolute URL on this host) | `<css>:<line>  B-001 url() is not root-absolute: <target>` |
| root-absolute, but the file does not exist (resolve with the existing `resolveOnDisk`) | `<css>:<line>  B-001 <target> does not resolve` |
| root-absolute and exists | **added to B-008's site set** |

**Every non-`data:` `url()` is counted in the banner's asset total.** The banner becomes
**`site check: 6 pages | 132 internal links | 10 assets`** — six `<img>` plus four fonts. This is a
deliberate change; do not count them anywhere else.

**`DEPLOY_UNLINKED` gains the two licence files**:
`'assets/fonts/OFL-work-sans.txt', 'assets/fonts/OFL-jetbrains-mono.txt'`. They are files no page or
stylesheet references that must still be served — exactly what that list is for. Update its comment.

### 4.2 B-011 — no third-party request

On every page, any `<link>`, `<script>`, `<img>`, `<iframe>`, `<source>`, `<audio>`, `<video>` or
`<embed>` whose `href` or `src` starts `http:`, `https:` or `//` with a host other than
`lumittechnology.com` →
`<page>:<line>  B-011 third-party request: <target>`.
And in CSS, an off-site `url()` → `<css>:<line>  B-011 third-party request: <target>`.

**Not** `<a href>` — a link the visitor chooses to follow is not a request the page makes. The
canonical `<link>` is on this host, so it passes.

**Proof that it bites:** on today's `main` it reports **18** — three Google lines on six pages.

### 4.3 Must not change

- B-001 to B-010 behave exactly as before on the HTML pages.
- The order: everything existing, then B-008 with the CSS-derived site set, B-009, B-010, B-011.
- Imports stay `node:fs`, `node:path`, `node:url`. **RULE 003.** No CSS parser; a regex is enough.

## 5. Byte counts after — every one known

```
file                                                bytes   SHA-256 (first 16)
.htaccess                                             907   066cccc8c7c1b6ea   (was 796)
index.html                                         16,493   249dc045c1a9f8b6   (was 16,783)
styles.css                                         17,846   128111ee27982d6b   (was 16,895)
about/index.html                                    7,308   03633611aa720d5b   (was 7,598)
contact/index.html                                  6,002   395a1f03acf3e43d   (was 6,292)
engagements/index.html                              6,619   d251950a11de6c3b   (was 6,909)
how-we-work/index.html                              7,526   d4fadd2d17757142   (was 7,816)
services/index.html                                15,145   b8df4663c491708a   (was 15,435)
.cpanel.yml                                         1,632   fc1bf86e06a536aa   (was 917)
.gitattributes                                        967   5f74ec722a8be615   (was 902)
assets/fonts/  — the six files, sizes and hashes as in §1
robots.txt 73 · sitemap.xml 649 · assets/lumit-mark.svg 24,646 · assets/icons.svg 3,522 · package.json 132   unchanged
scripts/check_site.mjs                             16,729 → (yours)
```

Each page shrinks by exactly 290 bytes — the three Google lines out, one character changed in the
version string.

## 6. Mutations — ten, one at a time, restored from your own copy

Line numbers are exact for the finished tree.

| # | mutation | predicted |
|---|---|---|
| M1 | delete the `jetbrains-mono-latin-500-normal.woff2` line from `.cpanel.yml` | **1 × B-008** `.cpanel.yml:1  B-008 assets/fonts/jetbrains-mono-latin-500-normal.woff2 is part of the site but is not deployed` — **the defect this task exists for** |
| M2 | `styles.css`: `work-sans-latin-wght-normal.woff2?v=1` → `…-normall.woff2?v=1` | **B-001** `styles.css:1  B-001 /assets/fonts/work-sans-latin-wght-normall.woff2?v=1 does not resolve` **and B-008** `.cpanel.yml:13 … work-sans-latin-wght-normal.woff2 is deployed but is not part of the site` — 2 |
| M3 | `about/index.html`: add `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Work+Sans">` before the `styles.css` link | **1 × B-011** `about/index.html:16  B-011 third-party request: https://fonts.googleapis.com/css2?family=Work+Sans` |
| M4 | `styles.css`: the 700 font's `url(/assets/…)` → `url(assets/…)` | **B-001** `styles.css:4  B-001 url() is not root-absolute: assets/fonts/jetbrains-mono-latin-700-normal.woff2?v=1` **and B-008** `.cpanel.yml:16 … is deployed but is not part of the site` — 2 |
| M5 | insert as line 1 of `styles.css`: `@font-face{font-family:X;src:url(https://fonts.gstatic.com/s/x.woff2)}` | **1 × B-011** `styles.css:1  B-011 third-party request: https://fonts.gstatic.com/s/x.woff2`; banner **11 assets** |
| M6 | delete `assets/fonts/OFL-work-sans.txt` | **1 × B-008** `.cpanel.yml:17  B-008 assets/fonts/OFL-work-sans.txt does not exist as a file` |
| M7 | `contact/index.html`: `<script src="https://cdn.example.com/a.js"></script>` just before `</main>` | **1 × B-011** `contact/index.html:95  B-011 third-party request: https://cdn.example.com/a.js` |
| M8 | insert as line 1 of `styles.css`: `.x{background:url(data:image/gif;base64,R0lGODlhAQABAAAAACw=)}` | **green**, banner still **10 assets** — `data:` is ignored |
| M9 | **regression** — `about/index.html`: `#i-cloud` → `#i-clod` | **1 × B-009** `about/index.html:73  B-009 #i-clod is not a <symbol> in /assets/icons.svg` |
| M10 | **regression** — `index.html`: `style="color:red"` on `<p class="aside">` | **1 × B-010** `index.html:109  B-010 inline style attribute` |

**M1, M3 and M5 are the ones this task exists for.** A result that differs is a result: report it
exactly. Do not change a check or a site file to make it match.

## 7. Measure in a browser

Serve the tree locally and, at **320, 375, 768, 900 and 1100px**, light and dark, all six routes:

1. **No request leaves the local server** — record every request's host. Expect none.
2. **The four fonts load**: `[...document.fonts].filter(f => f.status === 'loaded')` shows Work Sans
   (`100 900`) and JetBrains Mono 400, 500, 700 on the homepage.
3. **No horizontal overflow**, and every visible icon's `<use>` has a non-zero `getBBox()`.
4. **At 768 and 900px the six nav links share one row** — their `getBoundingClientRect().top`
   values are all equal — and the masthead is **65.2px**. At 375px with JavaScript on it is still
   **61px** closed.

**Say which browser and version.** The planner's run: 156 combinations, zero problems, no
external host, contrast lowest **5.37:1** light / **6.61:1** dark — unchanged from LWS-P1A-007.

## 8. Report back

1. every size and hash in §1 and §5, after copying, and how you copied the fonts;
2. the clean-run output and `node -v`;
3. how you applied the diff;
4. the CSS reach and B-011 quoted from your code;
5. the ten mutation results — exact lines, exit codes, before/after byte counts;
6. the §7 measurements, with browser and version;
7. residual risks; 8. anything in this contract you think is wrong, quoted by line.

## 9. Stop and ask if

- any size or hash differs from §1 or §5;
- a hunk will not apply;
- the clean tree is not `6 pages | 132 internal links | 10 assets` / `site check ok`;
- **M1, M3 or M5 comes back green**;
- any request leaves the local server in §7;
- you believe a file outside §2 must change, or that visible text changed;
- you want a dependency.

## 10. After you report — not your work

The planner verifies independently. The owner commits, pushes and deploys. The planner then confirms
from outside: every page asks for `styles.css?v=4`, the four fonts are served as `font/woff2` with a
one-year cache, the licences are reachable, **and a page load makes no request to any host but
`lumittechnology.com`** — which is when the contact page's promise becomes literally true.
