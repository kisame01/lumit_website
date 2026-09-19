# QuondaLearn — Planner/Reviewer Handover, post Phase 1B closure

**PHASE 1B IS CLOSED, TAGGED `v0.2.0`, AND PHASE 1C IS OPEN AND GATED ON B-055. THERE IS NO WORK
IN FLIGHT.** Nothing is with the implementer. Nothing is awaiting review. `main` is clean and
pushed.

**YOUR FIRST JOB IS TO WRITE ONE CONTRACT: B-055, practice mode.** §5 has everything it needs.
If the owner has not asked for it, §6 applies and you stop.

Written 2026-09-13 by the planner/reviewer context that repaired and merged QL-P1B-032, declared
B-074, ran the Phase 1B exit review, and recorded the three phase closures.

**Read §0, then §1, then §5. §2 is the state you must verify before your first claim.**

---

## 0. FILE LAYOUT

`lower_snake_case` for every file and folder under `docs/`. `docs/naming_convention.md` is the full
rule. Root files keep their SCREAMING_CASE names. **Identifiers are not filenames:** `ADR-0009`,
`B-055`, `QL-P1C-001` keep their form in prose.

```
docs/context/claude/opus/5/high/handover/   session_handover_<yyyymmdd>_<slug>.md   <- you
docs/context/cursor/grok/4_6/high/          <task>_contract.md                      <- the coder
docs/decision/  docs/review/  docs/plan/  docs/note/                                <- records
```

**Write the next contract straight to `docs/context/cursor/grok/4_6/high/ql_p1c_001_contract.md`
and give the owner the path, not a chat code block.** Nine blocks running; it defeats paste
truncation. The task-ID pattern moves with the phase: `QL-P1B-032` was the last of Phase 1B, so
Phase 1C starts at **QL-P1C-001**. Confirm that with the owner in one line before you use it.

### THE FOURTEEN UNMIGRATED HANDOVERS: DO NOT START THIS JOB

Roughly fourteen old handovers exist only in the Claude Project, not in git. **Every DECISION,
REVIEW, NOTE and PROJECT_PLAN document is already in the repo** — that was the urgent half and it
is done. The handovers are each superseded by their successor; this file is the only one describing
the current state.

An earlier context read a previous handover, treated this as work to pick up while waiting, and
burned **thirty minutes and half the owner's four-hour credit window** producing nothing that
reached the repo or the Project. Finding 111. `AGENTS.md` hard rule 11 and
`docs/decision/decision_20260913_planner_idle_cost.md` make it binding.

**Rule: do not begin this without the owner asking for it in the same session.** If you have a gap,
you do not have work.

---

## 1. Bridge status — `device_bash` is dead; the browser pane is newly useful

**`device_bash` cannot mount the drive.** It fails with
`sandbox-helper: no Plan9 drive shares mounted under /mnt/.virtiofs-root/shared`, named by the tool
as caused by a Windows update released 8 September 2026. **Finding 81 is permanent. Assume you have
no shell from your first tool call.** A `ToolSearch` reload does not fix it. `device_list_dir`,
`device_stage_files` and `device_commit_files` work normally, and `device_request_folder_access` on
`D:\dev\projects\quondolearn` is granted immediately.

**NEW, AND IT CHANGES WHAT YOU CAN EVIDENCE YOURSELF: the browser pane reaches a dev server running
on the owner's own machine.** `Claude_Browser__preview_start` on `http://localhost:5173/` — after
one `request_access` call — loaded the app and `get_page_text` read its Library screen. That is how
the Phase 1 clean-clone clause was verified this block **without asking the owner what he saw**,
which is what he wants: his role is decisions, not relaying output. **It cannot drive a file input**,
so anything requiring an upload still needs him or an e2e test.

### Proving scope without a shell

**THE MTIME SWEEP IS THE DEFAULT.** Read `main`'s tip commit time, then list `web/tests` and
`web/e2e` and find every file whose mtime is newer. A `git checkout` rewrites only files that
differ, so untouched files keep pre-branch mtimes. On QL-P1B-032 that returned exactly the one new
spec and nothing else. Fall back to the size sweep for forbidden witnesses whose byte counts a
contract published in advance. Finding 106.

### Editing a repo file with no shell

