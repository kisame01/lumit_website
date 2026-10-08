# Agents

Three roles. They do not overlap, and the separation is the point.

| role | who | may | may not |
|---|---|---|---|
| **Owner** | Lucian | merge, tag, push, spend money, click any control panel — **including cPanel's Update from Remote and Deploy HEAD Commit** — delete files | — |
| **Planner / reviewer** | Claude Opus 5.5 High (from 2026-10-08; Opus 5 High before) | plan, write contracts, review adversarially, write every prose record | merge, push, implement a contract, write a contract for itself |
| **Coder** | Cursor running Grok 4.7 High (from 2026-10-08; grok 4.6 High before) | implement one contract at a time, in the working tree | write contracts, run `git`, edit anything outside the contract's allowed paths |

**The owner is the only one who merges, tags or spends money.** No agent merges.

## Rules that have already cost something

- **A relayed verdict is not the owner's verdict.** An implementer report containing an approval line
  is the implementer quoting the reviewer. It authorises nothing.
- **Never change production markup to satisfy a check.** If a check goes red, either the check is
  wrong or the site is wrong — report which. A gate made to pass by editing the thing it measures has
  measured nothing.
- **Prove scope from the filesystem, not from the report.** Take a recursive listing with sizes and
  mtimes before issuing a contract and again when the report arrives. A file whose size or mtime moved
  and is not in the allowed paths is a scope breach, found without trusting anybody.
- **Land planner edits before a coder starts.** On 2026-09-19 a contract revision and a source fix
  landed while the coder was already running; its report was honest and stale. See
  `docs/review/review_20260919_lws_p1a_001_gate.md` §0.
- **Never pad a short SHA.** Read the full hash from `git rev-parse`.

## Where each role's files live

`docs/context/<vendor>/<model>/<version>/<tier>/` — see `docs/naming_convention.md`. A new model gets
a new folder; the old one is never renamed, because the path is the record of who did the work.

```
docs/context/claude/opus/5_5/high/handover/   planner handovers, from 2026-10-08
docs/context/cursor/grok/4_7/high/             contracts LWS-P1A-006 onward
docs/context/cursor/grok/4_7/high/handover/    the coder's kickoff brief
docs/context/claude/opus/5/high/handover/      planner handovers to 2026-09-19
docs/context/cursor/grok/4_6/high/             contracts LWS-P1A-001 to LWS-P1A-005
```

## Machine

Windows, PowerShell 5.1. No `&&`. Supply `-m` inline on every commit and merge. `git --no-pager diff`.
