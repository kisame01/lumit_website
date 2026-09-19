# Roadmap

A six-page marketing site. The roadmap is short on purpose.

## Phase 1 — in version control · **in progress**

- [x] Integrity gate, zero dependencies — `LWS-P1A-001`
- [x] `contact/index.html` defect found and fixed
- [x] Repository records
- [x] `git init`, first commit, push to `kisame01/lumit_website`
- [ ] Branch protection on `main` — free, because the repository is public. **Block force pushes and
      block deletions only.** "Require a pull request" locks out the only committer.

**Exit:** the site exists in more than one place, and `node scripts/check_site.mjs` is green on `main`.

## Phase 2 — live · `LWS-P1-002` / `LWS-P1-003` · **all but the mail records done**

- [x] AutoSSL for apex and `www` — valid to 17 Dec 2026, auto-renewing
- [x] Upload to `public_html`, `.htaccess` confirmed present **by behaviour, not by looking**
- [x] SPF and DKIM — cPanel Email Deliverability reports **Valid**
- [ ] DMARC `p=none` added by hand — Zone Editor → **Manage** → Add Record
- [ ] One real mail round trip, in and out
- [x] All six routes, both redirects, `sitemap.xml`, `robots.txt` and the 404 status code verified
      **from outside**
- [x] Record written — `docs/decision/decision_20260919_site_live.md`

**Exit:** the certificate is valid, the redirects behave, the mail records are in, and somebody wrote
down that all of it was true. A deployment nobody wrote down cannot be audited when it breaks.

## Phase 3 — the small things · unscheduled

- [x] B-005 occurrence rule — `LWS-P1A-002`, approved, merge pending
- [ ] B-006 — the two residuals from the `LWS-P1A-002` review: a chrome defect on the reference page
      reports once instead of six times, and an unterminated chrome start tag is detected
- [ ] Unslop pass over the six pages — the em-dashes, and the rest of the AI tells
- [ ] Self-host the webfonts (D-LWS-005)
- [ ] DMARC to `p=quarantine`, then `p=reject`

## Parked

- **Phone number and booking link.** No placeholder. An answering service with calendar booking is a
  separate thing at a later date, chosen partly to keep personal numbers out of it.

## Not planned

A rebuild in Next.js. A CMS. A contact form. An automated deploy. Each becomes worth discussing at a
change rate this site does not have — revisit when it does, not before.
