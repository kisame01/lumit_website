Task Contract LWS-P1A-001 — a zero-dependency integrity gate for the static site

> ROLE: you implement this contract. You do not write contracts. If a line here looks wrong, say
> which line and why in your report — do not rewrite it and do not hand back a task.

**REVISION 2 — 2026-09-19, by the planner, before issue. Revision 1 was never handed to a coder.**
Four things changed and they are all in your favour: the `contact/index.html` baseline in §7 (the
file was defective and has been corrected — see §0), the link counts in §5, an ambiguity in B-004
that would have made this contract unimplementable as written, and a note on D-LWS-001. **If you
were given revision 1, stop and ask for this one.**

## 0. What changed before you got this, and why it matters to you

`contact/index.html` shipped with a **leaked generator tail**: an unterminated `<script>` holding the
`SERVICES` array and the un-rendered services-page template, followed by a duplicate closing block
and footer. The page rendered — a browser swallows everything after an unclosed `<script>` — so the
defect was invisible in a browser and visible only in the markup.

The planner corrected it on 2026-09-19 by deleting everything from the old line 99 to `</body>`, a
pure deletion with no content rewritten. **16,049 bytes → 5,173 bytes.** Verified after landing.
Three `mailto:` links, the single `<h1>`, the `<title>`, the description and the canonical all
survive unchanged; the only internal link lost was the duplicate `href="/contact/"` inside the
duplicated closing block, which is why §5's total moved from 69 to 68.

**This is why B-004 now counts occurrences as well as comparing them.** A per-page block that
appears twice is a defect in its own right, and revision 1 would have let it through.

Task: LWS-P1A-001 — first task in this repository.
Risk: R1
Repository: `D:\dev\projects\lumit_website`

**THERE IS NO GIT REPOSITORY HERE. DO NOT RUN `git init`. DO NOT COMMIT. DO NOT BRANCH.**
This folder is not under version control and initialising it is the owner's step, not yours. You
work in the working tree and you leave it there. If you reach for `git` at any point, stop and
re-read this paragraph — there is nothing to stage and nothing to revert to, which is also why §6's
restoration discipline is not optional.

Behaviour IDs: B-001, B-002, B-003, B-004 (all new, first use in this repository)

---

## 1. What this is for

The site is six pages of hand-generated static HTML. Nothing currently checks that a link resolves,
that a page has a title, or that `sitemap.xml` describes the pages that actually exist. A broken
internal link would ship silently and stay broken until a prospect found it.

You are building the check that makes those four failures impossible to ship. It has to run with
**`node` and nothing else** — no package manager, no install step, no lockfile.

## 2. What to build — three files

### 2.1 `scripts/check_site.mjs`

An ES module. **Imports are restricted to `node:fs`, `node:path` and `node:url`. Nothing else.** No
`require`, no dependency, no dynamic fetch.

It scans the repository root for the six pages, runs the four checks below, prints a banner, prints
every violation it finds, and exits non-zero if there are any.

**First line of output, always, before anything else:**

```
site check: <pages> pages | <links> internal links | <assets> assets
```

A run that prints violations but no banner is not evidence. Print the banner first, then the
violations, then a final line of either `site check ok` or `site check FAILED: <n> violations`.

**Every violation prints the file, the line number, and what was wrong.** "B-002 failed" is not a
violation report; `about/index.html:14  B-002 canonical is /abut/ but the page is at /about/` is.

The six pages, and their URL paths, are derived from the filesystem — **do not hard-code the list of
six**. A page is any `index.html` at the repository root or one directory below it. Hard-coding the
six means the gate keeps passing on the day somebody adds a seventh page and forgets the sitemap,
which is the day it was supposed to earn its keep.

### 2.2 `package.json`

```
{
  "name": "lumit-website",
  "private": true,
  "type": "module",
  "scripts": {
    "gates": "node scripts/check_site.mjs"
  }
}
```

**No `dependencies` key. No `devDependencies` key. Not empty ones — absent.** No `engines`, no
`packageManager`, no lockfile. One `npm install` in this repository acquires a supply chain it does
not need and a review obligation nobody asked for.

