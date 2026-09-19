Task Contract LWS-P1A-005 — the prose pass, the shared enquiries address, and two carried defects

> ROLE: you implement this contract. You do not write contracts. If a line here looks wrong, say
> which line and why in your report — do not rewrite it and do not hand back a task.

Task: LWS-P1A-005 — fifth task in this repository.
Risk: **R3 — the largest so far.** Four separate changes, all six HTML files, every byte count moves,
and two of the four touch gated chrome. Work in the four phases in §2 and run the gate between them.
Repository: `D:\dev\projects\lumit_website`
Behaviour IDs: none new. **B-001 to B-007 exist and must not regress.**

---

## 0. What changed since LWS-P1A-004, and one decision that was reversed

**The site is live and correct.** `main` is at `b2aac7e…` plus the LWS-P1A-004 merge. The masthead
toggle, the homepage scroller and the dark-mode mark are all deployed and verified from outside.
The gate is at **10,034** bytes and enforces B-001 to B-007 with both LWS-P1A-002 residuals closed.

**You still do not run `git`.** No `add`, no `commit`, no `branch`, no `checkout`, no `stash`.

**`.gitattributes` pins line endings to LF.** RULE 004. Byte counts are the scope-proof mechanism and
this task moves nearly all of them, so a line-ending rewrite here would be invisible noise on top of
real signal. Do not override it.

**A decision was reversed by the owner on 2026-09-19.** `OPEN_DECISIONS.md` previously recorded
"`hello@` was declined in favour of the two named addresses. Settled." and listed it under "do not
re-raise". The owner has now chosen a shared **`enquiries@lumittechnology.com`** instead. That is his
call and it is recorded; **you are implementing the new decision, not the old record.** The record has
been updated in the same commit as this contract.

## 1. The four changes, measured

**1.1 The prose has never been edited, only written.** D-LWS-006. The six pages read as
machine-written in places, em-dashes above all. **RULE 002 applies to prose exactly as it applies to
markup: report what you found before you change a word.**

**1.2 The contact addresses become one shared address.** Four `mailto:` links across two files, and
the reviewer has already located every one of them:

```
index.html:61            mailto:lucian@lumittechnology.com?subject=Landscape%20session
contact/index.html:67    mailto:lucian@lumittechnology.com   (+ the visible text)
contact/index.html:68    mailto:tumi@lumittechnology.com     (+ the visible text)
contact/index.html:75    mailto:lucian@lumittechnology.com?subject=Landscape%20session
```

**All four sit outside the gated chrome** — `index.html`'s masthead is lines 22–52, its closing block
188–195, its footer 196–202; `contact/`'s are 22–52, 97–104 and 106–112. So this change cannot move
B-004 or B-005, and only two files change. Verified by the reviewer, not assumed.

**1.3 No-JS horizontal overflow, 46px at 375px.** With JavaScript disabled, `/contact/` at 375 has
`scrollWidth` **421** against a `clientWidth` of 375. The toggle's whole media block is gated on
`.is-enhanced`, so a visitor with no JS gets the old masthead that never wraps. This was accepted
deliberately in LWS-P1A-003 and is now being fixed.

**1.4 Long-cached assets with no version in the URL.** Live headers, read from the server:

```
styles.css               Cache-Control: public, max-age=604800    (7 days)
assets/lumit-mark.svg    Cache-Control: public, max-age=2592000   (30 days)
HTML                     Cache-Control: public, max-age=0
```

HTML always revalidates; the assets do not. So a returning visitor gets **new markup with a
week-old stylesheet** — which is exactly the half-deployed state this site actually produced for ten
minutes during the last upload, except lasting a week. The fix is a version in the asset URLs.

## 2. What to build — four phases, in this order

```
index.html  about/index.html  contact/index.html
engagements/index.html  how-we-work/index.html  services/index.html   MODIFY
styles.css                                                            MODIFY
```

**Nothing else.** Not `scripts/check_site.mjs`, not `assets/**`, not `package.json`, not
`.gitignore`, not `.gitattributes`, not `sitemap.xml`, not `robots.txt`, not `.htaccess`, not
`docs/**`, not `STATE.md`, not `OPEN_DECISIONS.md`.

**Run `node scripts/check_site.mjs` and record all fourteen byte counts after every phase.** If the
gate goes red, you know which phase did it. That is the entire reason for the phases — do not collapse
them.

### 2.1 Phase 1 — the prose pass

There is a local `anthropic-skills:unslop` skill in the planner's environment; you do not have it, so
work to this brief instead.

**Report before you edit.** Produce the list of what you intend to change — file, line, the text, and
one clause on why — and include it in your report. Then make the changes.