1. `device_stage_files` the file; record `mtimeMs` for `expectedMtimeMs`.
2. Edit in the **container** with a python3 heredoc, `encoding="utf-8", newline=""`, asserting each
   anchor occurs exactly once and re-asserting no `\r`, no BOM, no U+FFFD.
3. Write the result to a **fresh path** under `/mnt/user-data/outputs/` — see finding 114.
4. `device_commit_files` with `stagedPath`.
5. **VERIFY THE LANDED BYTE COUNT WITH `device_list_dir`. EVERY TIME. NO EXCEPTIONS.** Skipping this
   on one file cost a full round trip this block.

**Patch a big file without reading it.** `BEHAVIOR_CATALOG.md` is now 220,926 bytes; reading it
costs ~50k tokens and buys nothing. Stage it, locate anchors with python, assert `count == 1`,
replace, verify the landed byte count. Finding 107.

**The staged-uploads trap.** `/mnt/user-data/uploads/` holds the file as it was when you staged it.
After you commit an edit back, the uploads copy is stale.

---

## 2. State at handover

Repo `D:\dev\projects\quondolearn`, remote `github.com/kisame01/QuondaLearn`.

**`main` and `origin/main` are both `08b71b756e3f10f7017893362ecfa381f8dfcc12`**, confirmed by
`git ls-remote origin main` at the owner's console.

**Tags: `v0.1.0` (unmoved) and `v0.2.0` at `381df022f759f8c732156da4a40e0ce8b3f2eed8`.**

**No branch is in flight.** `feat/ql-p1b-032-exit-demonstration` is merged and can be deleted at the
owner's convenience; nothing depends on it.

### History this block

```
08b71b7  docs: Phase 1C opened, gated on B-055; B-053 and B-056 re-phased   <- main
64eb355  docs: ROADMAP records Phase 1, 1A and 1B closed; Phase 1C stub
381df02  docs: Iam declares Phase 1, Phase 1A and Phase 1B closed           <- v0.2.0
ce8156e  docs: Phase 1B exit review; repoint stale decision citations
2fbc5ae  docs: declare B-074 Verified at 119fb65; restore QL-P1B-032 amendment
119fb65  Merge QL-P1B-032: Phase 1B exit demonstration e2e (B-074)
506bc0a  docs: a planner with nothing to review stops; record the idle-cost incident
ebe4c03  <-- previous handover's main
```

`7e1b7802636ed208032ed752120fab850d50a7ea` is the QL-P1B-032 implementation commit, merged at
`119fb65`. `1b1160cc47b62b93b1cb2bc7e84483922aa691b2` was orphaned during the repair and recovered
as `506bc0a` — see finding 115.

### Baselines — quote these

| measure | at `08b71b7` |
|-|-|
| test files | 85 |
| plain `it(` | 629 |
| vitest tests | 657 |
| `it.each(` sites | 7 |
| `it.each` expansions | 28 |
| e2e static `^test(` | 54 |
| e2e executed | 58 |

`grep -cE '^\s*it\('` does NOT match `it.each(`, so vitest total = plain `it(` + expansions:
`629 + 28 = 657`. **THE E2E REGEX IS `grep -cE '^test\('`** — 54 static against 58 executed, the 4
being the *indented* `test()` calls inside the `for` loop in `prompt-containment.spec.ts`. **Name the
regex in every contract.** Eleven consecutive contracts have named it and eleven have come back
correct.

Toolchain: node 24.14.1, pnpm 11.20.0. Never run `corepack use`. `core.editor` is notepad, so merges
need `-m`. Full-suite duration 28.4s twice this block; finding 8 still binds.

### Behaviour status

**Verified:** B-001…B-018, B-022, B-023…B-029, B-034, B-035, B-044, B-045, B-046, B-047, B-048,
B-050, B-051, B-052, B-054, B-057, B-058, B-059, B-060, B-062, B-063, B-064, B-065, B-067, B-068,
B-069, B-070, B-071, **B-074**.

* **B-055 — exam mode vs practice mode. THE PHASE 1C GATE.** Planned. §5.
* **B-053, B-056** — re-phased `1B` -> `1C` this block. Planned.
* **B-061** (IndexedDB, ADR-0009), **B-066** (edit exam from the landing page), **B-072** (auto-load
  exams from a folder), **B-073** (pause an exam) — Phase 1C by the owner's ruling, **but they have
  no catalogue rows**, and the catalogue's standing convention is that **a row is added when its ID
  is contracted.** Do not invent rows to tidy a column.