### 2.3 `.gitignore`

`node_modules/`, `.DS_Store`, `Thumbs.db`, `*.log`, `/tmp/`. **Nothing that would exclude a site
file**, and no `docs/` entry — `docs/context/**` is tracked in this project by convention.

## 3. The four checks

### B-001 — every internal link resolves to a file on disk

Collect every `href="/…"` and every `src="/…"` in every page. For each target:

- a path ending `/` resolves to `<path>index.html`
- any other path resolves to the file itself

**Ignore** `mailto:`, `http://`, `https://`, `#` and protocol-relative `//` targets. Do not check
the network; this gate is offline and stays offline.

A target that does not resolve is a violation naming the page, the line and the target.

### B-002 — every page carries its own head

For each page, exactly one of each, and a violation for every miss:

| requirement | failure mode it catches |
|---|---|
| exactly one `<h1>` | a page with two, or with none, reads as broken to a screen reader and to a search engine |
| a `<title>` with non-empty text | a tab labelled with the URL |
| `<meta name="description" content="…">`, content non-empty | search results invent their own summary |
| `<link rel="canonical" href="https://lumittechnology.com<path>">` where `<path>` is the page's own URL path | two URLs competing as the same page |

The canonical check is the one that actually bites: it must compare against the path **derived from
where the file sits**, not against a list.

### B-003 — the sitemap describes reality

Parse `sitemap.xml`, collect every `<loc>`. The set of `<loc>` values must equal, exactly, the set
of `https://lumittechnology.com<path>` for the pages found on disk. Report both directions
separately — a page missing from the sitemap and a sitemap entry with no page are different bugs
with different causes, and lumping them into one message hides which happened.

### B-004 — the shared chrome is actually shared

The six pages each carry their own copy of the masthead, the closing block and the footer. Nothing
keeps them in step.

Extract from each page:

- `<header class="masthead">` … `</header>`
- `<section class="closing">` … `</section>`
- `<footer>` … `</footer>`

**Each of the three must occur exactly once per page. A page carrying two is a B-004 violation on
its own, reported before any comparison is attempted** — do not silently take the first match and do
not concatenate them. This is not hypothetical: `contact/index.html` carried two of the closing block
and two footers until 2026-09-19, and a first-match reading would have called that page clean.

**Before comparing the header, remove every occurrence of the exact string ` aria-current="page"`.**
That attribute legitimately differs per page — it marks the current nav item — and comparing without
normalising it makes B-004 fail on all six pages immediately and permanently. The closing block and
the footer are compared byte-for-byte with no normalisation at all.

Any block that differs from the first page's copy is a violation naming both pages.

## 4. Allowed paths

```
scripts/check_site.mjs    NEW
package.json              NEW
.gitignore                NEW
```

Three new files. **Nothing else.**

**Forbidden, and this is the important half of the contract:**

```
index.html  about/index.html  contact/index.html  engagements/index.html
how-we-work/index.html  services/index.html
styles.css  sitemap.xml  robots.txt  .htaccess  assets/lumit-mark.svg
docs/**
```

Except for the temporary mutations in §6, **not one byte of the site may change**. If a check goes
red, the check is wrong or the site is wrong, and **you report which — you do not edit the site to
make the gate quiet.** A gate that was made to pass by editing the thing it measures has measured
nothing.

## 5. Counts — predicted, and measured from the built output

Quote these in your report and say where each differs.

| measure | predicted |
|---|---|
| pages found | 6 |
| `<h1>` per page | exactly 1, on all six |
| `href="/…"` occurrences, total across six pages | 68 |
| per page: `/` 13 · `/services/` 11 · `/how-we-work/` 11 · `/engagements/` 11 · `/about/` 11 · `/contact/` 11 | |
| distinct internal targets | 8 — `/`, `/about/`, `/contact/`, `/engagements/`, `/how-we-work/`, `/services/`, `/styles.css`, `/assets/lumit-mark.svg` |
| `src="/…"` occurrences | 6, one per page, all `/assets/lumit-mark.svg` |
| `mailto:` links | 4 total — 1 on `/`, 3 on `/contact/` |
| external `href` per page | 4 — two font preconnects, the font stylesheet, the canonical |
| `<loc>` entries in `sitemap.xml` | 6 |
| violations on a clean tree | **0** |

