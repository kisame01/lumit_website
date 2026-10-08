# State

**As at 2026-10-08.** Re-measured from outside on that date, not carried forward from 2026-09-19.

## Where things are

- **The site is live at `https://lumittechnology.com` and matches `main` byte for byte.** All ten
  served files were re-fetched on 2026-10-08. LWS-P1A-005 — the prose pass, `enquiries@`, the no-JS
  wrap and the versioned asset URLs — **landed on 2026-09-19 between 18:37 and 18:39 UTC**, all seven
  files. That upload was never confirmed at the time; it is now.
- **`main` is `203ab193de9e98fedb0164236cb5ed0428f8fc1c`**, unchanged since 2026-09-19, pushed to
  `https://github.com/kisame01/lumit_website`. Read from the GitHub API, 2026-10-08.
- `scripts/check_site.mjs` (**10,034**) passes on `main`: `6 pages | 68 internal links | 6 assets`,
  zero violations across B-001 to B-007.
- **Branch protection on `main` is still off** (GitHub API, 2026-10-08). From LWS-P1A-006 it protects
  the deploy path, not just the history — see Phase 1 in `ROADMAP.md`.
- **Roles changed on 2026-10-08:** planner/reviewer is **Claude Opus 5.5 High**, coder is **Cursor
  running Grok 4.7 High**. Grok 4.7 exists and has a High setting — confirmed on Cursor's own model
  page, because a past planner once invented a model version. `AGENTS.md` is updated.

## Byte counts — the current baseline, on disk and on the server

```
.htaccess 796 · index.html 12,860 · styles.css 12,667 · robots.txt 73 · sitemap.xml 649
assets/lumit-mark.svg 24,646 · about/ 6,962 · contact/ 5,646 · engagements/ 6,408
how-we-work/ 7,001 · services/ 17,040
scripts/check_site.mjs 10,034 · package.json 132 · .gitattributes 902 · .gitignore 63
```

RULE 004 held end to end; no CRLF anywhere, on disk or on GitHub.

## Mail — three of four done, and the fourth has now been open for three weeks

| record | state on 2026-10-08 |
|---|---|
| SPF | `v=spf1 +a +mx +ip4:164.160.91.16 include:spf.zamailgate.com ~all` — correct |
| DKIM | `default._domainkey`, 2048-bit RSA — correct |
| MX | `0 mail.lumittechnology.com.` — correct |
| **DMARC** | **`v=DMARC1; p=none;` — still no `rua=`.** Queried through `dns.google` and `cloudflare-dns.com`, both at full TTL 14400. |

**Edit, do not add.** Two DMARC records on one name is treated as no policy at all. Target:
`v=DMARC1; p=none; rua=mailto:lucian@lumittechnology.com; fo=1`. **Keep `rua=` on `lucian@`, not
`enquiries@`** — aggregate reports are daily machine XML and would bury real enquiries.

**The 2026-10-19 follow-up — move to `p=quarantine` — cannot be done safely on time**, because it
depends on reports this record is not yet collecting. Re-date it to four weeks after the `rua=` edit.

Mail round trips completed 2026-09-19 for `lucian@` and for **`enquiries@lumittechnology.com`, tested
both directions against an outside Google account** before it was published.

Certificate: AutoSSL for the apex, `www` and eight service subdomains, to 17 Dec 2026, auto-renewing.

## Decided on 2026-10-08

`docs/decision/decision_20261008_cpanel_git_deployment_and_restyle_scope.md`

- **D-LWS-007 closed — deploy by cPanel Git™ Version Control.** Pull deployment from the public repo
  over HTTPS. **No credential stored anywhere.** `.cpanel.yml` names every file it copies; B-008 makes
  the gate prove that list matches the site.
- **D-LWS-010 — the restyle.** Reference: `docs/reference/redesign_20261008.html` (24,983 bytes), a
  homepage-only mockup. **Keep the real mark, keep dark mode, the live text wins**, the six-page
  structure stays, styles live in `styles.css`, icons are inline SVG with no library.

