# Review — 2026-09-19 — LWS-P1A-001, the site integrity gate

**Coder:** Cursor / grok 4.6 High Fast · **Reviewer:** the planner (Claude Opus 5 High)
**Verdict: APPROVE**, with one follow-up raised as `LWS-P1A-002`.

---

## 0. A race I caused, and it is mine

The coder's report quotes `contact/index.html` at 16,049 bytes, 69 internal links and `/contact/` 12.
Those numbers are **not wrong — they are stale**, and the reason is a mistake of mine.

Reconstructed from file mtimes:

| when (epoch ms) | what |
|---|---|
| 1789803590121 | coder writes `scripts/check_site.mjs`, `package.json`, `.gitignore` |
| 1789803619813 – 620105 | coder runs M1–M5 and restores each file |
| **1789803662667** | **planner lands the `contact/index.html` fix, 16,049 → 5,173** |
| **1789803763363** | **planner lands contract revision 2** |

The coder was already running when I committed the fix and the revised contract. It read revision 1
and the pre-fix tree, which is why it cites "line 183" — a revision 1 line number — and why its
residual risk 7 describes a duplicated footer that no longer exists. **Every number in its report was
true at the moment it was measured.** I should have held the contract until the fix had landed, or
landed the fix before asking for the contract to be issued. Recorded so it is not repeated.

## 1. Scope — clean, proven by before-and-after listing

**Created, and nothing else:** `scripts/check_site.mjs` (8,016), `package.json` (132),
`.gitignore` (46). Exactly §4's three allowed paths.

**Mutated and restored, all matching §7 exactly:** `about/index.html` 6,342 · `engagements/index.html`
5,788 · `how-we-work/index.html` 6,435 · `sitemap.xml` 649 · `contact/index.html` 16,049.

**Untouched, mtimes still at the original unpack:** `index.html`, `styles.css`, `robots.txt`,
`.htaccess`, `assets/lumit-mark.svg`, and the whole of `docs/`.

**No site file was edited to make the gate pass.** RULE 009 holds.

## 2. Verified by running it, not by reading the report

The planner staged the three new files and the whole site into the container and ran the gate there.

```
site check: 6 pages | 68 internal links | 6 assets
site check ok
exit 0
```

68, not 69, because the fix removed the duplicated closing block's own `href="/contact/"`. The banner
is derived from the filesystem, so it self-corrected — which is the behaviour §2.1 asked for.

Checked by reading the source, not by trusting the report:

- imports are `node:fs`, `node:path`, `node:url` and nothing else; no `require`, no dynamic fetch;
- `package.json` has **no** `dependencies` and **no** `devDependencies` key, not empty ones;
- `.gitignore` excludes no site file and carries no `docs/` entry;
- pages are discovered by `readdirSync`, **not hard-coded** — the seventh page will be caught.

## 3. The coder was right and the contract was wrong

Report §8 challenges M1's predicted-green column, which listed B-004. Reproduced in the container:

```
about/index.html:30  B-001 /servces/ does not resolve
about/index.html:22  B-004 header differs from index.html
```

Identical to the coder's output, line numbers included. The only `/services/` link on that page is
the nav item **inside `<header class="masthead">`**, so breaking it is both a dead link and a header
that no longer matches. **The check is right; my prediction was wrong.** The coder declined to weaken
B-004 to make the prediction true, said so, and restored the file exactly. That is the behaviour the
contract was written to get.

M2, M3, M4 and M5 each went red on exactly the predicted check and green elsewhere. M4 red in the
sitemap-entry-with-no-page direction confirms the comparison runs both ways.

## 4. The one real gap — `LWS-P1A-002`

The coder disclosed it in residual risk 7 and it is genuine. `extractBlock` takes the **first** match,
so a page carrying two chrome blocks is compared on its first and the second is never gated. Proven,
not assumed — a second, completely different `<footer>` was appended to `about/index.html` and the
gate returned:

```
site check: 6 pages | 68 internal links | 6 assets
site check ok
```

Green. This is the occurrence rule contract revision 2 added, which the coder never received.

**It is preventive, not corrective.** The only page that carried duplicated chrome was
`contact/index.html`, and that is fixed. Nothing on the current tree is un-gated. So it does not
block the first commit — it becomes commit two.

## 5. Approved on these terms

1. The three new files are accepted as they stand.
2. `LWS-P1A-002` adds the occurrence rule — each of header, closing block and footer must appear
   exactly once per page, reported before any comparison — plus a sixth mutation that duplicates a
   block and must go red.
3. Contract revision 3 corrects M1's predicted-green column, crediting the coder.
4. The gate has now been run against the current tree and is green. `git init`, the first commit and
   the push are unblocked.
