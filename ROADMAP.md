# Roadmap

A six-page marketing site. The roadmap is short on purpose.

## Phase 1 — in version control · **in progress**

- [x] Integrity gate, zero dependencies — `LWS-P1A-001`
- [x] `contact/index.html` defect found and fixed
- [x] Repository records
- [ ] `git init`, first commit, push to `kisame01/lumit_website`
- [ ] Branch protection on `main` — free, because the repository is public

**Exit:** the site exists in more than one place, and `node scripts/check_site.mjs` is green on `main`.

## Phase 2 — live · `LWS-P1-002`

- [ ] AutoSSL for apex and `www`
- [ ] Upload to `public_html`, `.htaccess` confirmed present
- [ ] Email Deliverability → Repair (SPF, DKIM); DMARC `p=none` added by hand
- [ ] One real mail round trip, in and out
- [ ] All six routes, both redirects, `sitemap.xml`, `robots.txt` and the 404 verified **from outside**
- [ ] Record written at `docs/decision/decision_<yyyymmdd>_site_live.md`

**Exit:** the certificate is valid, the redirects behave, the mail records are in, and somebody wrote
down that all of it was true. A deployment nobody wrote down cannot be audited when it breaks.

## Phase 3 — the small things · unscheduled

- [ ] B-004 occurrence rule — `LWS-P1A-002`
- [ ] Self-host the webfonts (D-LWS-005)
- [ ] Phone number, booking link
- [ ] DMARC to `p=quarantine`, then `p=reject`

## Not planned

A rebuild in Next.js. A CMS. A contact form. An automated deploy. Each becomes worth discussing at a
change rate this site does not have — revisit when it does, not before.
