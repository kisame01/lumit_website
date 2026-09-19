# Open decisions

Closed decisions live in `docs/decision/`.

## D-LWS-004 · Does `www` resolve, and to what?

**Blocks:** nothing today. `.htaccess` redirects `www` to the apex, which works only if
`www.lumittechnology.com` has a DNS record **and** the certificate covers it. cPanel AutoSSL normally
issues for both when both are in the zone. **Confirm both — do not assume.** If `www` has no record,
the redirect is dead code and anyone typing `www.` gets nothing.

## D-LWS-005 · Google Fonts, against the promise the contact page makes

Every page preconnects to `fonts.googleapis.com` and `fonts.gstatic.com` and loads a stylesheet from
Google, so a visitor's IP reaches Google on every page load. The contact page tells visitors the site
"runs no tracking, sets no cookies requiring consent, and keeps no database of visitors" — narrowly
true, and still a third-party request the site did not need. Self-hosting Work Sans and JetBrains
Mono costs roughly 200 KB under `assets/` and one change to each page's head.
**Recommendation: self-host.** Not blocking.

## Two facts the site is still missing

- **A phone number.** The contact page has none. One was never supplied and inventing one was not an
  option. Consultancy prospects do look for a number.
- **A booking link.** "Book a landscape session" currently opens an email. Honest, and it works; a
  calendar link would work better.

Both are a five-minute edit. Neither blocks anything.

## Raised, and not this repository's to decide

`lumit_webapp` ROADMAP Phase 2 is "Public website", and behaviours `B-008` and `B-009` there cover
`apps/public-web` — the thing this repository now supersedes. Either that phase is closed as
delivered elsewhere and `apps/public-web` is retired, or both sites exist and one is dead code.
**Raise it in that repository, not here.** Left unsaid, it becomes a phase nobody can close and an app
nobody dares delete.
