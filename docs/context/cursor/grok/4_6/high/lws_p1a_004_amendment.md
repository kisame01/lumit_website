Amendment A to Task Contract LWS-P1A-004 — resolve the §2.2 / §2.4 conflict on M5

> ROLE: you implement this amendment. It is one line. Do not change anything else.

Task: LWS-P1A-004, amendment A.
Risk: R1 — one line in one file, which is not a site file.
Repository: `D:\dev\projects\lumit_website`
Behaviour IDs: **B-007** (amended). B-001 to B-006 must not regress.

---

## 1. You were right, and the contract was wrong

Your §7 push-back on M5 is accepted in full. **The contract contradicted itself** and you found the
seam instead of papering over it:

- **§2.2** says: if every non-reference page's block is identical and differs from `index.html`'s,
  emit one violation naming `index.html`.
- **§2.4** says: the LWS-P1A-002 suppression stays exactly as it is — a block failing its count check
  suppresses B-004 for that block on that page.

On M5, `index.html`'s footer count is 0. §2.2 says collapse and report; §2.4 says suppress. Both
cannot hold, and you followed §2.2 literally, reported the conflict by line, and adjusted nothing.
That is exactly right. RULE 002 held.

**§2.4 wins.** `B-005 footer occurs 0 times, expected exactly 1` already reports that defect
precisely. The collapsed B-004 line is a second report of the same defect, which is the thing B-007b
exists to stop — and "differs from the other 5 pages" is the less informative of the two lines for a
block that is simply absent.

## 2. The change — one line

At the **top of the `for (const block of CHROME)` loop**, before `firstBlock` is extracted:

```js
if (!chromeOk.get(first.file)[block.key]) continue;
```

So the loop opens:

```js
  for (const block of CHROME) {
    if (!chromeOk.get(first.file)[block.key]) continue;
    const firstBlock = extractBlock(first.html, block.start, block.end);
    const firstNorm = chromeNorm(firstBlock, block.key);
```

That is the whole amendment. It skips **both** the collapse and the per-page pass for a block whose
count failed on the reference page, which is §2.4's suppression applied to `index.html` for the first
time — the hole that was residual 1 in the LWS-P1A-002 review.

**Do not** instead add the guard inside the collapse branch only. That reintroduces the five-line
`B-004 footer missing` flood from the per-page loop, which is the defect this task removed. This was
measured, not assumed.

## 3. What must not change

- `checkTagBalance`, `BALANCE_TAGS`, `checkChromeCount`, `extractBlock` and `extractBlocks`:
  **untouched**.
- The collapse message stays `B-004 <label> differs from the other <n> pages`.
- Banner first, verdict last, clean tree exits 0, violation lines keep `path:line  BEHAVIOUR message`.
- Imports stay `node:fs`, `node:path`, `node:url`. RULE 003.
- **No site file changes.** Not any `.html`, not `styles.css`, not `assets/**`, not `STATE.md`.

## 4. Byte counts

```
scripts/check_site.mjs       9,978          <- will change, by roughly +56
```

Every other file unchanged. Report the count for `scripts/check_site.mjs` before and after, and
confirm the other thirteen are unmoved.

## 5. Mutations — four, one at a time, every one reverted

| # | mutation | expected after the amendment |
|---|---|---|
| A1 | Delete the `<footer>` block from **`index.html`** | **exactly one** violation: `index.html:1  B-005 footer occurs 0 times, expected exactly 1`. **No B-004 line at all.** |
| A2 | Delete the toggle `<button>` from **`index.html`** | **unchanged** — exactly one `index.html:22  B-004 header differs from the other 5 pages` |
| A3 | Change one word inside `about/index.html`'s footer | **unchanged** — exactly one `about/index.html:107  B-004 footer differs from index.html` |
| A4 | Remove `</script>` from **all six** mastheads | **unchanged** — six `B-007 <script> has 1 start and 0 end tags` |

A1 is the amendment. **A2, A3 and A4 are regression guards** — if any of them changes shape, the guard
has been placed in the wrong scope.

**A mutation that behaves unexpectedly is a result, not a failure.** Report it and stop.

## 6. Report back

1. `scripts/check_site.mjs` before and after, plus confirmation the other thirteen are unmoved;
2. the clean-run output including the banner, and `node -v`;
3. the four mutation results — exact violation lines, counts, exit codes, before/after byte counts;
4. anything here you think is wrong, quoted by line.

## 7. Stop and ask if

- the clean tree does not come back with zero violations, or the link count is not 68;
- A1 still emits a B-004 line;
- A2, A3 or A4 changes shape;
- you cannot restore a mutated file to its exact byte count;
- you believe any file other than `scripts/check_site.mjs` needs to change.