What to remove: em-dashes used as a pause where a comma, a full stop or a colon is correct;
throat-clearing openers; hedges that weaken a claim the business can actually make; puffery and
empty intensifiers; bloated connectives ("in order to", "it is worth noting that"); sentences whose
only job is to introduce the next sentence.

What to leave alone: the meaning, the technical claims, every proper noun, every number, every
`<h1>`, `<title>`, meta description and canonical, and anything inside the `<header>`, the
`<section class="closing">` or the `<footer>` — see §3.

**Do not invent claims.** If a sentence is vague because the underlying fact is vague, leave it and
say so in your report. Cutting is safe; rewriting into a stronger claim than the business made is not.

### 2.2 Phase 2 — the shared address

Replace all four occurrences from §1.2 with `enquiries@lumittechnology.com`, in the `href` **and** in
the visible link text.

`contact/index.html` lines 67–68 are a two-row list keyed "Lucian" and "Tumi". **One shared address
does not want two identical rows.** Collapse them into a single row. The key is the owner's wording
to choose; `Enquiries` is the obvious label. Keep the surrounding `<div class="cline">` /
`<span class="k">` / `<span class="v">` structure exactly as it is.

Keep the `?subject=Landscape%20session` on the two "book a session" buttons.

**Do not add a phone number, a form or a booking link.** RULE 001, and both are parked decisions.

### 2.3 Phase 3 — the no-JS overflow

One rule, and the reviewer has already written and rendered it. Add it as the **first** line inside
the existing `@media (max-width:767.98px){` block, before the `.is-enhanced` rules:

```css
  .masthead-in{flex-wrap:wrap}
```

It is deliberately **not** gated on `.is-enhanced`, because the no-JS visitor is the one who needs it.

Measured by the reviewer on the real pages before this contract was issued:

| | before | after |
|---|---|---|
| no-JS at 375, overflow | 46px | **0** |
| no-JS masthead height | 267.3px | **203.3px** |
| enhanced, closed | 61px | **61px, unchanged** |
| enhanced, open | 351.7px, 6 links | **351.7px, 6 links, unchanged** |

`styles.css` 12,636 → **12,667** (+31) for this phase alone. If your number differs, you have not made
the same change.

### 2.4 Phase 4 — versioned asset URLs

Append `?v=2` to every reference to the two long-cached assets, in all six files:

```
/styles.css              ->  /styles.css?v=2
/assets/lumit-mark.svg   ->  /assets/lumit-mark.svg?v=2
```

That includes the `<link rel="stylesheet">`, the `<link rel="icon">` and **the mark's `<img src>`
inside `<header class="masthead">`**.

**The `<img src>` is inside the gated masthead.** So this edit must be byte-identical across all six
pages or B-004 goes red — which is the gate doing its job. Make the masthead edit once and paste it.

**The gate resolves versioned URLs correctly.** The reviewer tested this before issuing the contract:
with `?v=2` on both assets across all six pages the banner stays `6 pages | 68 internal links |
6 assets` and the run stays green. A genuinely broken asset URL still reports
`B-001 /assets/nope.svg does not resolve`, so the check is live, not merely quiet.

**Do not change `.htaccess`** to shorten the cache lifetimes. Long cache plus a versioned URL is the
correct pairing, and `.htaccess` is not in §2.

## 3. What must not regress — read this twice

- **The six mastheads must stay byte-identical to each other**, except `aria-current="page"`. Phase 4
  edits them. If the prose pass touches a nav label, that must also be identical six times. B-004.
- **The closing block and the footer are shared chrome too.** If Phase 1 rewords a single word inside
  either, it must be reworded identically on all six pages or B-004 goes red. **Easiest safe answer:
  leave the chrome prose alone.** If you believe a chrome sentence must change, change it in all six
  identically and say so in your report.
- **Exactly one masthead, one closing block and one footer per page.** B-005.
- **Every page keeps exactly one `<h1>`, one `<title>`, one meta description and one canonical.**
  B-002. The prose pass is the likeliest task yet to break this by accident.
- **The internal link count must stay 68.** Collapsing the two contact rows into one removes a
  `mailto:`, which is not an internal link, so 68 should hold. **If it moves, stop and report it
  before doing anything else.**
- **Each page keeps exactly one `<script>` and one `</script>`.** B-007 now catches this even if all
  six break identically — do not rely on noticing it yourself.
- Imports in `scripts/check_site.mjs` stay `node:fs`, `node:path`, `node:url`. **You are not editing
  that file.** RULE 003: no dependency, no lockfile.

## 4. Counts — the baseline you start from

