Task Contract LWS-P1A-003 — B-006, a masthead that works on a phone, and two layout defects

> ROLE: you implement this contract. You do not write contracts. If a line here looks wrong, say
> which line and why in your report — do not rewrite it and do not hand back a task.

Task: LWS-P1A-003 — third task in this repository.
Risk: R2 — this one touches all six HTML files. LWS-P1A-001 and LWS-P1A-002 did not.
Repository: `D:\dev\projects\lumit_website`
Behaviour IDs: **B-006** (new). B-001 to B-005 exist and must not regress.

---

## 0. What changed since LWS-P1A-002, and what it means for you

**The site is live** at `https://lumittechnology.com`. `main` is at
`ea647e5906cf5f62697549c6c5544c603c7ae142`. Your work ships to real visitors after the owner merges
and re-uploads, so a defect here is public.

**You still do not run `git`.** No `add`, no `commit`, no `branch`, no `checkout`, no `stash`. Leave
your work in the working tree; the owner commits it.

**`.gitattributes` pins line endings to LF.** Do not override it, do not set `core.autocrlf`. Byte
counts are the scope-proof mechanism here and a line-ending rewrite moves every one at once. RULE 004.

**This contract changes the masthead, which B-004 and B-005 gate.** Every previous task avoided the
chrome. This one cannot. Read §3 before you touch anything — the gate will catch you if the six
mastheads drift apart by a single byte, and that is the gate working, not a bug.

## 1. The problem, measured

All numbers below came from rendering the live pages at fixed widths and reading the DOM. They are
not estimates.

**1.1 The masthead is 290px tall on a phone.** At 375×812 that is **36% of the viewport gone before
any content**. It degrades fast as width drops:

| viewport | masthead height |
|---|---|
| 1100 | 73px |
| 768 | 106px |
| 600 | 187px |
| 480 | 267px |
| 375 | **290px** |

The nav stacks into a six-item vertical list — Home / Services / How we / work / Engagements / About /
Contact — and pushes the header down the page. **This is the real defect.** The owner reported it as a
list that should be horizontal or a hamburger.

**1.2 The masthead overflows horizontally below about 420px.** `a.btn` "Book a session" sits at
`left: 268.6, right: 424.9` against a 375 viewport — **49.9px past the edge**, clipped mid-word at
"Book a ses…". Its parent `div.wrap.masthead-in` is `display: flex` with **`flex-wrap: nowrap`**, and
the button is `white-space: nowrap`. Confirmed on all six routes. Overflow is present at 320, 360,
375 and 414; gone by 465.

**1.3 The homepage is 662px wide inside a 375px viewport.** 287px of overflow, six times worse than
1.2, and on the homepage only. Diagnosed to the exact element:

```
div.matrix-scroll   width 642   overflow-x: auto     min-width: 0      <- correctly configured
  table.matrix      width 640                        min-width: 640px  <- intentional, leave it
div (no class)      width 642   overflow-x: visible  min-width: auto   <- THE DEFECT
div.annot           width 335
```

The unclassed `div` between `.matrix-scroll` and `.annot` is a flex or grid item carrying the default
`min-width: auto`, so it refuses to shrink below its content width and drags the scroller out with
it. `.matrix-scroll` is doing its job; its parent never lets it narrow.

**1.4 The mark is low-contrast in dark mode.** `assets/lumit-mark.svg` has no `currentColor` and no
`prefers-color-scheme`. The cloud glyph and the `LUMIT` wordmark both read fine on a dark page; it is
the `L` letterform inside the cloud, `fill="#041E49"`, that disappears. **Scope your fix to that fill.
Do not repaint the mark.** It is also the favicon.

## 2. What to build

```
index.html  about/index.html  contact/index.html
engagements/index.html  how-we-work/index.html  services/index.html   MODIFY (masthead only)
styles.css                                                            MODIFY
assets/lumit-mark.svg                                                 MODIFY
```

**Nothing else.** Not `scripts/check_site.mjs`, not `package.json`, not `.gitignore`, not
`.gitattributes`, not `sitemap.xml`, not `robots.txt`, not `.htaccess`, not `docs/**`.

