# Naming convention

Adopted 2026-09-12 by Iam. Applies to `docs/**` in this repository and is the intended standard for
his other projects. **The convention is a rule about paths, never about content** — renaming a file
does not license editing what is inside it.

## The rule

**`lower_snake_case` for every file and folder under `docs/`.** No hyphens, no dots inside a stem, no
capitals. `sample_exam.json`, not `sample-exam.json` or `sample.exam.json`.

Records that come in numbered series carry their abbreviation and a zero-padded four-digit number:

```
<abbr>_<nnnn>_<slug>.md
```

| kind | folder | pattern | example |
|-|-|-|-|
| Architecture Decision Record | `docs/adr/` | `adr_<nnnn>_<slug>.md` | `adr_0008_prompt_capacity.md` |
| Change Justification Record | `docs/changes/` | `cjr_<nnnn>_<slug>.md` | `cjr_0001_playwright.md` |
| Decision | `docs/decision/` | `decision_<yyyymmdd>_<slug>.md` | `decision_20260912_b034_findings_and_b051_scoping.md` |
| Templates | alongside their series | `<abbr>_template.md` | `adr_template.md`, `cjr_template.md` |

**Decisions are date-stamped, not numbered**, because they record what was settled on a day rather
than a numbered artefact in a series. ADRs and CJRs are numbered because they are cited by number.

## Agent context

Context files are filed by **who produced them**, so a file's path states its provenance:

```
docs/context/<vendor>/<model>/<version>/<tier>/<kind>/<file>.md
```

The two lanes in use:

| role | path | contents |
|-|-|-|
| **steerer** (planner / adversarial reviewer) | `docs/context/claude/opus/5/high/handover/` | `session_handover_<yyyymmdd>_post_<task>.md` |
| **coder** (implementer) | `docs/context/cursor/grok/4_6/high/` | `<task>_contract.md`, e.g. `ql_p1b_031_contract.md` |

A version segment that contains a dot uses an underscore: `4_6`, `5_1`. When a model or tier changes,
a new folder is created rather than the old one being renamed — **the path is the record of which
model did the work**, so history stays attributable.

`docs/context/**` is tracked. Contracts and handovers are part of the repository now, not scratch.

## What this convention does NOT touch

* **Root files keep their existing names** — `README.md`, `AGENTS.md`, `CLAUDE.md`, `CODEOWNERS`,
  `SECURITY.md`, `CONTRIBUTING.md`, `BEHAVIOR_CATALOG.md`, `WORKFLOW.md`, `ROADMAP.md`,
  `ARCHITECTURE.md`, `SYSTEM_STORY.md`, `DATA_DICTIONARY.md`, `RECOVERY.md`, `RISK_REGISTER.md`,
  `TRACK_A_REPORT.md`, `TRACK_B_REPORT.md`, `PROJECT_INSTRUCTIONS.md`, `holy_developer_bible.md`.
  `holy_developer_bible.md` line 411 names these as the required repository files in this exact case,
  and several of them are looked up by exact name by GitHub and by agent tooling.
* **Identifiers are not filenames.** `ADR-0005`, `CJR-0001`, `B-034`, `QL-P1B-031` and `SCORE-1` keep
  their form in prose. Only the *path* to a document changes.
* **Historical records are not rewritten.** `BEHAVIOR_CATALOG.md` declarations, `TRACK_A_REPORT.md`,
  `TRACK_B_REPORT.md` and everything under `docs/context/` keep the paths they were written with. A
  declaration that said `docs/EXAM_FORMAT_SPEC.md` in August was accurate in August; editing it now
  would falsify an append-only record to make a cosmetic point.
* **`web/**` is not renamed.** Source and test filenames stay `kebab-case.test.ts` as they are; only
  the *strings inside them that point at `docs/`* were updated.

## Cost of the rename, recorded once

Twelve files under `web/` held hard-coded paths into `docs/` and would have gone red on the next
`pnpm test`. One conformance fixture, `docs/conformance/scoring_cases.json`, carried a path **inside
its own data** (`"examFile": "../samples/sample-exam.json"`). That edit was approved by Iam on
2026-09-12 as a path follow-on: no case, no expectation and no score value changed.

**A path that lives inside a data file is the one a rename always misses.** Before renaming anything
under `docs/` again, grep the fixtures for the old name, not just the code.

Two further traps, both paid for on 2026-09-12 and both worth re-reading before the next rename:

1. **A case-only rename does nothing on Windows, and git reports success.** `EXAM_FORMAT_SPEC.md` ->
   `exam_format_spec.md` and `EXAM_AUTHORING_PROMPT.md` -> `exam_authoring_prompt.md` changed only
   case, so the case-insensitive filesystem never presented a new path and `git add -A` staged
   nothing for the first and a bare modification for the second. The commit would have kept both old
   names while every document pointed at the new ones — and `/docs/EXAM_FORMAT_SPEC.md` in
   `CODEOWNERS` would have silently stopped matching the frozen spec. **`git mv --force <old> <new>`
   is the fix; it operates on the index rather than the filesystem.** Every other rename here also
   changed a hyphen or a dot, so only these two were exposed. **After staging, read the status for
   renames you expected and did not get.**
2. **Sweep the whole tree, not a sample of it.** The first pass grepped only the files that looked
   like fixture loaders, and missed `library-state.test.ts` — which reads `sample_exam.json` but is
   not named like a conformance test. The gates caught it. **A grep over a hand-picked subset is not
   evidence; only a grep over every file is.**
