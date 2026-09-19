# QuondaLearn — Project Plan, Phase 1B "Make it feel like a real exam engine"

**Authored 2026-08-22 by the planner/reviewer context that closed QL-P1A-006 and QL-P1-029.**
Supersedes nothing. Sits alongside `ROADMAP.md` as the scoped plan for the next block of
work. `claude/SESSION_HANDOVER_2026-08-20-post-QL-P1A-005.md` remains the state-of-the-repo
document; `claude/DECISION_2026-08-20_behaviour-id-freeze.md` remains authoritative for
B-023…B-027.

**Baseline:** `main == origin/main == 8ee8fc7`, clean and pushed. 47 test files / 365 tests /
16 e2e, gated at the merge commit. B-001…B-018 Verified. B-023…B-027 merged, uncatalogued.

**Standing constraint from the owner, 2026-08-22:** *no cosmetic changes.* Colour, fonts,
spacing and the existing theme stay exactly as they are. Every item below is UX behaviour,
layout structure or a missing feature. Where a reference screenshot shows a different visual
style, only its **structure and interaction** are adopted, never its palette.

---

## 1. What the reference images actually establish

Six reference sets were supplied. Read as a specification, they say:

### 1.1 Select and Place (`updates/select and place/drag drop1–6.png`)

A two-column modal. Left column: the list of candidate actions. Right column: an equal
number of empty ordered slots. The interaction across the six frames is unambiguous:

| Frame | State |
|---|---|
| dd1 | Question text only, with a **Select and Place** button that opens the panel |
| dd2 | Panel open. 7 source actions left, 7 empty slots right |
| dd3 | Source item outlined (selected), destination slot outlined in red (drop target) |
| dd4 | Item has **moved** — it is gone from the left list, leaving a visible gap, and now fills slot 1 |
| dd6 | Two items placed, in order; the left list keeps shrinking |

Key semantics, all confirmed by the frames:

- placement is a **move**, not a copy — the token leaves the tray
- the tray **preserves the original row positions** (dd4 shows an empty gap, not a reflow)
- slots fill in **order**; slot 1 is the first step of the sequence
- **Reset** clears all placements; **OK** commits
- unplaced actions are the distractors

**This is not a new question type.** `zones` (min 2, max 8) and `tokens` (min 2, max 12) in
the frozen schema already express it: the zones become the ordered slots, `answer` maps
token → zone. **No change to `docs/EXAM_FORMAT_SPEC.md`, `docs/schema/` or
`docs/conformance/` is required, and none is authorised.**

The underlying drag mechanic already exists and is Verified as B-006 — `DragDrop.tsx` has
real pointer capture, a movement threshold, `resolveDrop` hit-testing, and a passing
real-browser test for both mouse and touch. **What is missing is the layout and the ordered
presentation, not the dragging.** That is what makes this the right first task: high
perceived change, low mechanical risk.

### 1.2 Hotspot (`updates/hotspot example/hotspot example.png`)

Question text on top, image below, sixteen-plus rectangular zones drawn as **always-visible
thin outlines** over the image. Hover lightens a zone to grey; click selects it.

Two concrete gaps against the current build:

1. **Unselected regions are invisible.** `Hotspot.tsx` renders unselected regions as
   `fill-transparent stroke-transparent`. The candidate cannot see what is clickable. The
   reference shows a permanent faint outline plus a hover fill.
2. **`MAX_HOTSPOT_REGIONS = 12`** (`web/src/ui/author/regionGeometry.ts`). The reference has
   more than sixteen zones. The owner's words: *"how many zones that's clickable on the image
   shouldn't matter."* The cap is an authoring-tool constant, not a schema limit — raising it
   is a one-constant change, but every capacity message derives from it (normative rule 31),
   so it must be raised at the constant and nowhere else.

### 1.3 Results screen (`40155924…png`, plus the OpenAI chart reference)

The reference score report has: a title block, candidate name, date/time, **exam number**,
elapsed time, a **two-bar horizontal chart** comparing *Required Score* against *Your Score*
on a common axis, a pass/fail grade in colour, and a per-section breakdown.

**Resolved by the owner 2026-08-22 with a reference image. No ambiguity remains — build
exactly this:**

- **Two horizontal bars**, full width, generous bar height, small rounded ends acceptable.
- **Top bar: "Required Score". Bottom bar: "Your Score".** In that order.
- **Category labels sit outside the plot, right-aligned, to the left of each bar.**
- **The value label sits immediately to the right of the end of each bar**, outside the bar,
  not inside it.
- **A single x-axis along the bottom** with tick marks and numeric ticks, plus a centred axis
  caption beneath it.
- **Scale is percent, 0–100**, not the reference's 0–1000. Axis caption reads `Percent score`.
  `passMarkPercent` and the scored percent are both already percentages; converting to a
  1000-point scale would invent precision the scorer does not have.
- Light, thin plot border and no gridlines beyond the axis itself. No legend — the two labels
  are the legend.
