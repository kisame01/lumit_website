# Decision — the site is live at https://lumittechnology.com

**Date:** 2026-09-19. **Task:** `LWS-P1-003`, track B. **Verified from outside, not reported.**

Every line below came from fetching the live site in a browser and reading status codes, response
headers and response byte lengths. Nothing here rests on a screenshot or on the owner saying it
looked right.

## What is true

**Certificate.** AutoSSL Domain Validated for `lumittechnology.com`, `www.lumittechnology.com` and
eight service subdomains. Expires 17 December 2026, renews via AutoSSL. R0 — the separately-sold
R240/year certificate was correctly not bought.

**All six routes return 200, with distinct and correct titles.**

| route | status | bytes served | repo bytes |
|---|---|---|---|
| `/` | 200 | 12,251 | 12,251 |
| `/services/` | 200 | 16,439 | 16,439 |
| `/how-we-work/` | 200 | 6,435 | 6,435 |
| `/engagements/` | 200 | 5,788 | 5,788 |
| `/about/` | 200 | 6,342 | 6,342 |
| `/contact/` | 200 | 5,173 | 5,173 |

**Every served file is byte-identical to the repository.** No line-ending rewrite in transit, which
was the specific risk RULE 004 exists for. `sitemap.xml` 649 as `application/xml`; `robots.txt` 73 as
`text/plain`; `styles.css` and `assets/lumit-mark.svg` both 200.

**`.htaccess` is present and active.** Proven three ways rather than by looking for the file:
`http://` upgraded to `https://` on its own; `X-Content-Type-Options: nosniff`,
`X-Frame-Options: SAMEORIGIN` and `Referrer-Policy: strict-origin-when-cross-origin` are on every
response; and `https://www.lumittechnology.com/about/` landed on `https://lumittechnology.com/about/`
with the About title intact — **the `www` redirect preserves the path**, it does not dump everyone on
the homepage.

**D-LWS-004 closes as yes.** `www` resolves, the certificate covers it, and the redirect works.

**The 404 returns status 404**, not a soft 200, and serves the homepage body per
`ErrorDocument 404 /index.html`. A real 404 page is a Phase 3 nicety, not a defect.

**`/php.ini` returns 403 Forbidden.** Elitehost's stock PHP config sits in `public_html` and the
server already blocks it. No `.htaccess` rule needed. It was left in place deliberately — deleting it
on cPanel can break the account's PHP handler and it regenerates anyway.

**SPF and DKIM are in place.** cPanel Email Deliverability reports `lumittechnology.com` **Valid**
with **Repair** greyed out.

## What is not done

- **DMARC is not added.** `_dmarc` TXT `v=DMARC1; p=none; rua=mailto:lucian@lumittechnology.com; fo=1`
  still to be created via Zone Editor → Manage → Add Record. The quick buttons on the Zone Editor
  landing page offer A, CNAME and MX only, which is why this is easy to miss.
- **No mail round trip has been run** — outside address in to `lucian@`, and a reply back out. Those
  addresses are now on a public website, so this is the next thing that matters.
- **Branch protection on `main` is still off**, and `LWS-P1A-002` is approved but not yet merged.

## One thing that nearly went wrong, recorded because it will recur

cPanel File Manager's **Upload accepts files, never folders**. The owner uploaded the four root files
individually, and the five page directories had to be created by hand. The folder mtimes gave it
away — 10:42, 10:43, 10:44, 10:45, 10:45 — where an archive extraction stamps them all at one second.
`.htaccess` was the file most likely to be lost that way, because File Manager hides dotfiles by
default and its absence breaks the redirects, the headers and the 404 silently while the homepage
still looks perfect.

It survived this time. **Next deployment: upload the single zip and use Extract.** The reviewer's
suspicion that `.htaccess` was missing was wrong, and it was wrong in the safe direction — the check
cost one minute and would have caught a real failure.

## Dated follow-up

**2026-10-19** — once outbound mail is passing, move DMARC from `p=none` to `p=quarantine`, and later
to `p=reject`. Straight to reject is how a new domain silently bins its own invoices.
