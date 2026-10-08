# Review — LWS-P1A-007: the restyle, B-009 and B-010

**Reviewed 2026-10-08 by the planner, Claude Opus 5.5 High.** Coder: Cursor running Grok 4.7 High.
**Verdict: accepted.** Every number re-measured on the owner's working tree, not taken from the report.

## 1. Scope and exactness

**Every file in contract §5 matches its predicted size and SHA-256** — the twelve site files,
`.cpanel.yml` (917), and the unchanged `package.json` / `.gitattributes`. `scripts/check_site.mjs`
14,799 → **16,729** (`e562f342e3d3c837`), 68 lines added, none removed. Nothing under `docs/` or any
record touched. LF throughout.

## 2. Gate

`site check: 6 pages | 132 internal links | 6 assets` / `site check ok`, exit 0, on Node v22.23.2
(coder: v24.14.1). **132 is the contract's deliberate new banner** — 68 links plus 64 icon `<use href>`.

## 3. Mutations — all ten reproduced, line for line

M1–M10 came back exactly as the contract predicted and as the coder reported, including M4's 66
violations (64 × B-001, 2 × B-008, 0 × B-009) and M8's 131-link banner.

**Five more by the reviewer:**

| # | mutation | result |
|---|---|---|
| E1 | `style="…"` on its own line, indented | B-010 — caught |
| **E2** | **`style='…'` with single quotes** | **green — not caught** |
| E3 | the text `style="x"` inside a paragraph | B-010 — false positive, as the coder disclosed |
| E4 | an *unused* symbol removed from the sprite | green — correct |
| E5 | `xlink:href` with a bad fragment | B-009 — caught |

**E2 and E3 are accepted as residuals.** B-010 matches the literal ` style="` — every inline style
ever written in this repository uses double quotes, and a false positive fails loud, not silent.
Tightening it to an attribute-aware match is a one-line change for a later contract if it ever bites.

## 4. Browser — 156 combinations, on the exact bytes from the owner's tree

Six routes × 320/375/767/768/1100 × light/dark × JavaScript on/off × menu open/closed, Chromium with
Work Sans and JetBrains Mono loaded locally:

- **Zero horizontal overflow, zero blank icons, nav visible in every state it should be.**
- Masthead **61px** closed below the breakpoint — unchanged from LWS-P1A-003.
- **WCAG contrast on every visible text and icon: lowest 5.37:1 light, 6.61:1 dark.** The tile
  gradient's light end gives white glyphs 4.35:1 (reference: 2.10:1). Focus ring accent blue on
  light (≥6.3:1), cyan on navy (11:1) — reference finding #4 fixed.
- **Visible text identical on all six pages** except the agreed closing-block comma.

## 5. Deploy emulation

Twelve site files land byte-identical, including `assets/icons.svg`; the stock `php.ini` survives;
nothing private reaches `public_html`.

## 6. The coder's report

Accurate in every number checked. Applied the diff with a throwaway script, 39 of 39 hunks, no git.
It disclosed the B-010 text false positive itself.

## 7. Reference findings §6.1 — status

All twelve resolved as the decision record required: `enquiries@` kept; no-JS nav kept; toggle
script inside the masthead; focus ring and tile contrast fixed; 767.98px kept; six routes and live
nav labels kept; real mark kept; dark variant of every token; no `style` attributes (now gated);
live title and description; every decorative icon `aria-hidden="true" focusable="false"`.
