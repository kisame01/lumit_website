# Open decisions

Closed decisions live in `docs/decision/`.

## D-LWS-005 · Google Fonts, against the promise the contact page makes

Every page preconnects to `fonts.googleapis.com` and `fonts.gstatic.com` and loads a stylesheet from
Google, so a visitor's IP reaches Google on every page load. The contact page tells visitors the site
"runs no tracking, sets no cookies requiring consent, and keeps no database of visitors" — narrowly
true, and still a third-party request the site did not need. Self-hosting Work Sans and JetBrains
Mono costs roughly 200 KB under `assets/` and one change to each page's head.
**Recommendation: self-host.** Not blocking. Fold it into one of the cleanup contracts so the site is
re-uploaded once rather than three times.

## D-LWS-006 · The prose has not been edited, only written

The six pages read as machine-written in places, em-dashes above all. Owner's call, 2026-09-19: clean
it up **after** hosting, as its own contract, and look for a skill that reads the live pages rather
than hand-editing blind. **RULE 002 applies to prose as much as to markup** — that contract reports
what it found before it changes a word, and every edit moves a byte count that must be re-recorded.

**Keep it separate from the layout fixes.** Layout is CSS and one asset; prose touches all six HTML
files and runs straight through the B-004/B-005 chrome comparison.

## D-LWS-007 · Should deployment to cPanel be automated?

Raised by the owner 2026-09-19: can Claude or Cursor push to Elitehost directly? **Yes, and every
route needs a credential stored somewhere.**

| route | what it needs | who holds the secret |
|---|---|---|
| GitHub Actions + cPanel **API token** | token in GitHub repository secrets, workflow file in the repo | GitHub. **No agent ever sees it.** |
| GitHub Actions + **FTP credentials** | FTP password in GitHub secrets | GitHub, but it is an account password, not a scoped token |
| An agent calling cPanel UAPI directly | a token pasted into a session | **Not on the table.** No credential enters a chat, a file, a contract or this repository. |

**If it is done, the cPanel API token via GitHub Actions is the route.** A token is scopable and
revocable and is not the account password; the workflow file lives in the repository where it can be
reviewed; the secret is set by the owner in GitHub's own UI.

**Recommendation: not yet.** This site changed once in its life, on the day it launched. An automated
deploy earns its keep at a change rate this site does not have, and buys it with a credential to
protect. The cleanup contracts produce exactly one more upload. **Revisit after that upload, with
evidence about how often this actually happens.**

## D-LWS-008 · The bot call operator — scope it before anyone picks a stack

**This is its own repository and its own project. It is not built here.** Recorded so it is not lost.

The owner wants a phone operator that books meetings, explicitly as an alternative to publishing
personal cell numbers. Three requirements, in his words:

1. Tell the caller it is a bot, and that no information is stored.
2. Ask what times they are available and book a slot in Lucian's and/or Tumi's mailbox.
3. Offer a rating at the end, thank them for being willing to speak to a bot, and pass the rating back.

Build approach floated: an open-source library fronting a choice of models — ChatGPT, Gemini, Claude,
or a cheap strong Chinese model — chosen on cost and voice latency.

**Two correctness problems to settle before any stack question:**

- **Requirement 1 is not achievable as written.** A bot that takes a name, a number and an
  availability window and writes a calendar invite **is** storing personal information — in the
  calendar, in the mailbox, and almost certainly in the voice provider's logs and transcripts.
  Promising "nothing is stored" on a recorded line is worse than not building it, and it contradicts
  RULE 001, which this site states in writing. The honest version is a minimal-retention promise the
  system can actually keep.
- **POPIA applies.** South African processing of personal information, plus a recorded or transcribed
  call, brings consent and notification obligations. That shapes the opening script and the retention
  window on day one; it is a design input, not an end-of-project review.

Neither is a reason not to build it. Both are reasons **the first artefact is a one-page scope with
the opening script written out**, not a stack choice.

## D-LWS-009 · One shared address, reversing the "two named addresses" decision

**Decided by the owner, 2026-09-19. This reverses an earlier decision recorded the same day** — that
`hello@` be declined and the site keep `lucian@` and `tumi@`. The site will instead publish a single
**`enquiries@lumittechnology.com`**.

His call, and recorded here so the file does not quietly contradict itself. Implemented in
`LWS-P1A-005` phase 2: four `mailto:` links across `index.html` and `contact/index.html`, all of them
outside the gated chrome, and the contact page's two keyed rows collapse into one.

**Two things the owner must do, and they are sequencing, not preference:**

- **The mailbox has to exist in cPanel before this ships.** A site that publishes an address with no
  mailbox behind it bounces its own enquiries, and the contact page is the only way anyone can reach
  this business. Create it, send a test message in from outside and confirm it arrives, and only then
  upload.
- **Decide who reads it.** A shared address with no named owner is how a first enquiry goes unanswered
  for a week. Forwarding to both, or one person on the hook, either works — but it is a decision, not
  a default.

**What is being given up, stated once.** Naming two people was the reason `hello@` was declined nine
hours earlier: on a two-person consultancy's contact page, a named person reads as a direct line and a
role address reads as a queue. That is a judgement call about tone, not a correctness problem, and it
is the owner's to make. Recorded, not re-argued.

---

## Closed since the last revision

**D-LWS-004 — does `www` resolve, and to what?** Closed **yes**, 2026-09-19. `www` is a CNAME to
`lumittechnology.com.`, the AutoSSL certificate covers it, and
`https://www.lumittechnology.com/about/` lands on `https://lumittechnology.com/about/` with the path
preserved. Verified by DNS query and by navigation.
See `docs/decision/decision_20260919_site_live.md`.

## Parked by the owner — do not re-raise

- **A phone number.** No placeholder, no "coming soon". Silence reads deliberate on a consultancy
  contact page; "coming soon" reads unfinished.
- **A booking link.** "Book a landscape session" stays a `mailto:` until D-LWS-008 ships.
- **A shared mailbox.** `hello@` was declined on 2026-09-19 in favour of the two named addresses —
  and then **reversed the same day**: see D-LWS-009 below. The parked item is `hello@` as a name, not
  the idea of a shared address.

## Raised, and not this repository's to decide

`lumit_webapp` ROADMAP Phase 2 is "Public website", and behaviours `B-008` and `B-009` there cover
`apps/public-web` — the thing this repository now supersedes, and as of 2026-09-19 supersedes *in
production*. Either that phase is closed as delivered elsewhere and `apps/public-web` is retired, or
both sites exist and one is dead code. **Raise it in that repository, not here.**