### 2.1 B-006 — the masthead collapses to a toggle below 768px

**Breakpoint: `max-width: 767.98px`.** Chosen from the table in §1.1 — 768 and up is already a
reasonable 106px bar, below it the header balloons.

Below the breakpoint:

- The nav links and the "Book a session" button are hidden behind **one toggle control**.
- The collapsed masthead is **no taller than 80px**.
- Opening the toggle reveals the same six links and the button, in a stacked panel.
- **Nothing overflows horizontally at 320, 360, 375 and 414**, open or closed.

At 768px and above the masthead looks and behaves exactly as it does today. **A desktop screenshot
before and after must be indistinguishable.**

### 2.2 How to build it — three constraints that are not negotiable

**Constraint 1 — the toggle markup and its script go INSIDE `<header class="masthead">`.**

This is deliberate. B-004 compares the whole masthead block byte-for-byte across pages and B-005
counts it exactly once, so putting the new code inside the header means **the gate covers it for
free**. Put it outside and it is ungated.

**Constraint 2 — progressive enhancement, not a JS dependency.**

Use a real `<button>` with `aria-expanded` and `aria-controls`, and a small inline script. The nav
must remain **visible and usable with JavaScript disabled** — hide it only once the script has marked
the header as enhanced, for example by adding a class. A visitor with no JS gets today's tall header,
which is ugly; they must not get a site with no navigation.

**Do not use `<input type="checkbox">` with a `<label>` as the toggle.** It is shorter and it reads
as a form control to assistive technology. RULE 001 also says this site has no form.

**Constraint 3 — zero dependencies, inline only.**

No library, no framework, no external script, no CDN, no `npm install`. The script is inline in the
header. `package.json` keeps no `dependencies` and no `devDependencies` key. RULE 003.

**A note on `<script>` specifically.** The defect that shipped on `contact/index.html` was an
unterminated `<script>` that rendered perfectly for a day. You are adding a `<script>` to six pages.
**Close it, and check each of the six closes it**, because the gate cannot see an unterminated tag —
that gap is known, disclosed in the LWS-P1A-002 review, and not yet fixed.

### 2.3 Defect 1.3 — the homepage scroller

Constrain the unclassed wrapper so `.matrix-scroll` can narrow. `min-width: 0` on that item is the
conventional fix; `max-width: 100%` on `.matrix-scroll` may also be needed.

**Do not change `table.matrix`'s `min-width: 640px`.** That is intentional — the table is meant to
scroll inside its container, not reflow.

**Do not change `index.html` to fix this.** It is a CSS defect. RULE 002.

### 2.4 Defect 1.4 — the mark in dark mode

An SVG loaded through `<img>` honours its own internal `@media (prefers-color-scheme: dark)`, so a
`<style>` block inside `assets/lumit-mark.svg` swapping the `#041E49` letterform for a light value is
a one-file fix.

**Verify that it actually works in a browser before you report it done.** If it does not hold, say so
and stop — do not fall back to inlining the SVG into six pages, because that is a different and much
larger task and it is not in §2.

## 3. What must not regress — read this twice

- **The six mastheads must stay byte-identical to each other**, except for `aria-current="page"`,
  which B-004 normalises away. Author the new markup once and paste the identical block into all six.
  **If you hand-type it six times you will fail B-004.**
- **Exactly one masthead, one closing block and one footer per page.** B-005.
- Imports in `scripts/check_site.mjs` stay `node:fs`, `node:path`, `node:url`. **You are not editing
  that file at all** — it is listed here only so you notice if something you did changes its output.
- Pages stay discovered from the filesystem. The banner stays the first line, the last line stays
  `site check ok` or `site check FAILED: <n> violations`, and a clean tree exits 0.
- **The internal link count must stay 68.** If the toggle duplicates the six nav links into a second
  markup block, it will rise. A rise is a defect in this task unless you can explain it.
- Every page keeps exactly one `<h1>`, one `<title>`, one meta description and one canonical. B-002.

