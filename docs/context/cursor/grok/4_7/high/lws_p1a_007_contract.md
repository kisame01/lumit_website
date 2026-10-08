Task Contract LWS-P1A-007 — the restyle: brand palette, icons, cards, closing band; B-009 and B-010

> ROLE: you implement this contract. You do not write contracts. If a line here looks wrong, say
> which line and why in your report — do not rewrite it and do not hand back a task.

Task: LWS-P1A-007 — seventh task in this repository, second for Cursor running Grok 4.7 High.
Risk: **R2 — every page, the stylesheet and one new asset change, and they deploy to the live site.**
The text a visitor reads does not change, except one agreed comma.
Repository: `D:\dev\projects\lumit_website`
Behaviour IDs: **B-009** and **B-010** (new). B-001 to B-008 exist and must not regress.

Read `docs/context/cursor/grok/4_7/high/handover/session_handover_20261008_coder_kickoff.md` if you
have not. The house rules there still apply: **no `git` command of any kind**, byte counts are the
scope proof, mutations one at a time and restored from your own copy.

---

## 0. Why this task exists, and why it is built the way it is

The owner asked for proper styling and icons following `docs/reference/redesign_20261008.html`:
a full stylesheet in the brand colours, icons for the services, the process steps and the
comparison table, cards, a styled header, hero and closing band, responsive on phone and desktop,
**in `styles.css`, not inline**, and **the text unchanged**. The scope is settled in
`docs/decision/decision_20261008_cpanel_git_deployment_and_restyle_scope.md` §2–§3 (D-LWS-010).

**The planner built and measured the whole restyle before writing this contract.** Every number
below — byte counts, hashes, the gate banner, all ten mutation results, the masthead height, the
contrast minimums — was produced by running it, not predicted. Two September contracts carried
predictions that turned out wrong; this one carries measurements.

So the design work is done and **three supporting files are exact**:

| file | bytes | SHA-256 (first 16) | what it is |
|---|---:|---|---|
| `docs/context/cursor/grok/4_7/high/lws_p1a_007_styles.css` | **16,895** | `7b1a9ef1258825e9` | the new `styles.css`, byte for byte |
| `docs/context/cursor/grok/4_7/high/lws_p1a_007_icons.svg` | **3,522** | `ec00fa9bd2cd1270` | the new `assets/icons.svg`, byte for byte |
| `docs/context/cursor/grok/4_7/high/lws_p1a_007_pages.diff` | **64,661** | `4b517c22aed18657` | every change to the six pages and `.cpanel.yml`, as a unified diff |

**Your work** is to apply them exactly, and to write **B-009** and **B-010** in the gate — the two
checks that stop the next person from breaking what this task builds. Then measure, and report.

## 1. What changes

```
styles.css                     REPLACE   with lws_p1a_007_styles.css, byte for byte
assets/icons.svg               CREATE    from lws_p1a_007_icons.svg, byte for byte
index.html                     MODIFY    per lws_p1a_007_pages.diff
services/index.html            MODIFY    per lws_p1a_007_pages.diff
how-we-work/index.html         MODIFY    per lws_p1a_007_pages.diff
engagements/index.html         MODIFY    per lws_p1a_007_pages.diff
about/index.html               MODIFY    per lws_p1a_007_pages.diff
contact/index.html             MODIFY    per lws_p1a_007_pages.diff
.cpanel.yml                    MODIFY    per lws_p1a_007_pages.diff — one line added
scripts/check_site.mjs         MODIFY    B-009 and B-010, §4
```

**Nothing else.** Not `.htaccess`, `robots.txt`, `sitemap.xml`, `assets/lumit-mark.svg`,
`package.json`, `.gitattributes`, `.gitignore`, `README.md`, the records, anything under `docs/` —
**including the three supporting files and the reference**, which you read and do not edit.

**Apply the diff by any means except `git`** — by hand, or with a throwaway script you do not leave
in the repository. `git apply` is a git command. If a hunk will not apply, **stop and report the hunk**;
do not adjust it to fit. The diff was applied against the tree at `main` = `532c334` and reproduced the
planner's files exactly.

## 2. What the diff does — so you can check it, not so you can redesign it

**On all six pages, identically** — the masthead, closing block and footer are gated chrome, so B-004
proves these are byte-identical:

1. `styles.css?v=2` → **`styles.css?v=3`**. New markup with a cached old stylesheet is the
   half-deployed state from September; the version string moves with the file.
2. The menu toggle gains a menu icon before the word **Menu**.
3. The closing block's `<p style="margin-top:28px">` becomes `<p class="closing-act">`.
4. **The one text change, decided by the owner:** "…from your existing environment **—** we can turn…"
   becomes "…from your existing environment**,** we can turn…".
5. The footer's "Johannesburg · South Africa" gains a pin icon.

**Every icon is the same markup**, with only the symbol name changing:

```html
<svg class="ico" aria-hidden="true" focusable="false"><use href="/assets/icons.svg?v=1#i-NAME"/></svg>
```

Decorative, hidden from assistive technology, never focusable, one shared sprite cached once.

**Per page:**

| page | icons added | other markup |
|---|---|---|
| `index.html` | hero eyebrow (pin); three hero claims in tiles (cloud, db, coins); five gutter labels (compass, layers, flow, target, check); four steps in tiles (list, gauge, sort, check); six matrix options (pause, power, server, layers, code, swap); the note under the matrix (info); six service cards in gradient tiles (cloud, flow, db, coins, server, shield); four difference panels in tiles (scale, net, box, book) | effort cells wrapped in `<span class="eff eff-none|low|med|high|varies">`; the matrix wrapper gains `tabindex="0" role="region" aria-label="Workload disposition matrix"` so a keyboard user can scroll it; each panel's empty `<div class="bar">` is replaced by its tile, and `h3`+`p` are wrapped in a `<div>` |
| `services/index.html` | the six section gutters gain the six service tiles, same icons and order as the homepage | 18 inline-styled `h3` → `class="label-h"`; 12 `style="margin-top:8px"` removed; the last fine-print line → `class="fineprint"` |
| `how-we-work/index.html` | four steps (list, layers, code, gauge); the controls note (shield) | the note's `strong`+`p` wrapped in a `<div>` |
| `engagements/index.html` | the three fixed-scope headings (list, coins, db) | — |
| `about/index.html` | four capability panels (cloud, db, coins, flow) | as the homepage panels |
| `contact/index.html` | three boxes (**mail**, compass, list); the privacy note (shield) | inline styles → classes; note wrapped as on how-we-work |

**Every `style="…"` attribute leaves the six pages — all 48 of them.** Their effect moves into
`styles.css` as classes and adjacency rules. B-010 makes that permanent.

**The text a visitor reads does not change**, apart from item 4. The planner extracted the visible
text of all six pages before and after and compared it: identical except that comma. **The live
`<title>`, meta description, `<h1>`s, gutter labels, nav labels and `enquiries@` are untouched.**

**What `styles.css` does**, briefly, so you can recognise it: all the brand tokens kept; new tokens
for cards, tiles, effort pills and the focus ring, **each with a dark-mode value**; 12px cards for
steps, service cards, panels, contact boxes and engagement rows; icon tiles; the matrix with icons
and effort pills; a navy closing band with a cyan glow and a white button; the focus ring in the
accent blue on light backgrounds and cyan on navy; the masthead toggle and **767.98px breakpoint
from LWS-P1A-003 kept exactly**, including the no-JavaScript fallback that shows the full nav.
**It contains no `url(…)`** — see §7.1.

## 3. `.cpanel.yml`

The diff adds exactly one line after the mark:

```yaml
    - /bin/cp assets/icons.svg $DEPLOYPATH/assets/icons.svg
```

857 → **917 bytes**. **This is B-008 doing its job:** without this line the gate reports
`assets/icons.svg is part of the site but is not deployed` and refuses — the first real test of the
check you wrote in LWS-P1A-006.

## 4. The gate — B-009 and B-010

### 4.1 B-009 — every icon names a symbol that exists

**The gap it closes:** B-001 proves `/assets/icons.svg` exists. **Nothing proves `#i-cloud` exists
inside it.** A typo in a symbol name renders as a silent blank space — invisible to the eye at a
glance, invisible to every check before this one.

For every `<use … href="…">` on every page:

1. Split the `href` at `#`. **No fragment** →
   `<page>:<line>  B-009 <use> has no #fragment: <href>`
