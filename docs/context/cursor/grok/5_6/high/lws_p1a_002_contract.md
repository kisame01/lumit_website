Task Contract LWS-P1A-002 — B-005, the shared chrome must appear exactly once per page

> ROLE: you implement this contract. You do not write contracts. If a line here looks wrong, say
> which line and why in your report — do not rewrite it and do not hand back a task.

Task: LWS-P1A-002 — second task in this repository.
Risk: R1
Repository: `D:\dev\projects\lumit_website`
Behaviour IDs: **B-005** (new). B-001 to B-004 exist and must not regress.

---

## 0. What changed since LWS-P1A-001, and one thing you were right about

**This repository is now under version control.** `main` is at
`07382f288f5e3b03c378b87f2d0cf84e4aabc66d` and pushed to `https://github.com/kisame01/lumit_website`.

**You still do not run `git`.** No `add`, no `commit`, no `branch`, no `checkout`, no `stash`. Leave
your work in the working tree; the owner commits it. This is not because `git` is dangerous — it is
because a coder that commits its own work removes the only point at which anybody else looks at it.

**`.gitattributes` now pins line endings to LF.** Do not override it and do not set `core.autocrlf`
for this repository. Byte counts are the scope-proof mechanism here and a line-ending rewrite moves
every one of them at once. RULE 004.

**Two contract errors from LWS-P1A-001, both yours to be credited with:**

1. **You were right about M1.** Revision 2's predicted-green column listed B-004, and it should not
   have. The only `/services/` link on `about/index.html` is the nav item inside
   `<header class="masthead">`, so breaking it is both a dead link and a header that no longer
   matches. The reviewer reproduced your exact output, line numbers included. **The check was right
   and the contract was wrong.** You declined to weaken B-004 to make the prediction true and said so
   in your report, which is exactly the behaviour these contracts are written to get.
2. **`contact/index.html` is now 5,173 bytes, not 16,049.** It had shipped with a leaked generator
   tail — an unterminated `<script>` and a duplicated closing block and footer. The planner removed it
   while you were mid-run, which is why your report's counts were stale. That was the planner's
   mistake, not yours. The site-wide internal link total is now **68**.

**Your residual risk 7 is this contract.** You disclosed that `extractBlock` takes the first match, so
a page carrying two chrome blocks is compared on its first and the second is never gated. The
reviewer proved it — a second, completely different `<footer>` appended to `about/index.html` and the
gate still printed `site check ok`. That gap is what you are closing.

## 1. What to build — one file changes

```
scripts/check_site.mjs    MODIFY
```

**Nothing else.** Not `package.json`, not `.gitignore`, not `.gitattributes`, not a site file, not
`docs/**`, not a new file anywhere.

## 2. B-005 — each shared block occurs exactly once per page

For every page, count the occurrences of each of:

- `<header class="masthead">` … `</header>`
- `<section class="closing">` … `</section>`
- `<footer>` … `</footer>`

**Exactly one of each. Zero is a violation. Two or more is a violation.** Report it naming the page,
the line of the *second* occurrence where there is one, the block, and the count:

```
about/index.html:104  B-005 footer occurs 2 times, expected exactly 1
services/index.html:1  B-005 closing block occurs 0 times, expected exactly 1
```

**B-005 is evaluated before B-004 on that page, and when B-005 fails for a block, B-004 is not
evaluated for that block at all.** A page with two footers has no single footer to compare, and
emitting "footer differs" alongside "footer occurs 2 times" reports one defect as two.

Counting is on the same extraction B-004 already uses. **Do not add a dependency and do not swap in
an HTML parser** — these files are machine-generated from one template and the tags are on their own
lines. If you disagree, say so in your report and implement it with regex anyway.

## 3. What must not regress

Imports stay `node:fs`, `node:path`, `node:url` and nothing else. `package.json` keeps no
`dependencies` and no `devDependencies` key. Pages stay discovered from the filesystem, never
hard-coded. The banner stays the first line of output, the last line stays `site check ok` or
`site check FAILED: <n> violations`, and a clean tree still exits 0.

## 4. Counts on a clean tree — quote these and say where any differs

| measure | expected |
|---|---|
| banner | `site check: 6 pages \| 68 internal links \| 6 assets` |
| violations, all of B-001 to B-005 | **0** |
| exit code | 0 |

**If the clean tree does not come back with zero violations, stop.** Either your B-005 is wrong or
the site has a real defect, and which of those it is, is the interesting part. **Do not edit the
site.**

## 5. Mutations — four, one at a time, every one reverted

Record the byte count before you touch a file and again after you restore it. **State both numbers
for all four.** There is git here now, but you do not run it, so restoration is still yours to prove.

| # | mutation | predicted red | predicted green |
|---|---|---|---|
| M1 | In `about/index.html`, append a second `<footer>…</footer>` with different text immediately before `</body>` | **B-005**, one violation, footer, count 2 | B-001, B-002, B-003, B-004 |
| M2 | In `engagements/index.html`, duplicate the whole `<section class="closing">…</section>` block | **B-005**, one violation, closing block, count 2 | B-001, B-002, B-003, B-004 |
| M3 | In `how-we-work/index.html`, delete the `<footer>…</footer>` block entirely | **B-005**, one violation, footer, count 0 | B-002, B-003. **B-004 must NOT also fire for the footer** — see §2 |
| M4 | In `about/index.html`, change one word inside `<footer>` | **B-004**, footer differs | B-001, B-002, B-003, **B-005** |

M3 and M4 together are the point of §2: M3 proves B-005 suppresses B-004 for that block, M4 proves
suppressing B-005's siblings did not switch B-004 off.

**A mutation that comes back green is a result, not a failure.** Report it and stop; do not
strengthen the check to make it red.

## 6. Byte counts at start and at end — identical, and note the new contact figure

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

Report all eleven at the end of your run. **Any difference is a defect in this task**, whether or not
the gate passes. If a count is off by roughly the number of lines in the file, you have a line-ending
conversion, not an edit — say so and stop.

## 7. Report back

1. `scripts/check_site.mjs` byte count before and after;
2. the full clean-run output including the banner, and `node -v`;
3. the four mutation results — what went red, what stayed green, before/after byte counts;
4. the eleven byte counts from §6 at the end of the run;
5. confirmation that `package.json`, `.gitignore` and `.gitattributes` are untouched;
6. residual risks and open questions;
7. anything in this contract you think is wrong, quoted by line.

## 8. Stop and ask if

- the clean tree does not come back with zero violations;
- M3 fires B-004 for the footer as well as B-005 — that means §2's suppression is not implemented;
- M4 does not fire B-004 — that means the suppression went too far and switched B-004 off;
- you cannot restore a mutated file to its exact byte count;
- you believe any file outside §1 needs to change;
- you find yourself wanting a dependency. You do not need one.