* B-019 Planned. B-020, B-021 Phase 2. B-030…B-033 Phase 3. B-039, B-041, B-042, B-049 outside any
  gate.
* B-036, B-037, B-038, B-040, B-043 retired into other IDs; rows kept per rule 32.
* **B-075 is the next free ID.**

### Catalogue state

`BEHAVIOR_CATALOG.md` is **220,926 bytes**. Two edits this block: the B-074 row and declaration
(+152 lines), and the Phase 1C ruling note plus two phase-column flips (+38 / -2). UTF-8 without
BOM, LF. `BEHAVIOR_CATALOG.md` and all of `docs/` are **outside** `pnpm format:check`, which runs
`prettier --check .` from `web/`. Never `Set-Content`, `Out-File` or `>` from PowerShell 5.1. The
python3-heredoc route has now worked sixteen blocks running.

---

## 3. What landed this block

### 3.1 `119fb65` — QL-P1B-032 merged, B-074 Verified

Reviewed APPROVE by the previous context; **that review was not re-run and must not be.** One new
file, `web/e2e/phase-1b-exit.spec.ts`, 8481 bytes, +199 / -0, no production code. Three lettered
tests A-C. All three mutations behaved, including **M2 correctly reddening
`score-conformance.test.ts`** — the check that mattered most.

Gate evidence: banner `119fb65d115adfbd6fa3494bcbf631a6fc7be1c7` equal to the merge commit,
85 / 657 / 58, vitest 28.37s, e2e 16.4s. The branch tip was independently re-gated at `7e1b780`
immediately before the merge with identical figures.

The declaration is at `2fbc5ae` with **six recorded weaknesses**. Do not re-derive it.

### 3.2 `381df02` — three phases declared closed

`docs/decision/decision_20260913_phase_1_1a_1b_closed.md` records Phase 1, Phase 1A and Phase 1B
closed, clause by clause with evidence. Phase 1 and 1A had been met and undeclared since
2026-08-23.

**Two clauses were genuinely checked rather than assumed:**

* **No new dependency across the phase.** `git log --oneline v0.1.0..main -- web/package.json
  web/pnpm-lock.yaml` returns **nothing**. Not one commit has touched either file since the Phase 1
  tag, so this holds across Phase 1A *and* 1B.
* **The README clean-clone quickstart**, a Phase 1 clause that **had never been recorded anywhere**.
  Fresh clone into `%TEMP%`, `pnpm install --frozen-lockfile` clean, `pnpm dev`, and the reviewer
  read the app's Library screen in the browser pane. **Boundary recorded in the document:** the
  browser pane cannot drive a file input, so the sample-exam import was not clicked; the
  import-through-review journey is covered by `journey.spec.ts` and `offline.spec.ts`.

### 3.3 `08b71b7` — Phase 1C opened

Owner rulings, both answered first time in chip-style blocks: **all six queued rows are Phase 1C**,
and **B-055 is the gate**. B-053 and B-056 flipped in place (rule 32 freezes the ID, not the phase
column — the B-029 and B-051 precedent). The other four were not given rows. ROADMAP gained a real
Phase 1C section with exit criteria; its stub and the three stale `claude/` citations are gone
(finding 108 closed).

---

## 4. Discharged — do not re-raise

1. **Phase 1B is closed.** Do not re-review it, re-verify its behaviours, or re-check its criteria.
2. **QL-P1B-032 and B-074 are done, declared and merged.** Do not re-review.
3. **Findings 101, 108, 109, 112 and 113 are closed** by the work in §3.
4. **The decision-document migration is DONE.** §0.
5. **The Playwright browser question is settled.** `%USERPROFILE%\AppData\Local\ms-playwright` is
   Playwright's default cache on Windows, so pointing `PLAYWRIGHT_BROWSERS_PATH` at it is identical
   to removing the variable. Stop asking which was used; **do** ask a report to say.
6. **THE FORMAT AUTHORISATION IS STILL SPENT.** ADR-0008 authorised `prompt` capacity and nothing
   else. Any `docs/exam_format_spec.md`, `docs/schema/**`, `docs/conformance/**` or
   `docs/samples/**` **content** edit needs a fresh authorisation in as many words.

---

## 5. Next: the B-055 contract, and nothing else

**B-055 is the Phase 1C gate.** ROADMAP's exit criteria, quoted:

> B-055 Verified; the same exam sat once in exam mode and once in practice mode produces two stored
> attempts distinguishable by mode, the practice sit revealing answer and explanation per question
> and the exam sit revealing neither before submit; scoring identical in both modes per SCORE-1;
> conformance fixtures green; no new dependency added across the phase.

### What the contract must carry, beyond the standing thirteen lines

1. **A MANDATORY FIELD-COST MUTATION ON THE PERSISTED ATTEMPT SCHEMA.** "Attempts record their
   mode" means a new field on a persisted `z.strictObject`. **B-051's M3 — removing `.optional()`
   from `questionCount` — reddened seven tests and proved the owner's live in-progress record would
   have been destroyed on the next read.** Re-running that mutation shape on any addition to a
   persisted schema is the standing rule. Name `.optional()` explicitly and say why.
2. **MEASURE THE SELECTORS BEFORE WRITING THE CONTRACT.** QL-P1B-032's §3 was a table of labels,
   roles and option values read out of `builder.spec.ts`, `builder-shell.test.tsx` and
   `LibraryScreen.tsx`. A contract that guesses them costs a whole review cycle. The launch panel is
   where the mode control goes; read it first.
3. **B-068 ALREADY REVEALS AN ANSWER ON DEMAND** and is Verified, with its own lettered tests. Decide
   in the contract whether practice mode **reuses** that reveal path or adds a second one, and say
   which — a second path would be the kind of duplication the smallest-change rule forbids.
4. **SCORING MUST BE IDENTICAL IN BOTH MODES.** That is a gate clause, so it needs a witness, and
   the obvious mutation is one that makes practice mode score differently. `score-conformance.test.ts`
   must redden under any scorer mutation.
5. **DECIDE WHETHER AN OLD ATTEMPT WITHOUT A MODE FIELD STILL PARSES.** B-051's `B-051 I` is the
   precedent: a record written without the field still parsed and resumed. The owner has real stored
   attempts; a contract that does not pin this is how they get lost.

### The unnumbered work, still unnumbered

* **The jump-list move + QL-P1B-011** as one small task (findings 86, 6, 9, 10) — needs **one new
  lettered test, `B-034 W`, asserting document order**, that the jump list's heading precedes
  `Review answers`. Nothing currently pins placement. When it lands, **amend weakness 7 of the B-034
  declaration rather than deleting it.**
* **The emit-answer-order task** (findings 1 and 2) still has no number and **must not be folded
  into a feature task.**
* **Finding 110** — the section chooser and the count field disagree about what "nothing selected"
  means: blank in the N-of-M field means *all*, no section ticked means *invalid, Start disabled*. A
  sectioned exam cannot be launched without ticking every box. **It is a production change.** Put it
  to the owner; it is a plausible sibling for B-066 or B-072.

---

## 6. If there is no work in front of you, stop

**A planner with nothing to review has nothing to do.** Say where `main` is and what you are waiting
for, then end the turn. **Do not migrate the remaining handovers, do not re-verify declared work, do
not read documents speculatively.** §0 records what that cost the owner once already.

---

## 7. Findings

Lists 1-113 from previous handovers still bind for anything not restated. Restated:

* **8** (full-suite duration unstable) still binds; 28.4s twice today.
* **76** (option letters are runner-only) deliberately still open; settled in B-053.
* **81** has a cause and is permanent — §1.
* **101, 108, 109, 112, 113 CLOSED** — §4.
* **106** (mtime sweep) and **107** (patch a 200KB file unread) both used again and both held.

New this block:

114. **A SECOND REVISION COMMITTED THROUGH THE SAME `stagedPath` CAN SEND THE FIRST REVISION'S
     BYTES.** `ROADMAP.md` was edited twice from `/mnt/user-data/outputs/ROADMAP.md`. The second
     `device_commit_files` reported success and landed the **first** version's 5178 bytes, not the
     6466 written. It was caught only because `git add` then found nothing to stage. **Write every
     revision to a fresh path, and verify the landed byte count on every file — the verification step
     exists for exactly this and it was skipped on exactly this file.**