- **Two visually distinct bar colours**, matching the reference's read of "target vs actual":
  **Required Score in a muted/neutral token, Your Score in the existing pass/fail semantic
  colour** already used by the results badge — so a pass reads green and a fail reads red
  without introducing any new colour. **No new palette entries. No charting library.**

Sections are explicitly out of scope — the data model has no sections. **Exam number** is in
scope and is trivial.

### 1.4 Exam setup dialog (`B8366093…png`)

Candidate name, exam picker, section picker, **"Take N questions from entire exam file"**,
"Take question range from X to Y", "Take questions I have answered incorrectly N or more
times", Training mode, and a Timer on/off with a minutes box.

Of these, the owner named exactly one as wanted: **take N questions out of the total**.
Everything else on that dialog is future work or already covered (the timer already exists
per-exam). Candidate name is the login question, already deferred.

### 1.5 MCQ layout (`4D0C59DA…png`, `805A1A4A…png`)

Item header reading `Item 2 of 15`, letter-prefixed options (A, B, C, … up to I), a persistent
footer with **Previous / Next / Review ▾ / Pause / Save Session / End Exam**, a status line
explaining the interaction ("Select the best choice."), a **Mark** checkbox top-left and
**Time Remaining** top-right.

Against the current build: navigation, flagging (B-010) and the timer (B-015) all exist as
behaviour but are not laid out this way. The cheap, high-value borrowings are the **`Item N of
M` header**, **letter prefixes on options**, and a **persistent footer nav bar**. Everything
else is either present or deferred.

### 1.6 Authoring flow — the owner's confusion, which is a real defect

> *"I load an image and it asks me these questions… don't know what that means."*

The current author screen demands **Image alt text** before the file picker will accept
anything ("Enter image alt text between 1 and 300 characters first"), then presents Exam id /
Exam title / Subject / Question prompt / maxSelections as five bare inputs with no explanation
of why an image import is asking for an exam id.

The reference tool does it the other way round: load the image, click **Hot Area**, draw the
zones, and the metadata lives elsewhere. **The current ordering is a known accident** — it was
introduced as a test-shaped fix during QL-P1A-005 (finding 4.1) and has never been ratified by
the owner. The owner has now, in effect, rejected it.

The fix is ordering and labelling, not new machinery: image first, draw second, metadata last
and clearly captioned. The alt-text-before-file gate should become a validation on build, not
a barrier to importing.

---

## 2. Scope decisions

### 2.1 In scope now (Phase 1B)

Ordered by the owner's stated priority, then by risk.

| # | Task | Behaviour | Size | Why now |
|---|---|---|---|---|
| 1 | **Select and Place layout** | B-028 | 1–2 sessions | Owner's explicit first pick. Layout only; drag mechanic already Verified |
| 2 | **Hotspot zone affordance** | B-029 | ½ session | Zones are currently invisible until selected. Smallest real defect on the list |
| 3 | **Hotspot region cap** | B-029 | folded into 2 | One constant; messages already derive from it |
| 4 | **Results screen rebuild** | B-034 | 1–2 sessions | Required-vs-Your bar, percent, wrong-question list with jump, retake, exam number |
| 5 | **Runner chrome** | B-035 | 1 session | `Item N of M`, letter prefixes, persistent footer nav |
| 6 | **Author flow reorder** | B-036 | 1 session | Fixes the owner's confusion and retires the QL-P1A-005 accident |
| 7 | **Author metadata fields** | B-037 | ½ session | `timeLimitMinutes` + `passMarkPercent`; both already optional in the frozen schema |
| 8 | **Take N of M questions** | B-038 | 1 session | The one item wanted from the setup dialog |

### 2.2 Deferred — future sprints

| Task | Behaviour | Why deferred |
|---|---|---|
| **Practice mode** — per-question reveal, green correct / red wrong | B-039 | Largest blast radius in the project: touches all four question components. Two contracts minimum. Owner already agreed to sequence it after exam mode |
| **Restore in-progress attempt across reload** | B-022 (existing, Planned) | Real daily value, but no reference image drove it |
| **Multi-question authoring** | B-040 | The author emits exactly one question, id `q1`. Turning it into a real tool is a project of its own |
| **Login / candidate name** | B-041 | Single-user local app. Buys a name in the corner. Owner ranked it last himself |
| **"Questions I got wrong N+ times"** | B-042 | Needs per-question attempt history the data model does not carry yet |
| **Sections** | B-043 | No section concept exists anywhere. Explicitly out of scope per the owner |
| **Save Session / Pause** | — | Overlaps B-022; fold in there rather than duplicating |
| **Calculator** | — | Explicitly declined by the owner |
| **Exhibit button** | — | No fixture uses it; revisit if a real exam needs it |

### 2.3 Explicitly forbidden in every Phase 1B contract

- Any edit to `docs/EXAM_FORMAT_SPEC.md`, `docs/schema/**`, `docs/conformance/**`
- Any new dependency — including any charting library for task 4. The results chart is
  hand-rolled SVG or CSS, the same way `pngFixture.ts` avoided an image library
