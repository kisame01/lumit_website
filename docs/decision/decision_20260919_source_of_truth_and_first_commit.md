# Decision — 2026-09-19 — source of truth, docs cleanup, and the shape of the first commit

**Task:** LWS-P1-001 · **Decided by:** the owner · **Recorded by:** the planner (Claude Opus 5 High)
**Status:** settled. D-LWS-001, D-LWS-002 and D-LWS-003 are closed by this record.

---

## D-LWS-001 · The six HTML files are the source of truth — option A

Content changes are made by editing the six `index.html` files directly. `build_site.py` and
`site.html` are historical, are not reconstructed, and are not coming back.

**What decided it.** On 2026-09-19 the planner found that `contact/index.html` had shipped with a
leaked generator tail — an unterminated `<script>` and a duplicated closing block and footer. That is
precisely the class of defect a generator produces and hand-editing never would. Restoring the
generator (option B) would have meant reconstructing, from memory, the thing that caused the bug.

**What pays for the loss.** The shared header, closing block and footer are the only part a generator
actually protected. `LWS-P1A-001` check **B-004** enforces that they stay byte-identical across all
six pages, and now also that each appears exactly once per page.

**Revisit if** the page count passes ten, or if a content change ever has to be made in more than
three files at once.

## D-LWS-002 · The remaining QuondaLearn files are deleted before the first commit

The handover's §2.4 table was stale — the eleven decisions, nine reviews, eight ADRs and two notes
were already gone. Six files remained, about 44 KB, all of them QuondaLearn's frozen exam spec and
its fixtures:

```
docs/ai/exam_authoring_prompt.md
docs/conformance/scoring_cases.json
docs/conformance/validation_cases.json
docs/samples/sample_exam.json
docs/samples/sample_exam.xml
docs/schema/exam_schema.json
```

Deleted by the owner, in Explorer, before `git init`. **Kept:** `docs/naming_convention.md`, the two
empty templates (`adr_template.md`, `cjr_template.md`), the four `*_template.md` records the owner
deliberately retained as one format example each, and the whole of `docs/context/`.

The reasoning is unchanged from the handover and worth keeping in one line: a first commit that
asserts this project made eleven decisions about exam scoring is not untidiness, it is a false
record, and nobody ever goes back and fixes commit one.

## D-LWS-003 · Public, on `kisame01` — answered by events

`https://github.com/kisame01/lumit_website` exists, is empty, and returned its contents to an
unauthenticated fetch on 2026-09-19, which is what makes it public rather than a claim that it is.

**Public was also the recommendation, and the reason stands:** GitHub does not enforce rulesets on
private repositories on a free plan, so branch protection here is free only because the repository is
public. This site's source is six pages of marketing HTML with no secret, no client name and no
personal data in it — the one repository in the estate where public costs nothing and buys the
control.

## Sequence

Gate first, then the first commit. `LWS-P1A-001` is revised and ready to issue; the coder implements
it against a working tree that is still not under version control; the planner reviews the report
adversarially; **then** the owner runs `git init`, the first commit and the push.

The cost of that order is honest and should be written down: until the push happens, this site exists
in exactly one place on one machine, with no history and no remote.
