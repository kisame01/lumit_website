# State

**As at 2026-09-19, after LWS-P1A-003 shipped, LWS-P1A-004 closed both gate residuals, and
LWS-P1A-005 was approved. LWS-P1A-004 and LWS-P1A-005 are in the working tree, uncommitted, and
LWS-P1A-005 has not yet been uploaded.**

## Where things are

- **The site is live at `https://lumittechnology.com` and the mobile fix is deployed.** All ten
  served files were re-fetched from outside after the upload and every byte count matches the
  repository. `docs/decision/decision_20260919_site_live.md`.
- **The masthead works on a phone.** Measured on the live site at 375×812: the homepage is
  **375px wide** (was 662) and the masthead is **61px closed** (was 290). The toggle opens to six
  links and the button at 351.7px and closes back to 61px.
- `scripts/check_site.mjs` (**10,034**) passes: `6 pages | 68 internal links | 6 assets`, zero
  violations across B-001 to B-007.
- **LWS-P1A-005 is approved but not deployed.** The prose pass, the shared `enquiries@` address, the
  no-JS wrap and versioned asset URLs are in the working tree. **The live site still serves the
  pre-LWS-P1A-005 bytes.**
- **In version control.** `main` at `b2aac7edf56c32f52f750ab201a1a314dc6dc613`, pushed to
  `https://github.com/kisame01/lumit_website`. **LWS-P1A-004 and its Amendment A are in the working
  tree and not yet committed.**
- **Branch protection on `main` is not yet on.** When it goes on: **block force pushes and block
  deletions only.** Not "require a pull request" — the owner is the sole committer.
- `.gitignore` is **63** bytes; `/Claude outputs/` was added so a stray root folder is not committed.

## Byte counts — the current baseline

**On the live server** (LWS-P1A-003 state):

```
.htaccess 796 · index.html 12,862 · styles.css 12,636 · robots.txt 73 · sitemap.xml 649
assets/lumit-mark.svg 24,646 · about/ 6,953 · contact/ 5,784 · engagements/ 6,399
how-we-work/ 7,046 · services/ 17,050
```

**In the working tree** (after LWS-P1A-005, awaiting upload):

```
index.html 12,860 · styles.css 12,667 · about/ 6,962 · contact/ 5,646
engagements/ 6,408 · how-we-work/ 7,001 · services/ 17,040
assets/lumit-mark.svg 24,646 (unchanged — only its URL gained ?v=2)
scripts/check_site.mjs 10,034 · package.json 132 · .gitattributes 902 · .gitignore 63
```

The six HTML deltas are **not** equal in LWS-P1A-005 and should not be — the prose pass differs per
page. The Phase 4 portion **is** equal at +12 each, because `?v=2` is four characters and there are
three references per page. RULE 004 held end to end.

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

**Two real mail round trips completed, 2026-09-19.** `lucian@` in and out; and
**`enquiries@lumittechnology.com` tested both directions against an outside Google account** before
LWS-P1A-005 was allowed to upload. The published address works.

**Keep `rua=` pointed at `lucian@`, not `enquiries@`.** DMARC aggregate reports are machine-generated
XML sent daily by every receiving provider; they belong in a mailbox someone monitors deliberately,
not in the public enquiries inbox where they would bury real messages.

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
- **LWS-P1A-005 approved.** Prose pass (15 changes, reported before editing), the shared
  `enquiries@` address, the no-JS wrap, and versioned asset URLs. Reviewer reproduced all five
  mutations, diffed every changed line against the baseline, and re-measured the full grid with a
  different no-JS method than the implementer used.
  `docs/review/review_20260919_lws_p1a_005_prose_and_carried_defects.md`.
- **The no-JS masthead at 375px went from 421px wide with 46px of overflow to 375px with none.**
- **`enquiries@lumittechnology.com` created and tested**, in and out, against an outside Google
  account — before the files that publish it were allowed to upload.
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
| 1 | **Google Fonts on every page** — preconnect plus a stylesheet, against a contact page that promises no third-party anything. **Now the most important open item.** D-LWS-005 | ~200 KB to self-host | six HTML heads, `assets/`, `styles.css` |
| 2 | **The most-seen em-dash on the site is still there.** In the shared closing block, on all six pages: "…existing environment **—** we can turn the challenge into a practical roadmap". The prose pass left the chrome alone because the contract told it to. Fixable — change it identically six times and B-004 verifies it | — | six HTML files, gated chrome |
| 3 | **A commented-out `<script>` or chrome tag fires B-007.** Known, disclosed, accepted as the right trade | — | nothing; delete commented markup rather than leaving it |

Items 1 and 2 of the previous revision — the 46px no-JS overflow and the unversioned long-cached
assets — were **closed by LWS-P1A-005**.

## Next

| # | what | who |
|---|---|---|
| ~~0~~ | ~~Create and test the `enquiries@` mailbox~~ — **done 2026-09-19**, round trip confirmed both directions against an outside Google account. The upload is unblocked | owner |
| 1 | Commit LWS-P1A-004 + Amendment A + LWS-P1A-005 on a branch, merge `--no-ff` | owner |
| 2 | **Upload seven files** — the six `index.html` and `styles.css`. The mark is unchanged; `?v=2` on its URL is what makes browsers refetch it. **Check `Last-Modified` on every file afterwards** | owner |
| 3 | Edit `_dmarc` to add `rua=`, then confirm by DNS query | owner |
| 4 | Branch protection on `main` — force pushes and deletions only | owner |
| 5 | `LWS-P1A-006` — self-host the webfonts (D-LWS-005), optionally the closing-block em-dash | planner → coder |

## Parked, deliberately

- **Phone number and booking link.** No "coming soon" placeholder. Superseded only if the bot call
  operator ships — and that is **a separate repository and project**, not this one. D-LWS-008.
- **A shared address.** `hello@` was declined, then **reversed the same day** in favour of
  `enquiries@lumittechnology.com`. D-LWS-009.
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

LWS-P1A-005 introduced no new behaviour; it was covered by B-001 to B-007 throughout.

**An earlier revision of this file called the gate residuals `B-006`. That was wrong** — `B-006` is
the masthead, assigned in the LWS-P1A-003 contract. The residuals are `B-007`.

## Dated follow-ups

| by | what |
|---|---|
| **2026-10-19** | DMARC at `p=none` — once outbound mail is passing, move to `p=quarantine`. |
| later | then `p=reject`. Going straight to reject is how a new domain silently bins its own invoices. |
