# Roadmap

A six-page marketing site. The roadmap is short on purpose.

## Phase 1 — in version control · **done but one item**

- [x] Integrity gate, zero dependencies — `LWS-P1A-001`
- [x] `contact/index.html` defect found and fixed
- [x] Repository records
- [x] `git init`, first commit, push to `kisame01/lumit_website`
- [x] Branch protection on `main`, on 2026-10-08 — free, because the repository is public. **Block force pushes and
      block deletions only.** "Require a pull request" locks out the only committer. **From
      `LWS-P1A-006` this is part of the deploy path:** cPanel's Update from Remote is fast-forward
      only, so a force-pushed `main` stops deployment.

**Exit:** the site exists in more than one place, and `node scripts/check_site.mjs` is green on `main`.

## Phase 2 — live · **all but one mail record done**

- [x] AutoSSL for apex and `www` — valid to 17 Dec 2026, auto-renewing
- [x] Upload to `public_html`, `.htaccess` confirmed present **by behaviour, not by looking**
- [x] SPF and DKIM — cPanel Email Deliverability reports **Valid**
- [ ] **DMARC reporting.** The record exists at `p=none` but has **no `rua=`**, so nothing is reported.
      Edit — do not add a second record — to
      `v=DMARC1; p=none; rua=mailto:lucian@lumittechnology.com; fo=1`. Still open on 2026-10-08.
- [x] Mail round trips, in and out — `lucian@` and `enquiries@`, 2026-09-19
- [x] All six routes, both redirects, `sitemap.xml`, `robots.txt` and the 404 status code verified
      **from outside**
- [x] Record written — `docs/decision/decision_20260919_site_live.md`

## Phase 3 — the small things · **done but two**

- [x] B-005 occurrence rule — `LWS-P1A-002`
- [x] B-006 responsive masthead, the homepage scroller and the dark-mode mark — `LWS-P1A-003`
- [x] B-007, the two gate residuals from the `LWS-P1A-002` review — `LWS-P1A-004`
- [x] Prose pass, shared `enquiries@` address, no-JS wrap, versioned asset URLs — `LWS-P1A-005`
- [ ] Self-host the webfonts (D-LWS-005) — moved to Phase 4 as `LWS-P1A-008`
- [ ] DMARC to `p=quarantine`, then `p=reject` — **blocked on the `rua=` edit above**; moving policy
      without reports is guessing

## Phase 4 — deploy by git, then restyle · **started 2026-10-08**

Decided in `docs/decision/decision_20261008_cpanel_git_deployment_and_restyle_scope.md`.

- [x] `LWS-P1A-006` — `.cpanel.yml` and **B-008**: the gate proves the deployment manifest matches the
      site, nothing missing and nothing extra
- [x] First deploy through cPanel Git — byte-identical files, every `Last-Modified` moves, verified
      from outside. **The pipeline is proven on a change that cannot break anything.**
- [x] `README.md` deploy section rewritten — **only after** that first deploy is verified
- [ ] `LWS-P1A-007` — the restyle, from `docs/reference/redesign_20261008.html`: brand palette, icons,
      cards, closing band, in `styles.css`, dark mode kept, real mark kept, live text kept
- [ ] `LWS-P1A-008` — self-hosted fonts; no visitor's IP reaches Google

**Exit:** a deploy is two clicks with no stored secret, the site carries the new design in light and
dark, and no page makes a third-party request.

## Parked

- **Phone number and booking link.** No placeholder. An answering service with calendar booking is a
  separate project at a later date — D-LWS-008.

## Not planned

A rebuild in Next.js. A CMS. A contact form. Analytics. A push-to-deploy webhook that would need a
secret stored somewhere — **the git deployment adopted in Phase 4 needs none, and that is why it was
adopted.**
