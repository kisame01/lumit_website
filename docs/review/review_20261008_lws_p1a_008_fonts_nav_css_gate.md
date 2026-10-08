# Review — LWS-P1A-008: self-hosted fonts, one-row tablet nav, CSS-aware gate, B-011

**Reviewed 2026-10-08 by the planner, Claude Opus 5.5 High.** Coder: Cursor running Grok 4.7 High.
**Verdict: accepted.** Every number re-measured on the owner's working tree.

## 1. Scope and exactness

**Every size and SHA-256 in contract §1 and §5 matches** — ten modified files, six new files under
`assets/fonts/`, and the unchanged `robots.txt`, `sitemap.xml`, both SVGs and `package.json`. The four
`.woff2` files are byte-identical to the npm-sourced originals. `scripts/check_site.mjs` 16,729 →
**19,980** (`fa15c49237e4b353`). Nothing under `docs/` touched.

## 2. Gate

`site check: 6 pages | 132 internal links | 10 assets` / `site check ok`, exit 0. **10 assets is the
contract's deliberate new banner** — six `<img>` plus four `url()` fonts.

## 3. Mutations — all ten reproduced, line for line

M1–M10 exactly as predicted and as reported. **M1 is the defect the task exists for**: a font left
out of `.cpanel.yml` is now caught; before this task it passed silently.

**Six more by the reviewer:**

| # | mutation | result |
|---|---|---|
| E1 | `url("/assets/nope.png")`, double-quoted, missing | B-001 — caught |
| **E2** | **`href="HTTPS://fonts.googleapis.com/…"` — upper-case scheme** | **green — not caught** |
| E3 | `<img src="//cdn.example.com/a.png">` | B-011 — caught |
| E4 | `https://www.lumittechnology.com/…` | B-011 — strict: a subdomain is another host. Accepted |
| E5 | `<a href="https://github.com/…">` | green — correct, a link is not a request |
| **E6** | **`<script src='https://…'>` — single-quoted attribute** | **green — not caught** |

**E2 and E6 join LWS-P1A-007's E2** (`style='…'`): the gate reads attributes as `="…"` and schemes in
lower case. None of these spellings exists in the repository, and the contract did not ask for them,
so this is a residual, not a defect. **One small follow-up contract** can make B-010 and B-011
quote- and case-insensitive together.

## 4. Browser — 156 combinations, on the exact bytes from the owner's tree

- **No request to any host but the local server.** Work Sans `100 900` and JetBrains Mono 400, 500,
  700 load from `/assets/fonts/`.
- Zero overflow, zero blank icons, nav visible wherever it should be.
- **Nav on one row at every measured width from 768 to 1240px**; masthead 65.2px from 768 to 1023px,
  67.8px from 1024px, 61px closed below 768px. 18px to spare at 768px.
- Contrast unchanged: lowest 5.37:1 light, 6.61:1 dark.

## 5. Deploy emulation

Eighteen site files land byte-identical — the eleven before, plus four fonts, two licences and the
icon sprite. The stock `php.ini` survives; nothing private reaches `public_html`.

## 6. The coder's report

Accurate in every number checked. Fonts copied with Node's `copyFileSync` and hash-checked. It
disclosed the `url()` regex's `)`-in-`data:` limit and the strict subdomain rule itself.
