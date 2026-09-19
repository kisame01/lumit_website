# Open decisions

Closed decisions live in `docs/decision/`.

## D-LWS-005 · Google Fonts, against the promise the contact page makes

Every page preconnects to `fonts.googleapis.com` and `fonts.gstatic.com` and loads a stylesheet from
Google, so a visitor's IP reaches Google on every page load. The contact page tells visitors the site
"runs no tracking, sets no cookies requiring consent, and keeps no database of visitors" — narrowly
true, and still a third-party request the site did not need. Self-hosting Work Sans and JetBrains
Mono costs roughly 200 KB under `assets/` and one change to each page's head.
**Recommendation: self-host.** Not blocking. Folded into the cleanup contract with the unslop pass,
so the site is re-uploaded once rather than twice.

## D-LWS-006 · The prose has not been edited, only written

The six pages read as machine-written in places, em-dashes above all. Owner's call, 2026-09-19: clean
it up **after** hosting, as its own contract, and look for a skill that reads the live pages rather
than hand-editing blind. **RULE 002 applies to prose as much as to markup** — that contract reports
what it found before it changes a word, and every edit moves a byte count that must be re-recorded.

---

## Closed since the last revision

**D-LWS-004 — does `www` resolve, and to what?** Closed **yes** on 2026-09-19. `www` resolves, the
AutoSSL certificate covers it, and `https://www.lumittechnology.com/about/` lands on
`https://lumittechnology.com/about/` with the path preserved. Verified by navigation, not assumed.
See `docs/decision/decision_20260919_site_live.md`.

## Parked by the owner — do not re-raise

- **A phone number.** No placeholder, no "coming soon". Silence reads as deliberate on a consultancy
  contact page; "coming soon" reads as unfinished.
- **A booking link.** "Book a landscape session" stays a `mailto:` for now. The intended answer is an
  answering service with calendar booking rather than a personal cell number — chosen to keep
  personal data out of it — and it is a separate, later, paid thing.
- **`hello@`** was declined in favour of the two named addresses. Settled.

## Raised, and not this repository's to decide

`lumit_webapp` ROADMAP Phase 2 is "Public website", and behaviours `B-008` and `B-009` there cover
`apps/public-web` — the thing this repository now supersedes, and as of 2026-09-19 supersedes *in
production*. Either that phase is closed as delivered elsewhere and `apps/public-web` is retired, or
both sites exist and one is dead code. **Raise it in that repository, not here.** Left unsaid, it
becomes a phase nobody can close and an app nobody dares delete.