## 4. Counts on a clean tree, after your change

| measure | expected |
|---|---|
| banner | `site check: 6 pages \| 68 internal links \| 6 assets` |
| violations, B-001 to B-005 | **0** |
| exit code | 0 |

**If the link count is not 68, stop and report it before doing anything else.**

## 5. Mutations — four, one at a time, every one reverted

Record the byte count before you touch a file and again after you restore it. **State both numbers
for all four.** There is git here, but you do not run it, so restoration is still yours to prove.

| # | mutation | predicted red | predicted green |
|---|---|---|---|
| M1 | In `about/index.html`, change one word inside the new toggle button's label | **B-004**, header differs | B-001, B-002, B-003, B-005 |
| M2 | In `services/index.html`, delete the toggle `<button>` element only | **B-004**, header differs | B-001, B-002, B-003, B-005 |
| M3 | In `contact/index.html`, duplicate the whole `<header class="masthead">…</header>` | **B-005**, header occurs 2 times. **B-004 must NOT also fire for the header** | B-001, B-002, B-003 |
| M4 | In `how-we-work/index.html`, point one nav `href` at `/nope/` | **B-001**, `/nope/` does not resolve | B-002, B-003, B-004, B-005 |

**M1 and M2 exist to prove the new markup is actually inside the gated block.** If either comes back
green, your toggle is outside `<header class="masthead">` and Constraint 1 is not met. That is a stop
condition, not a curiosity.

**A mutation that comes back green is a result, not a failure.** Report it and stop; do not
strengthen the check to make it red.

## 6. Byte counts — the eleven, before and after

```
.htaccess                      796          <- must not change
index.html                  12,251          <- will change
styles.css                  11,539          <- will change
robots.txt                      73          <- must not change
sitemap.xml                    649          <- must not change
assets/lumit-mark.svg       24,545          <- will change
about/index.html             6,342          <- will change
contact/index.html           5,173          <- will change
engagements/index.html       5,788          <- will change
how-we-work/index.html       6,435          <- will change
services/index.html         16,439          <- will change
scripts/check_site.mjs       9,413          <- must not change
```

Report all twelve at the end of your run, with the delta for each that moved.

**The six HTML deltas must be equal to each other**, because you are pasting the same block into all
six. If they are not, the six mastheads are not identical and B-004 will already have told you.

If a count is off by roughly the number of lines in the file, you have a line-ending conversion, not
an edit — say so and stop.

## 7. Measure it yourself, at these widths

Do not report "looks fine on mobile". For **320, 360, 375, 414, 767 and 768**, on **all six routes**,
with the toggle closed and again open, report:

- `document.documentElement.scrollWidth` versus `document.documentElement.clientWidth`
- the masthead's rendered height
- any element whose `getBoundingClientRect().right` exceeds the viewport width

**Zero horizontal overflow at every width, both states, all six routes.** Masthead height at or under
80px closed, below the breakpoint.

Then check **1100px on all six routes** and confirm the masthead height is still 73px and the layout
is unchanged.

## 8. Report back

1. byte counts before and after for all twelve files in §6, with deltas;
2. the full clean-run output including the banner, and `node -v`;
3. the four mutation results — what went red, what stayed green, before/after byte counts;
4. the §7 measurement table;
5. confirmation that the six masthead blocks are byte-identical, and how you checked;
6. confirmation that the nav still works with JavaScript disabled;
7. confirmation that the dark-mode SVG fix was verified in a browser, and in which browser;
8. residual risks and open questions;
9. anything in this contract you think is wrong, quoted by line.

## 9. Stop and ask if

- the clean tree does not come back with zero violations, or the link count is not 68;
- M1 or M2 comes back green — your markup is outside the gated header;
- M3 fires B-004 for the header as well as B-005 — the B-005 suppression has regressed;
- you cannot restore a mutated file to its exact byte count;
- the six HTML byte deltas are not equal;
- the internal `<style>` approach for the SVG does not work in a real browser;
- you believe any file outside §2 needs to change;
- you find yourself wanting a dependency. You do not need one.