```
.htaccess                      796          <- must not change
index.html                  12,862          <- will change
styles.css                  12,636          <- will change
robots.txt                      73          <- must not change
sitemap.xml                    649          <- must not change
assets/lumit-mark.svg       24,646          <- must not change (the URL changes, not the file)
about/index.html             6,953          <- will change
contact/index.html           5,784          <- will change
engagements/index.html       6,399          <- will change
how-we-work/index.html       7,046          <- will change
services/index.html         17,050          <- will change
scripts/check_site.mjs      10,034          <- must not change
package.json                   132          <- must not change
.gitattributes                 902          <- must not change
```

**Report all fourteen after each of the four phases**, with the delta for each that moved.

Unlike LWS-P1A-003, **the six HTML deltas will NOT be equal** — the prose pass differs per page. That
is expected here and is not evidence of a problem. The Phase 4 delta **is** equal across six, because
it is the same substitution; report Phase 4's delta separately so that check survives.

If a count is off by roughly the number of lines in the file, you have a line-ending conversion, not
an edit — say so and stop. RULE 004.

**`String.length` counts UTF-16 units, not bytes.** Removing em-dashes removes three bytes each but
one unit each. Measure bytes.

## 5. Mutations — five, one at a time, every one reverted

Record the byte count before you touch a file and again after you restore it. **State both numbers for
all five.**

| # | mutation | predicted red | predicted green |
|---|---|---|---|
| M1 | In `about/index.html`, change the masthead's `?v=2` to `?v=3` | **B-004**, header differs | B-001, B-002, B-003, B-005, B-007 |
| M2 | In `services/index.html`, change one word inside the `<footer>` | **B-004**, footer differs | B-001, B-002, B-003, B-005, B-007 |
| M3 | In `contact/index.html`, point the stylesheet at `/styles-x.css?v=2` | **B-001**, does not resolve | B-002, B-003, B-005, B-007. **B-004 stays green** — the `<link>` is in `<head>`, outside the chrome |
| M4 | Remove `</script>` from **all six** mastheads | **B-007**, six lines | B-001 to B-005 |
| M5 | Duplicate the whole `<section class="closing">` in `engagements/index.html` | **B-005**, closing block occurs 2 times. **B-004 must NOT also fire for it** | B-001, B-002, B-003, B-007 |

**M1 proves Phase 4's masthead edit is really inside the gated block.** If it comes back green, you
edited the `<img src>` somewhere else or the six are not identical.

**M4 is the LWS-P1A-004 regression guard.** If it comes back green, something about your `<script>`
handling has broken B-007.

**A mutation that comes back green is a result, not a failure.** Report it and stop; do not
strengthen the check and do not change a page to make it green. RULE 002.

## 6. Measure it yourself

For **320, 375, 767 and 768**, on **all six routes**, report `scrollWidth` against `clientWidth` and
the masthead's rendered height, in three states:

1. **JavaScript disabled** — this is the state Phase 3 exists for. **Expect zero overflow at every
   width**, and a masthead of roughly 203px at 375 rather than 267.
2. **JavaScript on, toggle closed** — expect 61px below the breakpoint and zero overflow.
3. **JavaScript on, toggle open** — expect roughly 351.7px at 375, six links plus the button, zero
   overflow.

Then confirm **1100px on all six routes** is unchanged at 73.4px.

Say which browser and version you measured in.

## 7. Report back

1. **The prose report from Phase 1, before-and-after, produced before you edited;**
2. all fourteen byte counts after each of the four phases, with deltas;
3. the full clean-run output including the banner, and `node -v`;
4. the five mutation results — exact violation lines, exit codes, before/after byte counts;
5. the §6 measurement table, and the browser you used;
6. confirmation that the six masthead blocks are byte-identical, and how you checked;
7. confirmation that the internal link count is still 68;
8. residual risks and open questions;
9. anything in this contract you think is wrong, quoted by line.

## 8. Stop and ask if

- the clean tree does not come back with zero violations after any phase;
- **the internal link count is not 68**;
- M1 or M4 comes back green;
- M3 fires B-004, or M5 fires B-004 for the closing block as well as B-005;
- the prose pass would change a technical claim, a number or a proper noun to read better;
- you cannot restore a mutated file to its exact byte count;
- Phase 3's `styles.css` delta is not +31;
- you believe any file outside §2 needs to change;
- you find yourself wanting a dependency. You do not need one.

## 9. Not in this task

**Self-hosting the webfonts (D-LWS-005) is deliberately held back to `LWS-P1A-006`.** Every page
still preconnects to Google and loads a stylesheet from them, which sits awkwardly beside the promise
the contact page makes in writing. It is the most important remaining item and it is also the one most
likely to go wrong visually — format and weight choices, roughly 200 KB of binaries under `assets/`,
and `@font-face` to get right. It does not belong on the end of a four-part contract. It costs one
extra upload later and that is the right trade.