2. File part empty (`href="#i-x"`) → the symbols are looked up **in that page**.
3. File part internal → resolve it with the existing `resolveOnDisk`. **If the file does not exist,
   B-009 says nothing** — B-001 already reports it, and one defect reports once.
4. File part external → ignore.
5. Collect the ids of every `<symbol … id="…">` in that file (a regex is enough; cache per file).
   Fragment not among them →
   `<page>:<line>  B-009 #<fragment> is not a <symbol> in <file>`

   where `<file>` is the `href`'s file part **without the query string** (`/assets/icons.svg`), or
   the page's own path (`contact/index.html`) for a same-page reference.

### 4.2 B-010 — no inline style attribute on any page

Any start tag on a page carrying a ` style="` attribute →
`<page>:<line>  B-010 inline style attribute` — one line per attribute. D-LWS-010 put every style in
`styles.css`; this keeps it there. **Proof that it bites:** on today's `main` it reports **48**.

### 4.3 What must not change about the gate

- **The banner becomes `site check: 6 pages | 132 internal links | 6 assets`.** This is a deliberate
  change, and the contract states it so nobody treats it as a regression: **each of the 64 icon
  `<use href>`s is counted as an internal link**, because the gate counts `href`s and always has.
  68 + 64 = 132. **Do not change how links are counted** to bring it back to 68.
- B-009 and B-010 run **after** B-008, in that order, and suppress nothing.
- Imports stay `node:fs`, `node:path`, `node:url`. **RULE 003.** No HTML parser, no dependency.
- Clean tree exits 0; last line `site check ok` or `site check FAILED: <n> violations`.

## 5. Byte counts

**Every site file's resulting size and hash is known.** If yours differs, you have not made the same
file — **stop and report the difference; do not adjust anything to match.** If a count is off by about
the file's number of lines, that is a line-ending conversion — RULE 004.

```
file                       before      after      SHA-256 after (first 16)
.htaccess                     796        796      6af957fdb7b75967   unchanged
index.html                 12,860     16,783      b3a41726d9459f3a
styles.css                 12,667     16,895      7b1a9ef1258825e9
robots.txt                     73         73      806feb9c4ddaffcf   unchanged
sitemap.xml                   649        649      05cd4bebad6dd250   unchanged
assets/lumit-mark.svg      24,646     24,646      5b7bfb3dd814b87e   unchanged
assets/icons.svg           absent      3,522      ec00fa9bd2cd1270
about/index.html            6,962      7,598      8ccbe9d1bcb76714
contact/index.html          5,646      6,292      d3b9cccab5abc355
engagements/index.html      6,408      6,909      9564ea439a6f0972
how-we-work/index.html      7,001      7,816      0fd71a235710bf47
services/index.html        17,040     15,435      e01d658f2ce47e14
.cpanel.yml                   857        917      49f5b98dc3e2b4b8
scripts/check_site.mjs     14,799     (yours)
package.json                  132        132      unchanged
.gitattributes                902        902      unchanged
```

`services/index.html` **shrinks** — 32 long inline styles become short class names.

## 6. Mutations — ten, one at a time, every one restored from your own copy

Apply each to the finished tree with your B-009 and B-010 in place. **State the byte count of every
touched file before and after restoring.** These results are the planner's, from its own prototype
of B-009/B-010 against these exact files; the line numbers are exact for this tree.

