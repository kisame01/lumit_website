# State

**As at 2026-09-19.**

## Where things are

- Six pages, one stylesheet, the mark, `robots.txt`, `sitemap.xml`, `.htaccess`. Content is final.
- `scripts/check_site.mjs` passes on the current tree: `6 pages | 68 internal links | 6 assets`,
  zero violations. Reviewed and approved — `docs/review/review_20260919_lws_p1a_001_gate.md`.
- Remote: `https://github.com/kisame01/lumit_website`, public.
- **The site is not yet deployed.** Domain and hosting are paid for at Elitehost through 17/09/2027.

## Done this session

- `contact/index.html` corrected: a leaked generator tail removed, 16,049 → 5,173 bytes.
  `docs/review/review_20260919_contact_page_leaked_generator_tail.md`.
- D-LWS-001, D-LWS-002, D-LWS-003 closed.
  `docs/decision/decision_20260919_source_of_truth_and_first_commit.md`.
- LWS-P1A-001 approved.

## Next

1. **LWS-P1A-002** — B-004 must require each shared block to appear exactly **once** per page. Today
   a duplicated footer passes, proven by test. Preventive: nothing on the current tree is un-gated.
2. **Deploy** — `LWS-P1-002`. AutoSSL first, upload second, check `.htaccess` landed, then Email
   Deliverability → Repair for SPF and DKIM, then add DMARC by hand.

## Dated follow-ups

| by | what |
|---|---|
| **2026-10-19** | DMARC is at `p=none`. Once outbound mail is passing, move to `p=quarantine`. |
| later | then `p=reject`. Going straight to reject is how a new domain silently bins its own invoices. |
