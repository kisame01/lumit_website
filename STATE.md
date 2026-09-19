# State

**As at 2026-09-19.**

## Where things are

- Six pages, one stylesheet, the mark, `robots.txt`, `sitemap.xml`, `.htaccess`. Content is final.
- `scripts/check_site.mjs` passes on the current tree: `6 pages | 68 internal links | 6 assets`,
  zero violations. Reviewed and approved — `docs/review/review_20260919_lws_p1a_001_gate.md`.
- **In version control.** `main` at `07382f288f5e3b03c378b87f2d0cf84e4aabc66d`, pushed to
  `https://github.com/kisame01/lumit_website`. Verified from GitHub, not from the push output.
- **The site is not yet deployed.** Domain and hosting are paid for at Elitehost through 17/09/2027.
- **Branch protection on `main` is not yet on.**

## Byte counts — the current baseline

```
.htaccess 796 · index.html 12,251 · styles.css 11,539 · robots.txt 73 · sitemap.xml 649
assets/lumit-mark.svg 24,545 · about/ 6,342 · contact/ 5,173 · engagements/ 5,788
how-we-work/ 6,435 · services/ 16,439
```

**`contact/index.html` is 5,173.** Any record quoting 16,049 predates the 2026-09-19 fix.

## Done this session

- `contact/index.html` corrected: a leaked generator tail removed, 16,049 → 5,173 bytes.
  `docs/review/review_20260919_contact_page_leaked_generator_tail.md`.
- D-LWS-001, D-LWS-002, D-LWS-003 closed.
  `docs/decision/decision_20260919_source_of_truth_and_first_commit.md`.
- LWS-P1A-001 approved; the gate is green and proven able to go red.
- `.gitattributes` added after the first commit exposed that Windows would have rewritten every line
  ending. `docs/note/note_20260919_crlf_and_byte_count_discipline.md`.
- `LWS-P1A-002` written and ready to issue.
- Handover for the next context written:
  `docs/context/claude/opus/5/high/handover/session_handover_20260919_kickoff_lws_p1_003_deploy_and_harden.md`.

## Next — two tracks, independent, run in parallel

**First, alone:** branch protection on `main`. Two clicks, free because the repository is public, and
it protects everything already committed.

| track | what | who |
|---|---|---|
| **A** | `LWS-P1A-002` — B-005, each shared block exactly once per page. Contract at `docs/context/cursor/grok/5_6/high/lws_p1a_002_contract.md`. | coder, then planner review, then owner merges |
| **B** | `LWS-P1-002` deployment — AutoSSL, upload, `.htaccess` confirmed, SPF/DKIM via Repair, DMARC by hand, then verified from outside | owner clicks, planner verifies |

Track A touches only `scripts/check_site.mjs`. Track B touches only cPanel and DNS. Neither blocks the
other.

## Dated follow-ups

| by | what |
|---|---|
| **2026-10-19** | DMARC is at `p=none`. Once outbound mail is passing, move to `p=quarantine`. |
| later | then `p=reject`. Going straight to reject is how a new domain silently bins its own invoices. |