115. **A REPAIR BLOCK WHOSE FIRST COMMAND CAN ABORT WILL RUN ITS REMAINING COMMANDS ON THE WRONG
     STATE.** `git checkout main` aborted on a dirty worktree; the cherry-pick then ran on the task
     branch as a no-op, and the following `git reset --hard` **orphaned the commit the cherry-pick
     was supposed to rescue**, leaving it reflog-only. Recovered as `506bc0a`. **Any command whose
     failure invalidates the rest of the block must carry "if this aborts, run nothing further" on
     its own line**, and a repair block must never pair a conditional checkout with a `reset --hard`
     in the same paste.
116. **THE OWNER WILL RUN A BLOCK TWICE.** Blocks M and N were executed, then executed again and the
     second run pasted back — a no-op that reads exactly like a failure. **Write blocks to be
     idempotent where possible, and when they are not, say "run this once" on the block.** Reading
     `.git/logs/HEAD` distinguishes the two cases in one call.
117. **THE BROWSER PANE CAN READ A DEV SERVER ON THE OWNER'S OWN MACHINE.** §1. It turned an
     unevidenced exit clause into a verified one without asking him to describe his screen, which is
     the standing preference. It cannot drive a file input.
118. **A PHASE CLAUSE CAN SIT UNEVIDENCED FOR A MONTH BECAUSE NOTHING EVER ASKED FOR IT.** Phase 1's
     clean-clone quickstart was never recorded by any declaration; five of its six clauses were
     evidenced and the sixth was assumed. **When you run a phase-exit review, check each clause
     against the record rather than against the phase's reputation.**

---

## 8. Owner items

**Closed this block:** Phase 1, Phase 1A and Phase 1B all declared closed; `v0.2.0` tagged; the
Phase 1C scope and gate ruled. He ran eight command blocks; the two that misbehaved did so for
reasons in §7, not his.

**Open. Ask once and do not nag:**

1. **THE B-051 RETAKE DECISION.** On a 10-of-105 sit, *Retake exam* re-sits the **same 10**, not a
   fresh 10. Correct per B-034's "same scope", but a product question he has never been asked. **His
   answer decides whether a task is needed.** Finding 103.
2. **The TOGAF usage check** — take one section of the TOGAF exam with a question count set, confirm
   the chrome reads it, and resume it. Asked seven times. **Owner usage has produced a finding every
   single time it has been run.**
3. **The B-034 usage check** — submit an exam and confirm the chart, `Exam number`, retake scope and
   a wrong-question jump.
4. **The B-074 usage check, new** — author an exam through the builder with all four types across
   two sections, sit one section and then the whole thing. Every assertion behind the phase gate is
   machine-made.
5. **The nine binding rulings, still untranscribed.** Twenty handovers. `docs/decision/` exists, is
   populated and is in git — the last excuse is gone.
6. **`setup/` has no git remote and has never been pushed.** `OPERATOR.md` and the v3.4 Bible, the
   two documents governing how every one of his projects gets built, exist on one disk. Not a
   QuondaLearn item; the same loss risk one level up.
7. The owner-reserved-operations incident line in `TRACK_A_REPORT.md`.
8. A one-sentence authorisation for spec §3.4 (standing finding 20).
9. Whether `feat/ql-p1b-032-exit-demonstration` and the other merged feature branches should be
   deleted. Cosmetic; ask once, in passing.

### The TOGAF exam file

`exams\togaf\OGEA103-fixed.json` (919,135 bytes). `meta.id` `ogea103`, **105 items, all
`mcq-single`**, `meta.sections` = `s1`/`s2`/`s3`/`s4` at **30 / 30 / 30 / 15**, `timeLimitMinutes`
60, `passMarkPercent` 80. The three planner-proposed answer keys (q3=`o2`, q8=`o4`, q28=`o4`) remain
unverified and **the owner has ruled they are not a blocker — stop asking.** `exams/` stays
untracked.

---

## 9. Operational notes

* **§0 AND §1 ARE THE MOST IMPORTANT THINGS IN THIS FILE.** Read both before your first tool call.
* **CHECK `main` BEFORE ISSUING ANY GIT BLOCK.** With no shell, stage `.git/HEAD`,
  `.git/refs/heads/main` and `.git/logs/HEAD` and read them. That worked four times this block and
  twice distinguished a real failure from a re-run.
* **A BLOCK THAT MUST RUN ON `main` OPENS WITH AN UNCONDITIONAL `git checkout main`**, not a branch
  check the reader has to interpret. Finding 112's lesson, applied all block with no recurrence.
