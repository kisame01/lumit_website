# NOTE 2026-09-13 — a locked drive reads as a dead bridge, and QL-P1C-001's contract defects

Written by the planner/reviewer context after independently verifying the QL-P1C-001 merge at
`2d258dd` and the B-055 declaration at `860cf6f`. Two unrelated findings, both from this block.

---

## 1. Finding 119 — A LOCKED DRIVE LOOKS EXACTLY LIKE FINDING 81, AND IS NOT

**Symptom.** `mcp__remote-devices__get_device_info` reported `D:\dev\projects\quondolearn` in
`connectedFolders`, while `device_list_dir` and `device_stage_files` both failed on that exact path
with `Could not stat`, and `device_request_folder_access` was refused with *"a requested folder
can't be granted to this session; ask the user to connect the folder using the folder picker."*

**Cause. The drive was password-locked.** The owner unlocked it and every tool worked on the next
call, with no reconnection, no re-grant and no app restart.

**The wrong conclusion, which this context reached and published before asking:** that finding 81 —
the 8 September Windows update that killed `device_bash` — had escalated from the shell to the file
tools, and that the documented workaround was therefore gone. That was wrong, and it was stated to
the owner as a diagnosis rather than as a hypothesis.

The confusion is easy to fall into because `device_bash` **is** genuinely dead and its own error
text says *"use device_stage_files / device_commit_files instead"* — so when those also fail, the
escalation story fits every visible fact.

**The rule: `connectedFolders` listing a path that cannot be stat'd means the VOLUME is
unavailable, not that the bridge is broken.** Before diagnosing anything, ask the owner one
question: *is that drive unlocked?* It costs one line and it is the difference between a five-second
fix and a session spent working around a problem that does not exist.

`get_device_info` is the discriminator and it still worked throughout: a bridge that can answer
`get_device_info` is connected. Finding 81 remains what it was — `device_bash` only — and the
stage/commit workaround remains valid.

## 2. Finding 120 — THE CONTRACT'S PER-FILE TABLE AND ITS TOTAL DISAGREED, AND THE TOTAL WAS COPIED

QL-P1C-001 §3.4 published a grep table of `createPersistedAttempt(` occurrences — 1 declaration,
2 in `App.tsx`, 5 + 2 + 2 + 2 across four test files — and then stated the total as **thirteen**.
`1 + 2 + 11 = 14`. The planner added it wrong; the table was right.

The implementer echoed **thirteen** back in its report rather than re-adding the table it had just
satisfied. The reviewer caught it and the B-055 declaration records the correction.

**The rule: a contract that publishes both a breakdown and a total invites the reader to trust the
total.** Recount every total against its own table before sending, and treat a figure the
implementer merely repeats as unverified — a number that comes back unchanged is not evidence that
anyone checked it.

## 3. Three contract lines that were wrong, all planner defects

Recorded because ten consecutive tasks (-024 through -032) ran without an implementer pushback and
this one produced three. The binding constraint remains contract precision.

1. **§3.3 prescribed a render-time ref read.** `mode={launchOptionsRef.current.mode ?? "exam"}` in
   JSX; `react-hooks` rejects it, two lint errors. The planner had read `App.tsx` in the same block
   and could see `launchOptionsRef` was touched only inside callbacks and effects. The implementer
   replaced it with an `examMode` state set in `startExam` and `resumeExam` — same default, same
   retake path — which is what the contract should have said.
2. **§4 invented a testing-library option.** `getByRole(..., { exact: true })`; RTL's `ByRoleOptions`
   has no `exact`. Dropped; radio names are unique. Playwright's `exact` in `show-answer.spec.ts` is
   a different API and was correct.
3. **§5 M5 predicted a red that could not happen.** See §4 below.

Standing finding 109 covers the class: **the fact was in hand and the contract contradicted it.**

## 4. The M5 prediction was wrong, and the gap it exposed is real

The contract predicted `score-conformance.test.ts` would redden when `Math.round` became
`Math.floor` in `src/core/score.ts`, and said that if it stayed green, that would be a bigger
finding than the task. **It stayed green.**

The five fixture percentages in `docs/conformance/scoring_cases.json` are **100.0, 20.0, 40.0, 30.0
and 0.0** — every one an integer, so half-up and floor agree on all of them. **The conformance
fixtures, the designated cross-platform truth, contain no witness for SCORE-1's rounding rule.**

The rule itself is covered: `score.test.ts` B-011 caught 66.7 becoming 66.6 and 6.3 becoming 6.2,
and e2e `B-048 S` caught `Percent: 66.7%` becoming `66.6%`. So this is not a hole in the product's
tests — it is a hole in the artifact a second implementation would be checked against. A different
scorer using floor or banker's rounding would pass conformance and disagree with this one on any
non-integer percent, which is most real sits.

**Closing it means a content edit to `docs/conformance/scoring_cases.json`, which needs the owner's
explicit authorisation in as many words.** The ADR-0008 authorisation covers `prompt` capacity and
is spent. No fixture was changed to force a mutation failure, which was the correct call.

Recorded as weakness 1 of the B-055 declaration. **Open owner item.**

## 5. What was verified independently for the B-055 closeout

Read from the tree at `860cf6f` by this context, not taken from any report:

* `.git/logs/HEAD` corroborates the full history with no orphan:
  `e3928b2` -> `6b236bd` -> `5fed3dd` -> `8badd55` -> merge `2d258dd` -> `860cf6f`.
* `applyLaunchOptions` never reads `mode`; the identifier appears once in `launchOptions.ts`, in the
  interface.
* `ExamRunner` takes `mode` as a required prop and gates **both** the button and the panel on
  `mode === "practice"`.
* `persistence.ts` carries `mode: examModeSchema.optional()` on the persisted attempt **and** the
  in-progress record, the `examModeMatchesExamMode` guard is wired through the existing
  `MutuallyAssignable` helper, and `createPersistedAttempt` takes `mode` **required**, sixth, before
  the optional `sections`.
* `App.tsx` passes `mode={examMode}` — state, not a ref — writes mode on both attempt paths and on
  the in-progress record, and **`record.sectionIds` survives at the expired-resume call site**, which
  was the regression risk when a required parameter was inserted ahead of it.
* `src/core/score.ts` is byte-identical to its pre-task size (4588) with `Math.round` restored, and
  `src/core/schema.ts` is untouched — same bytes and same mtime as before the task. The exchange
  format never moved.

## 6. Process note, recorded once

The B-055 catalogue declaration was prepared by the reviewing context rather than by this planner,
and the contract's forbidden list named `BEHAVIOR_CATALOG.md` precisely so a task cannot declare its
own behaviour Verified. **On inspection the declaration is sound** — it records six weaknesses,
names the rounding gap, corrects the occurrence arithmetic and discloses the contract corrections
and the extra commits. It is a better record than the contract that produced it. Nothing needs
redoing; the rule stands for the next one.