- Any colour, font, spacing or theme change beyond what a layout change strictly forces
- Weakened, skipped, deleted or renamed tests
- Network code

### 2.4 Behaviour-ID allocation — needs owner approval before first use

None of these appear in a pushed commit yet, so none are frozen (normative rule 32). Approve
or amend before the first contract is issued:

```
B-028 drag-drop renders as select-and-place: two columns, ordered slots, tray removal on place
B-029 hotspot regions are visibly clickable before selection, and the region cap is raised
B-034 results screen: required-vs-your bar, percent, wrong-question jump list, retake, exam number
B-035 runner chrome: item N of M, letter-prefixed options, persistent footer navigation
B-036 authoring is image-first: import, draw, then metadata
B-037 authoring emits timeLimitMinutes and passMarkPercent
B-038 start an exam with a subset of N questions from the file
B-039 practice mode: per-question reveal with correct/incorrect marking   [future]
B-040 multi-question authoring                                           [future]
B-041 candidate profile                                                  [future]
B-042 drill questions previously answered incorrectly                    [future]
B-043 sections                                                           [future]
```

B-030…B-033 remain reserved for Phase 3 AI work. B-019 and B-022 keep their existing meanings.

---

## 3. Open questions for the owner — answer before the relevant contract

~~1. **Results chart orientation.**~~ **CLOSED 2026-08-22.** Horizontal, per the owner's
   reference image. Full spec in §1.3 — build it exactly as written there and do not re-ask.

2. **Behaviour-ID block above** — approve as written, or renumber now while nothing is frozen.
3. **Hotspot region cap** — what number? The reference has 16+. I propose **32**, which is
   generous without making the region list unusable. Say a number.
4. **Select and Place trigger.** The reference hides the panel behind a button and commits with
   OK. Do you want that modal flow, or the two columns always visible inline on the question?
   Inline is simpler and fits the current runner; the modal matches the reference exactly.

Still open from every prior session, unchanged:

5. **The nine binding rulings**, still untranscribed. Now genuinely blocking: the "pure
   time-free reducer" ruling constrains B-039, and the "B-006 additive-not-replacing" ruling
   directly constrains B-028's tray semantics. **I am working from a one-line summary of a
   ruling that is about to govern the next task.**
6. **"Phase 1 is closed"**, in those words.
7. **The Phase 1A ROADMAP go-ahead** — still blocking the docs task, five behaviours deep
   (B-023…B-027 have no `BEHAVIOR_CATALOG.md` row).

---

## 4. Recommended running order

1. **B-028 Select and Place** — owner's pick, and the drag mechanic is already proven
2. **B-029 Hotspot affordance + cap** — half a session, removes a real usability defect
3. *Owner takes a real exam and reports back before anything else is contracted*
4. **B-034 Results screen**
5. **B-035 Runner chrome**
6. **B-036 + B-037 Authoring** — one contract each, or combined if both stay small
7. **B-038 Take N of M**
8. **Phase 1A/1B docs task** — the moment the ROADMAP go-ahead lands
9. **B-039 Practice mode**, split across two contracts
10. **B-022 Resume in-progress attempt**

Step 3 is deliberate. The last round of feedback came from the owner actually using the
product and was worth more than any amount of planning. Do it again after every second task.

---

## 5. Process facts carried forward

Unchanged from `claude/SESSION_HANDOVER_2026-08-20-post-QL-P1A-005.md` §9, plus:

- **PowerShell blocks of 4–5 lines maximum, one command per line, no `&&`.** A pasted block
  once arrived line-reversed and PowerShell executed the last line first; when a sequence
  matters, deliver the lines **individually**, not as one block.
- `device_bash` works. `cd $HOME/mnt/quondolearn` and run git directly. Beware stale
  `device_stage_files` copies (post-QL-P1A-005 finding 4.3).
- `pnpm gates` does not run e2e. Anything touching `web/e2e/**` or `web/src/**` runs `pnpm e2e`
  separately, at the code commit **and** at the merge commit, before the push.
- `Remove-Item Env:PLAYWRIGHT_BROWSERS_PATH -ErrorAction SilentlyContinue` before `pnpm e2e`
  in a Cursor shell.
- Untracked and expected in the working tree: `docs/session_handover/`,
  `sample-hotspot-240x160.png`, `updates/`. Contracts must name files explicitly rather than
  `git add -A`, or these get swept in.

### New normative rules established since the last handover

```
35. An image-load assertion must observe decode, not metadata. complete, naturalWidth and
    naturalHeight are all readable from a valid header alone and cannot detect corrupt pixel
    data. Assert `await img.decode()` resolves.
36. A reference screenshot specifies structure and interaction, never palette. Adopting a
    reference's layout must not change colour, font or spacing tokens.
```

Rule 35 has an outstanding three-line application: the QL-P1-029 browser case still asserts
`naturalWidth`/`naturalHeight` only, and M4 proved it cannot see a valid-header/corrupt-payload
file. Fold `await image.decode()` into the next contract that touches `web/e2e/hotspot.spec.ts`.
