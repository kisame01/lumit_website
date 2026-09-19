Task Contract LWS-P1A-004 — B-007, the two gate residuals

> ROLE: you implement this contract. You do not write contracts. If a line here looks wrong, say
> which line and why in your report — do not rewrite it and do not hand back a task.

Task: LWS-P1A-004 — fourth task in this repository.
Risk: **R1 — one file, and it is not a site file.** No page changes, no byte count on the site moves,
no upload is needed when this merges.
Repository: `D:\dev\projects\lumit_website`
Behaviour IDs: **B-007** (new). B-001 to B-006 exist and must not regress.

---

## 0. What changed since LWS-P1A-003, and why this task comes before the prose pass

**LWS-P1A-003 shipped a `<script>` into all six pages.** It was reviewed, reproduced and approved —
see `docs/review/review_20260919_lws_p1a_003_b006.md`. The masthead now carries a toggle button and a
13-line inline script, pasted byte-identically into six files.

**That is exactly the shape the gate cannot see.** During the review the reviewer deleted `</script>`
from all six pages at once and the gate printed:

```
site check: 6 pages | 68 internal links | 6 assets
site check ok
```

Exit 0, with a broken `<script>` on every page of a live site. B-004 compares the six chrome blocks
**to each other**, so six identical breakages agree perfectly and nothing fires. Delete it from one
page and B-004 does catch it — but one pasted block edited once is the only way this script will ever
change, so the identical-six case is the realistic one, not the exotic one.

**This is the same defect that actually shipped on `contact/index.html`** — an unterminated `<script>`
that rendered perfectly for a day.

The prose pass edits all six HTML files in one sweep and runs straight through the B-004/B-005 chrome
comparison. **Harden the gate first, then do the prose pass with a gate that can see this.** The prose
pass becomes `LWS-P1A-005`.

**Note for the planner, not for you:** `STATE.md` needs four corrections once this merges — the byte
baseline, the three "Open" layout defects now closed, the claim that no HTML byte count moves, and
the "Next" row that calls the residuals `B-006` when `B-006` is the responsive masthead and these are
`B-007`. Not your task. Do not edit `STATE.md`.

## 1. The two residuals, measured

Both were found by reviewer mutations, both were disclosed honestly by the implementer of the task
that produced them, and both are **correct-as-built** against the contracts that specified them. This
task changes the specification, not a bug.

**1.1 An unterminated tag is invisible.** The extraction counts complete start-plus-end pairs, so an
unbalanced tag is simply not seen. Three reproductions:

| mutation | gate says | should say |
|---|---|---|
| `</script>` removed from all six mastheads | `site check ok`, exit 0 | red |
| `<footer>` appended with no `</footer>` before `</body>` | `site check ok`, exit 0 | red |
| `</script>` removed from one page only | `B-004 header differs` — red, but for the wrong reason | red, and say why |

**1.2 One defect on the reference page reports N−1 times.** `chromeOk` is consulted only for
`loaded.slice(1)`, so `index.html` is never compared to anything. Delete the toggle button from
`index.html` and the gate emits **five** `B-004 header differs from index.html` lines — one for each
other page — for a single edit to a single file. It goes red loudly, which is the job. It reports one
defect five times, and it names the five innocent pages while the guilty one is silent.

## 2. What to build

```
scripts/check_site.mjs                                                MODIFY
```

**Nothing else.** Not any `.html`, not `styles.css`, not `assets/**`, not `package.json`, not
`.gitignore`, not `.gitattributes`, not `sitemap.xml`, not `robots.txt`, not `.htaccess`, not
`docs/**`, not `STATE.md`.

**If you find yourself wanting to change a page to make the gate pass, stop. That is RULE 002 and it
is the rule this repository exists to keep.**

### 2.1 B-007a — tag balance inside every page

For each page, count occurrences of the start tag and the end tag for each of:

```
<header  …  </header>
<footer  …  </footer>
<script  …  </script>
```

and whichever element delimits the closing block (read the current `extractBlock` /
`extractBlocks` to see which — **do not invent a new one**).

**If a start count and its end count differ, that is a B-007 violation**, reported once per page per
tag name, with the page, the line of the first unmatched start tag, and both counts:

```
contact/index.html:38  B-007 <script> has 1 start and 0 end tags
```

Match start tags as `<name` followed by whitespace, `>` or `/`, so `<header` does not match
`<headerish`. Case-insensitively, because HTML is.

**This is a whole-page check, not a chrome-block check.** The `<script>` that broke
`contact/index.html` was inside the page, and the one this repository now ships is inside the
masthead; a check scoped to extracted blocks would have missed the first one.

### 2.2 B-007b — collapse a reference-page chrome defect to one violation

Today every page is compared to `index.html` and `index.html` is compared to nothing.

**New rule.** For each chrome block, after normalising away `aria-current="page"`:

- If **every** non-reference page's block is identical to every other non-reference page's block, and
  they differ from `index.html`'s, then **`index.html` is the odd one out**. Emit exactly **one**
  violation, naming `index.html`:

  ```
  index.html:22  B-004 header differs from the other 5 pages
  ```

- Otherwise, behave exactly as today: one violation per page that differs from `index.html`.

That is the whole rule. **Do not try to be cleverer than that** — a majority vote across three
different variants is not wanted and is not testable.

### 2.3 What must not change about the output

- The banner stays the **first** line and keeps its exact format:
  `site check: 6 pages | 68 internal links | 6 assets`.
- The last line stays `site check ok` or `site check FAILED: <n> violations`.
- A clean tree exits **0**. Any violation exits **1**.
- Existing violation lines keep their current wording, `path:line  BEHAVIOUR message`. **B-007's lines
  follow the same shape.** Do not restyle the others.
