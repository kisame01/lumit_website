# State

**As at 2026-09-19.**

## Where things are

- Six pages, one stylesheet, the mark, `robots.txt`, `sitemap.xml`, `.htaccess`. Content is final.
- **The site is live at `https://lumittechnology.com`.** All six routes, both redirects, the
  security headers, `sitemap.xml`, `robots.txt` and the 404 status code were verified by fetching the
  live site, not by looking at a screenshot.
  `docs/decision/decision_20260919_site_live.md`.
- `scripts/check_site.mjs` passes on the current tree: `6 pages | 68 internal links | 6 assets`,
  zero violations, now across B-001 to B-005.
- **In version control.** `main` at `deb8eaf66ecc4dd2384d53dc9da95b219d460e3e`, pushed to
  `https://github.com/kisame01/lumit_website`.
- **`LWS-P1A-002` is approved and not yet merged.** `docs/review/review_20260919_lws_p1a_002_b005.md`.
- **Branch protection on `main` is not yet on.**

## Byte counts — the current baseline

```
.htaccess 796 · index.html 12,251 · styles.css 11,539 · robots.txt 73 · sitemap.xml 649
assets/lumit-mark.svg 24,545 · about/ 6,342 · contact/ 5,173 · engagements/ 5,788
how-we-work/ 6,435 · services/ 16,439
```

`scripts/check_site.mjs` moves to **9,413** at the `LWS-P1A-002` merge. It is 8,016 on `main` today.

**Every one of the eleven is byte-identical on the live server.** Confirmed 2026-09-19 by reading
response lengths. No line-ending rewrite in transit. RULE 004 held end to end.

## Done this session

- `contact/index.html` corrected: a leaked generator tail removed, 16,049 → 5,173 bytes.
- D-LWS-001, D-LWS-002, D-LWS-003 closed.
  `docs/decision/decision_20260919_source_of_truth_and_first_commit.md`.
- LWS-P1A-001 approved; the gate is green and proven able to go red.
- `.gitattributes` added. `docs/note/note_20260919_crlf_and_byte_count_discipline.md`.
- **LWS-P1A-002 written, implemented, and approved.** B-005: each shared chrome block exactly once
  per page, evaluated before B-004 and suppressing it for a failing block. Reviewer reproduced all
  four contract mutations independently plus two of its own.
- **The site was deployed and verified from outside.** AutoSSL for apex, `www` and eight service
  subdomains; certificate expires 17 Dec 2026 and auto-renews.
- **D-LWS-004 closed as yes.** `www` resolves, the certificate covers it, and the redirect to the
  apex preserves the path.
- SPF and DKIM confirmed in place — cPanel Email Deliverability reports **Valid**.
- The `5_6` contract path corrected to `4_6`. **There is no Grok 5.6**; 4.6 is current in Cursor.

## Next

| # | what | who |
|---|---|---|
| 1 | Merge `LWS-P1A-002` on a branch with `--no-ff`, push | owner |
| 2 | Branch protection on `main` — **block force pushes and block deletions only**, not "require a pull request", because the owner is the only committer and would lock himself out | owner |
| 3 | DMARC `_dmarc` TXT via Zone Editor → **Manage** → Add Record. The landing page's quick buttons are A, CNAME and MX only | owner |
| 4 | One real mail round trip — outside address in to `lucian@`, and a reply back out. Those addresses are on a public website now | owner |
| 5 | `LWS-P1A-003` — B-006, the two residuals disclosed in the LWS-P1A-002 review | planner |
| 6 | Cleanup contract — unslop pass over the six pages, self-host the webfonts (D-LWS-005) | planner |

## Parked, deliberately

- **Phone number and booking link.** Owner's call, 2026-09-19: no "coming soon" placeholder, and an
  answering service with calendar booking is a later and separate thing. Staying off PII is the
  reason. Do not re-raise.
- **`hello@`** was declined in favour of the two named addresses. Settled.

## Dated follow-ups

| by | what |
|---|---|
| **2026-10-19** | DMARC is at `p=none`. Once outbound mail is passing, move to `p=quarantine`. |
| later | then `p=reject`. Going straight to reject is how a new domain silently bins its own invoices. |