* **PUT THE EXPECTED OUTPUT AND THE STOP INSTRUCTION ON THE SAME LINE AS THE COMMAND THAT PRODUCES
  IT**, never in prose above the block.
* **KEEP BLOCKS TO FIVE LINES OR FEWER.**
* **PATHSPECS ARE RESOLVED FROM THE SHELL'S CWD.** Git work from the repo ROOT with `web/`-prefixed
  paths; only `cd` into `web` for `pnpm`. Seventeen clean blocks.
* **`git add -A -- <paths>` scoped to named paths is the safe form.** Never bare `git add -A` —
  `Claude outputs/`, `exams/` and `sample-hotspot-240x160.png` are untracked and must stay so.
* **FEATURE COMMITS CARRY NO TRAILERS IN THIS PROJECT; ONLY MERGE COMMITS DO.**
* **KEEP COMMIT SUBJECT LINES ASCII** and under about 72 characters.
* **PowerShell 5.1 rejects `&&`.** One command per line. Never use `<placeholder>` syntax.
* **Do not hand him a file edit.** Make docs and catalogue edits yourself and hand him only
  `git add` / `git commit`.
* **Windows has no `grep`.** Ask for `git grep -n`, `rg -n` or `findstr`.
* **You cannot run the gates.** `node_modules` is Windows-native. **Ask him to run
  `git ls-remote origin main` after every push** — it has matched every time, eighteen blocks
  running.
* **A LETTER AUDIT BY GREP CAN LIE** — finding 102. An audit must accept `it("`, `it('` and a
  backtick, and tolerate a newline after the paren.
* **`vite.config.ts` has NO `setupFiles`.** Anything jsdom does not implement has no stub.
* **`noUncheckedIndexedAccess` is on.** Any indexed read is `T | undefined`. Decide in the contract
  whether you want `!` or a guard.

---

## 10. Implementer calibration

**grok 4.6 High Fast produced QL-P1B-032 APPROVE-first-time**, its second consecutive, with every
contracted mutation run against both suites, every predicted count hit exactly, and **three
disclosures the planner had not asked for** — the fifth consecutive block with at least one.

**Most importantly: it stopped and reported an impossible contract step rather than patching
`web/src` to make it work.** That is the ROLE line doing exactly what it is for, and it is why the
role split is re-asserted at the top of every contract:

> ROLE: you implement this contract. You do not write contracts. If a line here looks wrong, say
> which line and why in your report — do not rewrite it and do not hand back a task.

**Ten consecutive tasks without a pushback (-024 through -032).** This calibration rests on three
tasks for this model: good, and not yet proven.

**The binding constraint remains the contract's precision, not the implementer's care.**
QL-P1B-032's only defect was a planner defect — a step its own finding had already recorded as
impossible.

---

## 11. What to do first

1. **Read §0.** Then §1 — you have no shell, and you do have a browser pane.
2. **Verify the state before any claim.** Stage `.git/HEAD`, `.git/refs/heads/main` and
   `.git/logs/HEAD`. Expect `main` = `08b71b756e3f10f7017893362ecfa381f8dfcc12`, HEAD on `main`, no
   branch in flight.
3. **Write the B-055 contract** to `docs/context/cursor/grok/4_6/high/ql_p1c_001_contract.md` and
   give the owner the path. §5 lists what it must carry beyond the standing thirteen lines. Confirm
   the `QL-P1C-001` task-ID form with him in one line first.
4. **IF HE HAS NOT ASKED FOR IT, STOP.** §6.
5. **Whatever contract you write, include these thirteen lines:** the ROLE split; *"if you add an
   `it.each`, say so and give its expansion count"*; each forbidden file with its own reason; **THE
   PROP COST, STATED**, with the grep that proves it; **THE FIELD COST, STATED**, naming
   `.optional()` and why; *"list EVERY test that goes red under each mutation, name the suite you
   measured it against, and if you predict none beyond the target say so explicitly"*; a recount of
   the allowed-path list done by you before you send it; the exact counting regex for every figure,
   **and the warning that a quoted title may be single-quoted**; the predicted post-task counts as
   well as the baseline; the next free letter for every behaviour ID suffix, checked with `git grep`
   before you name it; a mutation that changes STRUCTURE when the requirement is about DOM structure;
   a mandatory unwiring mutation whose witness asserts **PRESENCE**; and **the base SHA resolved at
   hand-off, with the implementer required to report the SHA it branched from.**
