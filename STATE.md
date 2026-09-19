# State

**As at 2026-09-19.**

## Where things are

- Six pages, one stylesheet, the mark, `robots.txt`, `sitemap.xml`, `.htaccess`. Content is final.
- `scripts/check_site.mjs` passes on the current tree: `6 pages | 68 internal links | 6 assets`,
  zero violations. Reviewed and approved — `docs/review/review_20260919_lws_p1a_001_gate.md`.
- **In version control.** First commit `7d72c00e314e43b1ef9f0ce743ca5af495c61dc0`, 37 files, 3,933
  lines, pushed to `https://github.com/kisame01/lumit_website` on `main`. Verified from outside, not
  from the push output.
- **The site is not yet deployed.** Domain and hosting are paid for at Elitehost through 17/09/2027.

## Done this session

- `contact/index.html` corrected: a leaked generator tail removed, 16,049 → 5,173 bytes.
  `docs/review/review_20260919_contact_page_leaked_generator_tail.md`.
- D-LWS-001, D-LWS-002, D-LWS-003 closed.
  `docs/decision/decision_20260919_source_of_truth_and_first_commit.md`.
- LWS-P1A-001 approved; the gate is green and has been proven able to go red.
- `.gitattributes` added after the first commit exposed that Windows would have rewritten every line
  ending. `docs/note/note_20260919_crlf_and_byte_count_discipline.md`.

## Next

1. **Branch protection on `main`** — free, because the repository is public. Not yet on.
2. **LWS-P1A-002** — B-004 must require each shared block to appear exactly **once** per page. Today
   a duplicated footer passes, proven by test. Preventive: nothing on the current tree is un-gated.
3. **Deploy** — `LWS-P1-002`. AutoSSL first, upload second, check `.htaccess` landed, then Email
   Deliverability → Repair for SPF and DKIM, then add DMARC by hand.

## Dated follow-ups

| by | what |
|---|---|
| **2026-10-19** | DMARC is at `p=none`. Once outbound mail is passing, move to `p=quarantine`. |
| later | then `p=reject`. Going straight to reject is how a new domain silently bins its own invoices. |
