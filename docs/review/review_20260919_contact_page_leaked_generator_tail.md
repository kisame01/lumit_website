# Review — 2026-09-19 — `contact/index.html` carried a leaked generator tail

**Found by:** the planner (Claude Opus 5 High), during the LWS-P1-001 kickoff baseline listing
**Severity:** defect, not an outage · **Fixed:** yes, same session, by the planner
**Related:** D-LWS-001 (this finding decided it), `LWS-P1A-001` revision 2

---

## What was wrong

`contact/index.html` was 16,049 bytes. From line 99 to the end of file it carried:

- an **unterminated `<script>`** — one `<script>`, zero `</script>` in the whole file — holding the
  generator's `SERVICES` array and its un-rendered services-page template, template literals and all;
- a **duplicate** `</main>`, `<section class="closing">` and `<footer>`.

Tag counts at the time, against the other five pages which were all clean:

| page | `</main>` | `<script>` | `</script>` | `<footer>` | `<section class="closing"` |
|---|---|---|---|---|---|
| `contact/index.html` | 2 | 1 | **0** | 2 | 2 |
| the other five | 1 | 0 | 0 | 1 | 1 |

## Why it was invisible

A browser parsing an unclosed `<script>` consumes the rest of the document as script source. The
page's real header, content, closing block and footer are all on lines 1–98 and rendered correctly,
so **the contact page looked right in a browser and looked right to the owner.** It was visible only
in the markup, and only to something that counted tags.

That is the finding worth carrying forward: *"it renders"* is not evidence that a page is correct,
and a hand-generated site has no compiler to say otherwise. This is the gap `LWS-P1A-001` exists to
close.

## What was done

A pure deletion: everything from the old line 99 to just before `</body>`, with the file then ending
exactly as the five clean pages do (`</footer>` · `</body>` · `</html>`). **No content was rewritten
and no line was re-typed.**

**16,049 bytes → 5,173 bytes**, verified by directory listing after landing, not by the report of the
tool that wrote it.

## Proof nothing real was lost

Counted before and after, on the corrected tree:

- `mailto:` links on `/contact/` — **3, unchanged**. The two mailboxes are intact.
- exactly one `<h1>`, one `<title>`, one non-empty `<meta name="description">`.
- canonical still `https://lumittechnology.com/contact/`.
- internal `href="/…"` on `/contact/` — **12 → 11**. The one lost link is the duplicated closing
  block's own `href="/contact/"`. This is the whole of the delta, and it is why the site-wide total
  in the contract moved from 69 to 68.

An independent dry-run of all four checks (B-001 to B-004) against the corrected tree returns **zero
violations**, so the contract's "0 on a clean tree" prediction holds after the fix. That run was the
planner's own, is not the deliverable, and does not relieve the coder of building and running theirs.

## Consequences

1. `LWS-P1A-001` §7 baseline for `contact/index.html` is **5,173**, not 16,049. A contract that froze
   16,049 would have built a gate certifying a defective file.
2. §5's link total is **68**, `/contact/` is **11**.
3. **B-004 now requires each shared block to occur exactly once per page**, reported as a violation
   before any comparison. Revision 1 did not say whether to compare the first footer or all of them —
   with two footers on this page, one reading passed and the other failed permanently. Unimplementable
   as written, and found only because the defect was found first.

## Open, not fixed here

Every page preconnects to `fonts.googleapis.com` and `fonts.gstatic.com` and loads a stylesheet from
Google. `contact/index.html` tells the visitor the site "runs no tracking, sets no cookies requiring
consent, and keeps no database of visitors." That sentence is narrowly true, but every visitor's IP
reaches Google on every page load, and "no third-party script" is listed as a settled constraint in
the LWS-P1-002 kickoff. Self-hosting the two families closes it for roughly 200 KB under `assets/`.
**Not blocking, not decided, owner's call.**
