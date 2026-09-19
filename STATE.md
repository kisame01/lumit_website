# State

**As at 2026-09-19, after LWS-P1A-003 shipped to the live site and LWS-P1A-004 closed both gate
residuals.**

## Where things are

- **The site is live at `https://lumittechnology.com` and the mobile fix is deployed.** All ten
  served files were re-fetched from outside after the upload and every byte count matches the
  repository. `docs/decision/decision_20260919_site_live.md`.
- **The masthead works on a phone.** Measured on the live site at 375×812: the homepage is
  **375px wide** (was 662) and the masthead is **61px closed** (was 290). The toggle opens to six
  links and the button at 351.7px and closes back to 61px.
- `scripts/check_site.mjs` (**10,034**) passes: `6 pages | 68 internal links | 6 assets`, zero
  violations across B-001 to B-007.
- **In version control.** `main` at `b2aac7edf56c32f52f750ab201a1a314dc6dc613`, pushed to
  `https://github.com/kisame01/lumit_website`. **LWS-P1A-004 and its Amendment A are in the working
  tree and not yet committed.**
- **Branch protection on `main` is not yet on.** When it goes on: **block force pushes and block
  deletions only.** Not "require a pull request" — the owner is the sole committer.
- `.gitignore` is **63** bytes; `/Claude outputs/` was added so a stray root folder is not committed.

## Byte counts — the current baseline

```
.htaccess 796 · index.html 12,862 · styles.css 12,636 · robots.txt 73 · sitemap.xml 649
assets/lumit-mark.svg 24,646 · about/ 6,953 · contact/ 5,784 · engagements/ 6,399
how-we-work/ 7,046 · services/ 17,050 · scripts/check_site.mjs 10,034
package.json 132 · .gitattributes 902 · .gitignore 63
```

The six HTML files each moved **+611** in LWS-P1A-003 — equal deltas, because one masthead block was
pasted into all six. Confirmed identical on disk and on the live server. RULE 004 held end to end.

## Mail — three of four done

| record | state |
|---|---|
| SPF | `v=spf1 +a +mx +ip4:164.160.91.16 include:spf.zamailgate.com ~all` — correct |
| DKIM | `default._domainkey`, 2048-bit RSA — correct |
| MX | `0 mail.lumittechnology.com.` — correct |
| **DMARC** | **`v=DMARC1; p=none;` — no `rua=`. Still open.** |

Re-queried 2026-09-19 through **two independent resolvers**, `dns.google` and `cloudflare-dns.com`,
both returning full TTL 14400. **This is not resolver cache — the record has not been edited.** It
needs an **edit**, not a second record; two DMARC records on one name is treated as no policy at all.
Target value: `v=DMARC1; p=none; rua=mailto:lucian@lumittechnology.com; fo=1`.

**A real mail round trip was completed** — outside address in to `lucian@`, reply back out, both
arrived. 2026-09-19.

Certificate: AutoSSL for the apex, `www` and eight service subdomains, to 17 Dec 2026, auto-renewing.

## Done this session

- **LWS-P1A-003 approved, merged and deployed.** B-006, the responsive masthead toggle, plus the
  homepage scroller and the dark-mode mark. Reviewer reproduced all four contract mutations, ran four
  of its own, and re-measured the full 84-row grid in a second browser.
  `docs/review/review_20260919_lws_p1a_003_b006.md`.
- **LWS-P1A-004 approved, plus Amendment A.** B-007: an unterminated tag is now caught even when it
  is identical on all six pages, and a chrome defect on the reference page reports once instead of
  five times. **Both residuals from the LWS-P1A-002 review are closed.**
  `docs/review/review_20260919_lws_p1a_004_b007.md`.
- The three mobile layout defects and the tall masthead are all fixed and verified on the live site.
- Deployment lesson recorded below.

## The deployment, and what went wrong with it

The first upload **half-landed**. The five page folders got their new `index.html`; the root
`index.html`, root `styles.css` and `assets/lumit-mark.svg` did not. Caught from outside by comparing
`Last-Modified` — the three failures still carried the morning's 08:36 and 08:42 stamps while the five
successes read 17:29. For about ten minutes the live site served **new HTML with the old stylesheet**,
which put an unstyled "Menu" button on desktop on five pages. Re-uploading the three files fixed it.

**Check `Last-Modified`, not just that the page loads.** A half-landed upload looks fine on the pages
that landed.

## Open — measured, not reported

| # | what | size | fix lives in |
|---|---|---|---|
| 1 | **No-JS horizontal overflow.** With JavaScript disabled, `/contact/` at 375px has `scrollWidth` 421 — **46px past the edge**. The toggle's CSS is gated on `.is-enhanced`, so a no-JS visitor gets the old unwrapping masthead. Within contract for LWS-P1A-003, which explicitly accepted the degraded no-JS header | 46px | `styles.css`, one rule |
| 2 | **Assets are cached long with no version in the URL.** Live headers: `styles.css` `max-age=604800` (7 days), `assets/lumit-mark.svg` `max-age=2592000` (30 days), HTML `max-age=0`. A returning visitor therefore gets new HTML with an old stylesheet until their cache expires — exactly the half-deployed state, but for up to a week | — | six HTML heads, and the mark's `src` **inside the masthead** |
| 3 | **A commented-out `<script>` or chrome tag fires B-007.** Known, disclosed, accepted as the right trade | — | nothing; delete commented markup rather than leaving it |

**Item 2 touches the mark's `<img src>`, which sits inside `<header class="masthead">`** — so it must
change identically on all six pages or B-004 goes red. That is the gate doing its job.

## Next

| # | what | who |
|---|---|---|
| 1 | Commit LWS-P1A-004 + Amendment A on a branch, merge `--no-ff`. **No upload needed** — no site file changed | owner |
| 2 | Edit `_dmarc` to add `rua=`, then confirm by DNS query | owner |
| 3 | Branch protection on `main` — force pushes and deletions only | owner |
| 4 | `LWS-P1A-005` — the prose pass, em-dashes first, **plus** open items 1 and 2 above and D-LWS-005's self-hosted fonts. All four touch the six HTML files, so one contract and **one upload** | planner → coder |

## Parked, deliberately

- **Phone number and booking link.** No "coming soon" placeholder. Superseded only if the bot call
  operator ships — and that is **a separate repository and project**, not this one. D-LWS-008.
- **`hello@`** was declined in favour of the two named addresses. Settled.
- **D-LWS-007, automated deploy to cPanel.** Recommendation stands: not yet. Revisit after the
  LWS-P1A-005 upload, with evidence about how often this actually happens.

## Behaviour IDs — the register, because one was double-booked

| ID | what | state |
|---|---|---|
| B-001 | internal links resolve | live |
| B-002 | one `<h1>`, `<title>`, meta description, canonical per page | live |
| B-003 | assets resolve | live |
| B-004 | shared chrome byte-identical across pages | live, and now collapses a reference-page defect to one violation |
| B-005 | each chrome block exactly once per page | live |
| B-006 | **the responsive masthead toggle** — consumed by LWS-P1A-003 | live |
| B-007 | **the two gate residuals** — consumed by LWS-P1A-004 | live |
| B-008 | next free | — |

**An earlier revision of this file called the gate residuals `B-006`. That was wrong** — `B-006` is
the masthead, assigned in the LWS-P1A-003 contract. The residuals are `B-007`.

## Dated follow-ups

| by | what |
|---|---|
| **2026-10-19** | DMARC at `p=none` — once outbound mail is passing, move to `p=quarantine`. |
| later | then `p=reject`. Going straight to reject is how a new domain silently bins its own invoices. |