If your count of internal links differs from 68, say so and show the per-page breakdown before
concluding either number is wrong. **Windows has no `grep`** — say whether you used `Select-String`,
`findstr` or Node itself.

## 6. Mutations — five, and every one gets reverted

A gate that has never gone red is a hope. Apply each mutation, run `node scripts/check_site.mjs`,
record what went red, then **restore the file exactly**.

| # | mutation | predicted red | predicted green |
|---|---|---|---|
| M1 | In `about/index.html`, change the nav `href="/services/"` to `href="/servces/"` | B-001, one violation, naming `about/index.html` and `/servces/` | B-002, B-003, B-004 |
| M2 | In `engagements/index.html`, delete the `<meta name="description" …>` line | B-002, one violation | B-001, B-003, B-004 |
| M3 | In `how-we-work/index.html`, change the canonical to `https://lumittechnology.com/how-we-work` (no trailing slash) | B-002, one violation | B-001, B-003, B-004 |
| M4 | In `sitemap.xml`, add `<url><loc>https://lumittechnology.com/pricing/</loc></url>` | B-003, one violation, in the "sitemap entry with no page" direction | B-001, B-002, B-004 |
| M5 | In `contact/index.html`, change one word inside `<footer>` | B-004, naming `contact/index.html` | B-001, B-002, B-003 |

**There is no git here, so there is no `git checkout` to undo a mutation.** Before you touch a file,
record its exact byte count. After restoring it, record the byte count again and **state both
numbers in your report for all five files.** They must match the table in §7. If one does not, say
so loudly — a site file left mutated is the worst possible outcome of this task, and it is
unrecoverable without the owner's zip.

Do not batch the mutations. One at a time, restore, verify, next.

**A mutation that comes back green is a result, not a failure.** Report it and stop; do not
strengthen the check to make it red.

## 7. Byte counts at start and at end — these must be identical

```
.htaccess                      796
index.html                  12,251
styles.css                  11,539
robots.txt                      73
sitemap.xml                    649
assets/lumit-mark.svg       24,545
about/index.html             6,342
contact/index.html           5,173
engagements/index.html       5,788
how-we-work/index.html       6,435
services/index.html         16,439
```

Report all eleven at the end of your run. **Any difference is a defect in this task**, whether or
not the gate passes.

## 8. Gates and report

`node scripts/check_site.mjs` from the repository root. Banner first, `site check ok` last, exit
code 0. Paste the whole output — it is short. Also paste `node -v`.

**No commit. No branch. No `git` anything.** Leave the three new files in the working tree.

Report back:

1. the three new files and their byte counts;
2. the full clean-run output including the banner;
3. every count from §5, with the per-page link breakdown;
4. the five mutation results from §6 — what went red, what stayed green, and the before/after byte
   count for each mutated file;
5. the eleven byte counts from §7, at the end of the run;
6. which tool you used to count (`Select-String`, `findstr` or Node);
7. residual risks and open questions;
8. anything in this contract you think is wrong, quoted by line.

## 9. Stop and ask if

- the clean tree does not come back with zero violations — that means either the check is wrong or
  the site has a real defect, and **which of those it is, is the interesting part**: say which and
  stop, do not fix the site;
- a mutation goes red on a check it was not supposed to touch;
- M4 comes back green — that would mean the sitemap comparison is only checking one direction;
- you cannot restore a mutated file to its exact byte count;
- you believe any file outside §4 needs to change;
- you find yourself wanting to add a dependency for HTML parsing. **You do not need one.** These six
  files were machine-generated from one template, the tags you are looking for are on their own
  lines, and a careful regex over a known generator's output is the right tool. If you disagree, say
  so in your report and implement it with regex anyway.
