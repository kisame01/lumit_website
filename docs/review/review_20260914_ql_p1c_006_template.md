# REVIEW — QL-P1C-006 (B-053, review renders the correct answer visually) — APPROVE

Written 2026-09-14 by the planner/reviewer context that wrote QL-P1C-006, reviewed the
implementation report against the tree, and saw B-053 merged and pushed.

**Verdict: APPROVE, merged at `1bab21cb59b6985d12a86564ea1510136a308438`.**
`main == origin/main == 1bab21c`, confirmed by `git ls-remote origin main`; the push transcript
reads `fc0a807..1bab21c  main -> main`. The merge is a true `--no-ff` with two parents,
`fc0a8079883aebb0f3621ff86a8e6d0bc3905106` and `56f13b0fee394698fd45c312195fc27b02e70045`, carrying
`Task: QL-P1C-006` and `Behaviour IDs: B-053`.

The behaviour record — what landed, the eleven tests, the five mutations and the five recorded
weaknesses — is in the **B-053 owner declaration in `BEHAVIOR_CATALOG.md`**. This file records how
the review was conducted and what the session learned.

---

## 1. How the review was conducted

No shell. `device_bash` is dead (finding 81). Everything below came from `device_list_dir`,
`device_stage_files` and reading in the container.

* **Git objects, not reports.** `.git/HEAD`, `.git/refs/heads/main`,
  `.git/refs/heads/feat/ql-p1c-006-review-answer-overlay`, `.git/refs/remotes/origin/main` and the
  tail of `.git/logs/HEAD` were staged and read. The reflog shows one commit on the branch, no
  orphan, no block run twice, and confirms the branch was cut from `fc0a807` as reported.
* **Counts re-derived, not checked.** All 84 test files and 19 e2e specs were staged and counted in
  the container: **84 / 633 plain `it(` / 6 `it.each` sites / 23 expansions / 656 / 47**. Every
  figure in the report matched. The B-053 letter sweep across all quote styles returned `A` through
  `K`, each exactly once.
* **Scope proven by a before-and-after directory listing.** See §2.
* **Size-delta arithmetic** reconciled `ReviewScreen.tsx` to the byte (§2).
* **Mtime forensics** corroborated the reported order of commit, gates and mutations (finding 129).
* **Not verifiable from here:** the gate banner and the 656/51 run outputs. `node_modules` is
  Windows-native; the reviewer cannot run Vitest or Playwright. Those remain reported, not measured.

## 2. The scope proof

While researching the contract, the reviewer listed `web/tests`, `web/e2e` and `web/src`
recursively. After the branch commit it listed all three again.

* **All 83 pre-existing test files: identical size and identical mtime.** Not one was opened.
* **All 19 e2e files: identical size and identical mtime.**
* **Every `src` file identical** except `ReviewAnswerVisual.tsx` (new, 3,262 bytes) and
  `ReviewScreen.tsx` (3,823 -> 3,939).
* `package.json` and `pnpm-lock.yaml` at their pre-task mtimes — no dependency.
* `Hotspot.tsx`, `DragDrop.tsx`, `QuestionImage.tsx` at their pre-task mtimes — the three forbidden
  components were never opened, so B-007's never-disclose guarantee and B-059 D were never at risk.

`ReviewScreen.tsx`'s **+116 bytes is exactly** the 59-byte import line plus the 57-byte element
line. Two lines, nothing else.

**This is a stronger no-weakened-tests proof than any report can give**, and it cost two tool calls
because the pre-task listing already existed. See finding 136.

## 3. What the implementer did better than the contract asked

* **`B-053 C`'s fixture sets `answer: ["r-poly", "r-rect"]` out of declaration order** and asserts
  `["r-rect", "r-poly"]`. The contract asked for declaration order; this fixture makes the test
  fail an implementation that iterates `answer` instead of `regions`. Nothing required that choice.
* **`B-053 G` asserts the filled marker's presence and its absence** on the unanswered zone in one
  test, which is the vacuity probe the contract asked for, done without being reminded twice.
* **M1 was reported against the prediction, not conformed to it.** I and J red, A-H and K green —
  stated as measured, including the greens.

Five consecutive APPROVE-first-time tasks now, QL-P1C-002 through QL-P1C-006, every count
prediction hit exactly. **Zero implementer defects across three consecutive contracts. The binding
constraint remains the contract's precision.**

## 4. Findings

Lists 1-135 still bind. New:

136. **A DIRECTORY LISTING TAKEN BEFORE THE CONTRACT IS ISSUED IS THE CHEAPEST SCOPE PROOF THERE
     IS.** Comparing a pre-task recursive listing of `web/tests`, `web/e2e` and `web/src` against a
     post-commit one proved that none of 102 existing test and spec files had been touched —
     without reading one of them, without a shell, and without trusting a single line of the
     report. Size *and* mtime must both match: finding 106's trap applies in reverse here, because
     on a branch commit (not a merge) an untouched file's mtime does not move at all. **Take the
     listing deliberately, as the last step of writing the contract**, not by luck. It converts the
     WORKFLOW.md review checklist's first question — "only allowed paths touched?" — from an
     inspection into a comparison.
137. **A "MAY REDDEN" CLAIM MUST NAME THE FIXTURE'S SHAPE, NOT ONLY THE TEST.** Finding 131 said a
     prediction has to be grounded in the candidate test's body. The refinement this task supplies:
     what made the `B-059 F` prediction checkable was naming **that it mounts `ReviewScreen` with an
     `mcq-single`** — because the component under contract returns `null` for mcq types, and that
     single fact decided the prediction. A claim of the form "test X may redden" is unfalsifiable
     until it says which input X uses. Write the fixture's type, id or value into the prediction,
     and the implementer can check it in one read instead of running the suite to find out.

## 5. Open after this task

* **The overlay's positioning is unwitnessed** — weakness 1 of the declaration, and the natural
  sibling of the degenerate-rect call-site gap already listed as unnumbered work. Both are the same
  lesson: a thing is drawn, and that it is drawn *correctly in place* is assumed. An e2e witness is
  the only real one, since jsdom computes no layout.
* **Whether the raw region ids should disappear from review now that the picture is there** is a
  product question for the owner and a requirement change. `web/e2e/helpers.ts` lines 156-161 pin
  the current answer, so it cannot be done quietly.
* **The punctuation split** — `First zone -> One` in the text list, `First zone: One` in the visual.
  Cosmetic; fold into whichever task next opens either file.