| # | mutation | predicted |
|---|---|---|
| M1 | `about/index.html`: `#i-cloud` → `#i-clod` | **1 × B-009** `about/index.html:76  B-009 #i-clod is not a <symbol> in /assets/icons.svg`; **B-001 green** — the file exists |
| M2 | delete the `<symbol id="i-pin" …>` line from `assets/icons.svg` | **7 × B-009** — `index.html:57` (eyebrow) and the footer of all six pages (`index.html:206`, `about:111`, `contact:113`, `engagements:110`, `how-we-work:119`, `services:173`); B-004 green |
| M3 | delete the `icons.svg` line from `.cpanel.yml` | **1 × B-008** `assets/icons.svg is part of the site but is not deployed` |
| M4 | rename `assets/icons.svg` → `assets/icon.svg` | **64 × B-001** (one per `<use>`), **2 × B-008** (`does not exist as a file`, `is deployed but is not part of the site`), **0 × B-009** — 66 violations |
| M5 | `about/index.html` footer only: `#i-pin` → `#i-compass` | **1 × B-004** `about/index.html:107  B-004 footer differs from index.html`; B-009 green — `i-compass` exists |
| M6 | `contact/index.html`: put `style="margin-top:28px"` back on `<p class="closing-act">` | **B-004** `contact/index.html:100 … closing block differs` **and** **B-010** `contact/index.html:105  B-010 inline style attribute` — 2 violations |
| M7 | `how-we-work/index.html`, first icon only: `icons.svg?v=1#i-list` → `icons.svg?v=1` | **1 × B-009** `how-we-work/index.html:65  B-009 <use> has no #fragment: /assets/icons.svg?v=1` |
| M8 | `contact/index.html`: the mail icon's href → `#i-mail` | **1 × B-009** `contact/index.html:66  B-009 #i-mail is not a <symbol> in contact/index.html`; banner **131** links — a same-page `#` is not counted, which is the gate's existing behaviour |
| M9 | `index.html`: add `style="color:red"` to `<p class="aside">` | **1 × B-010** `index.html:112  B-010 inline style attribute` |
| M10 | **Regression — LWS-P1A-006 M5:** create `assets/probe.svg`, add `<img src="/assets/probe.svg" alt="">` inside `<main>` on `about/index.html` | **1 × B-008** `assets/probe.svg is part of the site but is not deployed`; banner **7 assets** |

**M1, M2 and M7 are the ones B-009 exists for. M6 and M9 are B-010's.** A mutation that comes back
different is a result: report it exactly, and do not change a check or a site file to make it match.

## 7. Measure in a browser — then the planner measures everything again

Serve the tree locally and, **at 320, 375, 768 and 1100px, light and dark, on all six routes**:

1. `document.documentElement.scrollWidth === innerWidth` — **no horizontal overflow**. The matrix
   scrolls inside its own box below 680px; that is intended.
2. **Every visible icon renders:** for each `svg.ico` with `getClientRects().length`, the
   `<use>`'s `getBBox()` is wider and taller than 0. (The menu icon is hidden at ≥768px — skip
   hidden ones.)
3. **JavaScript off, 375px:** the full nav is visible with no toggle. **JavaScript on, 375px:** the
   masthead is **61px** closed, and the nav opens and closes.

**Say which browser and version.** The planner's own run covered 156 combinations — six routes ×
320/375/767/768/1100 × light/dark × JavaScript on/off × menu open/closed — with **zero** overflow,
blank icons or missing nav, and WCAG contrast on every visible text and icon: **lowest 5.37:1 in
light, 6.61:1 in dark**. It will run that again on your tree.

### 7.1 Out of scope, recorded so it is not lost

**The gate cannot see files referenced from CSS `url(…)`** (review of LWS-P1A-006, §5). This
stylesheet uses none, so it does not matter here. **LWS-P1A-008, the self-hosted fonts, fixes it.** Do
not add it now.

## 8. Report back

1. every byte count and every SHA-256 prefix in §5, before and after;
2. the clean-run output and `node -v`;
3. how you applied the diff, and any hunk that did not apply cleanly;
4. B-009 and B-010 quoted from your code, and how each finds its line number;
5. the ten mutation results — exact violation lines, exit codes, before/after byte counts;
6. the §7 measurements, with browser and version;
7. residual risks and open questions;
8. anything in this contract you think is wrong, quoted by line.

## 9. Stop and ask if

- any file's size or hash in §5 differs from the prediction;
- a diff hunk does not apply;
- the clean tree is not `6 pages | 132 internal links | 6 assets` / `site check ok`;
- B-009 or B-010 fires on the clean tree;
- **M1, M2, M6 or M7 comes back green**;
- you believe any file outside §1 needs to change, or that the visible text changed anywhere other
  than the one comma in §2.4;
- you want a dependency of any kind.

## 10. After you report — not your work

The planner stages the tree, checks every hash, runs the gate and the ten mutations, and runs the
full 156-combination browser measurement plus the contrast audit. The owner commits, pushes and
clicks **Update from Remote → Deploy HEAD Commit**. The planner then confirms from outside that
`styles.css`, `assets/icons.svg` and all six pages have a new `Last-Modified` and match `main` byte
for byte — **and that `styles.css?v=3` is what every page asks for.** That is the September lesson,
checked.
