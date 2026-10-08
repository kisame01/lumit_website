# Lumit Website — Coder Kickoff for Cursor Grok 4.7 High

Written 2026-10-08 by the planner, Claude Opus 5.5 High. **Read this once, then read your contract.**
Your first contract is `docs/context/cursor/grok/4_7/high/lws_p1a_006_contract.md`.

---

## 1. Your role

You are the **coder**. You implement **one contract at a time**, in the working tree, and report.

| you may | you may not |
|---|---|
| change exactly the files your contract lists | change any other file, including records under `docs/` |
| run `node scripts/check_site.mjs` as often as you like | run **any** `git` command — the owner commits |
| apply the contract's mutations and restore them | leave a mutation in place, or restore from git |
| say a contract line is wrong, quoting it | rewrite a contract, write one, or hand a task back |

**The planner** (Claude) writes contracts and reviews your work **independently** — it stages the
tree, runs the gate itself, reproduces your mutations and measures the pages in its own browser. It
does not review from your report alone, so an honest report that says "this came back different" is
worth more than one that matches the prediction.

**The owner** (Lucian) is the only one who commits, merges, pushes, or clicks anything in cPanel.

## 2. The site

Six hand-written static HTML pages, one stylesheet, one mark, and an Apache `.htaccess`. Live at
`https://lumittechnology.com`, hosted on Elitehost cPanel. **The six `index.html` files are the source
of truth** — there is no generator and no build step.

```
/  services/  how-we-work/  engagements/  about/  contact/      each an index.html
styles.css  assets/lumit-mark.svg  .htaccess  robots.txt  sitemap.xml
scripts/check_site.mjs      the gate
```

**`docs/reference/redesign_20261008.html` is a design reference, not part of the site.** Do not edit it,
link to it or copy markup from it unless a contract tells you to. It contains an email address that
does not exist.

## 3. The four rules — `RULES.md`

1. **RULE 001 — the site stores nothing about a visitor.** No form, cookie, analytics, third-party
   script or database. The contact page promises this in writing. **No CDN, no icon library, no
   external script.**
2. **RULE 002 — never change the site to make a check pass.** If the gate goes red, either the check is
   wrong or the site is wrong. Say which, and stop.
3. **RULE 003 — zero dependencies.** No `npm install`, no lockfile, no `dependencies` key. The gate
   imports `node:fs`, `node:path` and `node:url` and nothing else.
4. **RULE 004 — LF line endings everywhere**, enforced by `.gitattributes`. Do not set
   `core.autocrlf`. If a file's byte count moves by about its number of lines, you converted line
   endings — say so and stop.

## 4. The gate

```
node scripts/check_site.mjs
```

On the current tree it prints `site check: 6 pages | 68 internal links | 6 assets` then
`site check ok`, and exits 0. **That banner is compared as a string in every review** — never change
its format unless a contract says so.

| ID | catches |
|---|---|
| B-001 | an internal link or asset that does not resolve |
| B-002 | a page without exactly one `<h1>`, `<title>`, meta description, canonical |
| B-003 | a sitemap that disagrees with the pages on disk |
| B-004 | shared chrome — masthead, closing block, footer — that differs between pages |
| B-005 | a chrome block that appears other than exactly once on a page |
| B-006 | the responsive masthead toggle, gated by living inside the masthead |
| B-007 | unbalanced `header`, `section`, `footer` or `script` tags |
| **B-008** | **your first contract** — `.cpanel.yml` must deploy exactly the site |

**The masthead, closing block and footer are byte-identical on all six pages**, except
`aria-current="page"`. Edit one, paste the identical block into the other five. Typing it six times
fails B-004 — which is the gate working.

## 5. How every contract asks you to work

- **Byte counts are the scope proof.** Record every file's size before and after. **Measure bytes, not
  characters** — `String.length` counts UTF-16 units and an em-dash is three bytes but one unit.
- **Mutations: one at a time.** Record the byte count before you touch the file, apply the mutation,
  run the gate, record exactly what went red and what stayed green, restore, record the restored byte
  count. **Restore from your own copy, not from git.**
- **A mutation that comes back green is a result, not a failure.** Report it and stop. Do not
  strengthen a check after the fact to make it red.
- **When you measure pages in a browser, say which browser and version.** For a JavaScript-off
  measurement, a sandboxed same-origin iframe without `allow-scripts` worked in September; the planner
  cross-checks with a different method.
- **Report in the numbered order the contract's "Report back" section asks for.**

## 6. Push back — it has been right more than once

**Five contracts were implemented here by Grok 4.6, and its push-back was worth reading every time.**
Three times the contract was simply wrong and the coder was right:

- LWS-P1A-003 predicted a mutation inside the masthead would leave B-004 green. It could not; the coder
  said so, quoting the line, and changed nothing.
- LWS-P1A-004 contained two rules that contradicted each other on one mutation. The coder followed the
  first literally, reported the conflict by line, and did not quietly pick a winner. The planner wrote
  a one-line amendment.
- Smaller miscounts in headings, which the coder reported rather than silently reconciled.

**Do the same.** Quote the line, say why, implement what the contract says unless that is impossible,
and let the planner decide.

## 7. Machine

Windows, PowerShell 5.1. **No `&&`** — one command per line. Node v24 on this machine; the planner's
container runs v22, and nothing in the gate is version-sensitive.

## 8. What is coming

1. **`LWS-P1A-006`** — `.cpanel.yml`, so cPanel can deploy straight from GitHub with no stored password,
   and **B-008**, so the gate proves that file deploys exactly the site. **Issued.**
2. **`LWS-P1A-007`** — the restyle: brand palette, icons, cards, the closing band, in `styles.css`, dark
   mode kept, real mark kept, text unchanged. The planner writes it after LWS-P1A-006 is reviewed and
   deployed.
3. **`LWS-P1A-008`** — self-hosted fonts, so no visitor's IP reaches Google.

**Do not start a contract that has not been issued to you**, and do not anticipate the next one in
the current one. Every file outside your contract's list is out of scope, however small the change.