- Pages are still discovered from the filesystem. Nothing is hard-coded to six.
- Imports stay `node:fs`, `node:path`, `node:url`. **RULE 003: no dependency, no lockfile, no
  `npm install`.** `package.json` keeps no `dependencies` and no `devDependencies` key.

### 2.4 Order of evaluation

B-007a runs **before** the chrome comparison and **does not suppress it** — an unterminated tag and a
drifted block are different defects and both should report. B-007b is a change to how B-004 reports,
not a new pass.

The B-005 suppression added in LWS-P1A-002 stays exactly as it is: a block failing its count check
suppresses B-004 for that block on that page. **Do not touch it.** M6 below is there to prove you
did not.

## 3. Counts on a clean tree, after your change

| measure | expected |
|---|---|
| banner | `site check: 6 pages \| 68 internal links \| 6 assets` |
| violations, B-001 to B-007 | **0** |
| exit code | 0 |

**The clean tree must stay green.** If B-007a fires on the tree as it stands, you have a real defect
on a live site — **stop and report it before changing anything**, because that is a finding, not a
bug in your check.

## 4. Byte counts

```
scripts/check_site.mjs       9,413          <- will change
```

Everything else must be unchanged. Report the count for all thirteen files below, before and after,
with a delta for the one that moved:

```
.htaccess 796 · index.html 12,862 · styles.css 12,636 · robots.txt 73 · sitemap.xml 649
assets/lumit-mark.svg 24,646 · about/ 6,953 · contact/ 5,784 · engagements/ 6,399
how-we-work/ 7,046 · services/ 17,050 · package.json 132 · .gitattributes 902
```

**These are the post-LWS-P1A-003 numbers, not the ones in the older records.** If a site file's count
moves in this task, you have edited something in §2's "nothing else" list.

If a count is off by roughly the number of lines in the file, you have a line-ending conversion, not
an edit — say so and stop. RULE 004.

## 5. Mutations — six, one at a time, every one reverted

Record the byte count before you touch a file and again after you restore it. **State both numbers for
all six.** There is git here; you do not run it. Restoration is yours to prove.

| # | mutation | predicted red | predicted green |
|---|---|---|---|
| M1 | Remove `</script>` from the masthead of **all six** pages | **B-007**, `<script>` unbalanced, once per page — six lines | B-001 to B-005 |
| M2 | Remove `</script>` from `about/index.html` **only** | **B-007** for `about/` **and** B-004 header differs | B-001, B-002, B-003, B-005 |
| M3 | Append `<footer>` with no `</footer>` before `</body>` in `engagements/index.html` | **B-007**, `<footer>` unbalanced | B-001 to B-005 |
| M4 | Delete the toggle `<button>` from **`index.html`** | **exactly one** B-004 line, naming `index.html` | B-001, B-002, B-003, B-005, B-007 |
| M5 | Delete the `<footer>` block from **`index.html`** | **one** B-005 for `index.html`. **B-004 must not also fire for the footer** | B-001, B-002, B-003 |
| M6 | Change one word inside `about/index.html`'s footer | **exactly one** B-004 line, naming `about/index.html` | B-001, B-002, B-003, B-005, B-007 |

**M1 is the one this task exists for.** If it comes back green, B-007a is not doing its job.

**M4 is the collapse.** Before this task it produced five lines. It must now produce one, and that one
must name `index.html`, not the innocent pages.

**M6 is the regression guard.** An ordinary single-page drift must behave exactly as it does today.
If M6 starts naming `index.html`, §2.2's rule has been applied backwards.

**M5 proves you did not disturb the LWS-P1A-002 suppression.** Note it currently also emits five
`B-004 footer missing` lines; under §2.2 the footer is missing from the reference and present and
identical on the other five, so **expect one B-005 and no B-004 flood**. If you get a different shape,
report exactly what you got — do not adjust §2.2 to produce the predicted shape.

**A mutation that comes back green is a result, not a failure.** Report it and stop; do not
strengthen the check to make it red, and do not change a page to make it green.

## 6. Do not regress B-006

The masthead toggle shipped in LWS-P1A-003 is gated by B-004 because it lives inside
`<header class="masthead">`. Run one extra check to prove your edit did not loosen that:

**M7 — change `===` to `==` inside the inline script body of `engagements/index.html`.**
Expect `B-004 header differs from index.html`, exactly one violation. 6,399 → 6,398 → 6,399.

If that comes back green after your change, the chrome extraction has been narrowed and the toggle
script is no longer gated. **Stop condition.**

## 7. Report back

1. byte counts before and after for all thirteen files in §4, with the delta for the one that moved;
2. the full clean-run output including the banner, and `node -v`;
3. the seven mutation results — exact violation lines, counts, exit codes, before/after byte counts;
4. how you matched start and end tags, quoted from your code, and why it does not match `<headerish>`;
5. confirmation that the B-005 suppression from LWS-P1A-002 is untouched, and how you checked;
6. residual risks and open questions;
7. anything in this contract you think is wrong, quoted by line.

## 8. Stop and ask if

- the clean tree does not come back with zero violations, or the link count is not 68;
- **B-007a fires on the unmodified tree** — that is a real defect on a live site, not a check bug;
- M1 comes back green;
- M4 or M6 names the wrong file;
- M5 changes shape in a way §5 did not predict;
- M7 comes back green — you have narrowed the chrome extraction;
- you cannot restore a mutated file to its exact byte count;
- you believe any file outside §2 needs to change;
- you find yourself wanting a dependency. You do not need one.
