# State

**As at 2026-09-19.**

## Where things are

- **The site is live at `https://lumittechnology.com`.** All six routes, both redirects, the security
  headers, `sitemap.xml`, `robots.txt` and the 404 status code were verified by fetching the live
  site. `docs/decision/decision_20260919_site_live.md`.
- **Every served file is byte-identical to the repository.** Measured with `arrayBuffer().byteLength`,
  not `String.length` — the latter counts UTF-16 units and makes multi-byte characters look like
  missing bytes.
- `scripts/check_site.mjs` (**9,413**) passes: `6 pages | 68 internal links | 6 assets`, zero
  violations across B-001 to B-005.
- **In version control.** `main` at `ea647e5906cf5f62697549c6c5544c603c7ae142`, pushed to
  `https://github.com/kisame01/lumit_website`, working tree clean.
- **Branch protection on `main` is not yet on.** When it goes on: **block force pushes and block
  deletions only.** Not "require a pull request" — the owner is the sole committer.

## Byte counts — the current baseline

```
.htaccess 796 · index.html 12,251 · styles.css 11,539 · robots.txt 73 · sitemap.xml 649
assets/lumit-mark.svg 24,545 · about/ 6,342 · contact/ 5,173 · engagements/ 5,788
how-we-work/ 6,435 · services/ 16,439 · scripts/check_site.mjs 9,413
```

Confirmed identical on disk and on the live server. RULE 004 held end to end.

## Mail — three of four done

| record | state |
|---|---|
| SPF | `v=spf1 +a +mx +ip4:164.160.91.16 include:spf.zamailgate.com ~all` — correct |
| DKIM | `default._domainkey`, 2048-bit RSA — correct |
| MX | `0 mail.lumittechnology.com.` — correct |
| **DMARC** | **`v=DMARC1; p=none;` — no `rua=`. Open.** |

`_dmarc` pre-existed and carries no reporting address, so nothing is being monitored. It needs an
**edit**, not a second record — two DMARC records on one name is treated as no policy at all. Target
value: `v=DMARC1; p=none; rua=mailto:lucian@lumittechnology.com; fo=1`. **Re-query DNS to confirm;
the zone TTL is 14400, so a recent save can hide behind four hours of resolver cache.**

**A real mail round trip was completed** — outside address in to `lucian@`, reply back out, both
arrived. 2026-09-19.

Certificate: AutoSSL for the apex, `www` and eight service subdomains, to 17 Dec 2026, auto-renewing.

## Done this session

- `contact/index.html` corrected: leaked generator tail removed, 16,049 → 5,173 bytes.
- D-LWS-001, D-LWS-002, D-LWS-003 closed.
- **D-LWS-004 closed as yes.** `www` is a CNAME to the apex, the certificate covers it, and the
  redirect preserves the path.
- LWS-P1A-001 approved. `.gitattributes` added; RULE 004 recorded.
- **LWS-P1A-002 approved and merged.** B-005: each shared chrome block exactly once per page,
  evaluated before B-004 and suppressing it for a failing block. Reviewer reproduced all four
  contract mutations independently plus two of its own.
- **The site was deployed and verified from outside.**
- The `5_6` contract path corrected to `4_6`. **There is no Grok 5.6**; 4.6 is current in Cursor.
- Handover written for the next context:
  `docs/context/claude/opus/5/high/handover/session_handover_20260919_kickoff_lws_p1_004_cleanup_and_operator.md`.

## Open — measured, not reported

**Three mobile layout defects, found by rendering the live pages at 375×812.** The owner reported two
small kinks; there are three, and the largest is one he had not seen.

| # | where | size | fix lives in |
|---|---|---|---|
| A | `/` — an unclassed `div` between `.matrix-scroll` and `.annot` has `min-width: auto` and will not shrink, so the page is **662px wide in a 375px viewport** | 287px | `styles.css` |
| B | `a.btn` "Book a session" in `div.wrap.masthead-in` — `flex-wrap: nowrap`, so the masthead never wraps. All six routes | 50px | `styles.css` |
| C | `assets/lumit-mark.svg` — the `L` letterform is `fill="#041E49"` with no `currentColor` and no `prefers-color-scheme`. Low contrast in dark mode, and it is also the favicon | — | the SVG alone |

**None of the three touches a masthead, closing block or footer**, so B-004 and B-005 stay green and
no HTML byte count moves. That is what makes this a low-risk task.

## Next

| # | what | who |
|---|---|---|
| 1 | Edit `_dmarc` to add `rua=`, then confirm by DNS query | owner |
| 2 | Branch protection on `main` — force pushes and deletions only | owner |
| 3 | `LWS-P1A-003` — the three layout defects above. CSS and one asset, no HTML | planner → coder |
| 4 | `LWS-P1A-004` — the prose pass, em-dashes first. **Separate contract**: it touches all six HTML files, moves every byte count and runs through the chrome comparison | planner → coder |
| 5 | `B-006` — the two residuals from the LWS-P1A-002 review | planner |
| 6 | D-LWS-005 — self-host the webfonts, folded into one of the above so the site is re-uploaded once | planner |
| 7 | D-LWS-007 — automated deploy to cPanel. **Recommendation: not yet.** See `OPEN_DECISIONS.md` | owner |

## Parked, deliberately

- **Phone number and booking link.** No "coming soon" placeholder. Superseded only if the bot call
  operator ships — and that is **a separate repository and project**, not this one.
- **`hello@`** was declined in favour of the two named addresses. Settled.

## Dated follow-ups

| by | what |
|---|---|
| **2026-10-19** | DMARC at `p=none` — once outbound mail is passing, move to `p=quarantine`. |
| later | then `p=reject`. Going straight to reject is how a new domain silently bins its own invoices. |