## In flight

| task | what | state |
|---|---|---|
| `LWS-P1A-006` | `.cpanel.yml` + B-008 | **implemented and reviewed, accepted 2026-10-08** — `docs/review/review_20261008_lws_p1a_006_b008.md`. Not yet merged or deployed. **B-008 cannot see files referenced from CSS** — review §5 |
| `LWS-P1A-007` | the restyle | **not yet written** — the new planner writes it, from the decision record §2–§3 |
| `LWS-P1A-008` | self-hosted fonts | after the restyle |

## The deployment lesson, kept because it is why Phase 4 exists

On 2026-09-19 the first LWS-P1A-003 upload **half-landed**: five page folders updated, the root
`index.html`, `styles.css` and the mark did not. Caught from outside by `Last-Modified`. For about ten
minutes the site served new HTML against an old stylesheet, which put an unstyled "Menu" button on
desktop. **A half-landed upload looks fine on the pages that landed. Check `Last-Modified`.** Git
deployment removes the folder-by-folder step that caused it; B-008 removes the version of the same
failure that git deployment would otherwise introduce.

## Open — measured, not reported

| # | what | fix lives in |
|---|---|---|
| 1 | **Google Fonts on every page**, against a contact page that promises no third-party requests. D-LWS-005 | `LWS-P1A-008` |
| 2 | **The closing-block em-dash on all six pages.** Adopted into the restyle by owner decision | `LWS-P1A-007` |
| 3 | **A commented-out `<script>` or chrome tag fires B-007.** Known, accepted | nothing — delete commented markup |
| 4 | **DMARC has no `rua=`** | owner, Zone Editor |
| 5 | **Branch protection off** | owner, GitHub settings |

## Next

| # | what | who |
|---|---|---|
| 1 | Hand `lws_p1a_006_contract.md` to Cursor Grok 4.7 High | owner |
| 2 | Review the LWS-P1A-006 report independently — stage, gate, mutations, **re-run the deploy emulation** | planner |
| 3 | Commit and merge LWS-P1A-006 | owner |
| 4 | **Check cPanel has Files → Git™ Version Control.** Some hosts switch it off | owner |
| 5 | Clone, Update from Remote, Deploy HEAD Commit — see the planner handover §6 | owner |
| 6 | Verify all eleven files from outside; then rewrite `README.md`'s deploy section | planner |
| 7 | Write `LWS-P1A-007`, the restyle | planner |
| 8 | DMARC `rua=` edit, and branch protection | owner |

## Parked, deliberately

- **Phone number and booking link.** No "coming soon" placeholder. D-LWS-008 — a separate project.
- **D-LWS-009 — `enquiries@`** is live and tested. Who reads it day to day is the owner's call.

## Behaviour IDs — the register

| ID | what | state |
|---|---|---|
| B-001 | internal links and assets resolve | live |
| B-002 | one `<h1>`, `<title>`, meta description, canonical per page | live |
| B-003 | sitemap agrees with the pages on disk | live |
| B-004 | shared chrome byte-identical across pages; a reference-page defect reports once | live |
| B-005 | each chrome block exactly once per page | live |
| B-006 | the responsive masthead toggle — LWS-P1A-003 | live |
| B-007 | tag balance, and the reference-page collapse — LWS-P1A-004 | live |
| **B-008** | **`.cpanel.yml` deploys exactly the site — LWS-P1A-006** | **reviewed; live on merge** — blind to CSS `url()`, review §5 |
| B-009 | next free — the restyle's icon-sprite check is the likely taker | — |

**Behaviour IDs are per repository.** `lumit_webapp` has its own `B-008`; it is unrelated.

## Dated follow-ups

| by | what |
|---|---|
| **4 weeks after the `rua=` edit** | DMARC `p=none` → `p=quarantine`, if the reports show outbound mail passing. Re-dated from 2026-10-19, which the missing `rua=` made impossible. |
| later | then `p=reject` |
| **17 Dec 2026** | AutoSSL expiry — auto-renewing; confirm it did in the first week of December |
