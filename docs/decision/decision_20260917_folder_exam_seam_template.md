# DECISION — the B-072 injection seam defaults at the composition root, not inside `App`

**Date:** 2026-09-17
**Decided by:** the planner, correcting its own contract. **No owner ruling was needed** — the rule
this changes (`web/src/main.tsx` is forbidden) was written by QL-P1C-007 §2.7 and §3, not by Iam.
**Status:** ratified by this document. Supersedes QL-P1C-007 §2.7's `main.tsx` prohibition and the
`web/src/main.tsx` line of its §3. Everything else in that contract stands.

---

## 1. What happened

QL-P1C-007 §2.7 required `App` to default its new `folderExamFiles` prop to the real
`import.meta.glob` record:

```
const folderFiles = props.folderExamFiles ?? examFolderFiles;
```

Every existing test renders `<App />` with no prop. They therefore took the real glob, which on the
owner's machine resolves `../../../exams/togaf/OGEA103-fixed.json` — **919,135 bytes, 105 items.**
The load effect merged that entry and changed the `LibraryScreen` remount key mid-test, dropping
in-flight imports and selections.

**Sixteen tests went red** across `app-persistence.test.tsx` (4 of 6) and `app-integration.test.tsx`
(12 of 12). `B-072 A`–`L` were 12/12 green throughout: they inject a two-file fixture and never
touch `exams/`.

**The implementer stopped, reported, and changed nothing.** It named the three workarounds it
refused — `vi.mock`, a test-mode empty default, and editing the forbidden tests — and did not
commit, gate or mutate. That is exactly the contracted behaviour and it cost one round trip instead
of a corrupted baseline.

**The contract predicted this failure and prescribed its cause.** QL-P1C-007's MAY-REDDEN analysis
named both files, said they mount `App` with no prop, said they would read the 919 KB file, and told
the implementer to stop if they reddened — and then specified the default that guaranteed it.
Finding 139.

## 2. The ruling

**The default moves to the composition root.**

* `web/src/App.tsx` — a module-level `const NO_FOLDER_EXAM_FILES: Record<string, () => Promise<string>> = {}`,
  and `props.folderExamFiles ?? NO_FOLDER_EXAM_FILES`. `App` no longer imports `examFolderGlob`.
* `web/src/main.tsx` — imports `examFolderFiles` and renders `<App folderExamFiles={examFolderFiles} />`.

`App` becomes a pure function of its props: it loads exactly the folder files it is given, and is
given none unless someone passes them. `main.tsx` is the only place that knows a real folder exists.
No test imports `main.tsx` — `smoke.test.tsx` imports `App` — so no test can acquire the real glob
by accident again.

Production behaviour is unchanged. `import.meta` still appears in exactly one module.

### Why not the alternatives

* **A test-mode default** (`import.meta.env.MODE === "test" ? {} : examFolderFiles`) puts test
  awareness into production code and makes the shipped path the one never exercised by tests.
  Rejected; the implementer had already refused it.
* **`vi.mock`** has never been used in this repo (0 files). Introducing it for one seam is a house
  pattern change, and it would leave the bad default in place for any future `<App />` test that
  forgets the mock. Rejected.
* **Editing the two failing tests** is hard rule 2. Never on the table.

## 3. The second defect, found by reading the branch rather than the report

The load effect's dependency array is `[folderFiles]`.

With the ruled default that is a latent loop: any caller passing an **inline object literal** —
`<App folderExamFiles={{ "a.json": load }} />` — creates a new identity on every render, so the
effect re-runs, merges, calls `setPersistence` with a fresh array, re-renders, and repeats.

**It does not bite today only by luck.** `folder-exams.test.tsx` hoists its fixture to a module-level
`twoFolderFiles` const, so identity is stable and `B-072 H`–`L` pass. Nothing in the code or the
tests requires that, and nothing would catch it.

**Ruling: the folder load runs once at startup.** Capture the value in a `useRef` and give the effect
an empty dependency array. That is what "auto-load at startup" means, it removes the identity hazard
entirely, and it passes `react-hooks/exhaustive-deps` because a ref is not a dependency.

`QL-P1C-007-A` adds `B-072 N` to pin it: an **inline** literal whose loader is a `vi.fn()` must be
called **exactly once**. Machine-independent, and it fails under the old dependency array.

## 4. The weakness this ruling accepts, knowingly

**Moving the default to `main.tsx` moves it out of test reach.** Deleting
`folderExamFiles={examFolderFiles}` from `main.tsx` reddens **nothing** — the rider's R2 mutation
proves it, and is expected to come back green and be reported as a green result under finding 124.

This is the ordinary composition-root blind spot. Closing it would need an e2e that proves folder
exams appear in the real app, which needs a fixture committed into `exams/` — and `exams/` is
untracked, holds the owner's data, and is forbidden to every contract. **The cost of a real witness
exceeds the cost of the bug it would catch, at R1, on a personal local-first tool.**

**Consequence: the B-072 declaration must record this, and the owner usage check is the only thing
that actually closes it.** The row may still flip on tests as usual — that is the standing
single-owner R0/R1 profile — but the declaration states plainly that no automated test proves the
real application wires the real folder.

## 5. Finding 139

**AN INJECTION SEAM MUST DEFAULT AT THE COMPOSITION ROOT, NOT INSIDE THE COMPONENT.** A default
inside the component is not a default — it is a dependency that every existing test of that
component silently acquires. `ExamRunner`'s `renderQuestion` prop, cited as the precedent, is
**required**, so it has no default and no such trap; the analogy was drawn to the wrong half of the
pattern.

The general form: **when a contract adds an optional prop carrying a real-world dependency, ask
which existing tests construct that component without it.** If the answer is "all of them", the
default is the contract's biggest decision, not a detail — and it belongs one level up, where
nothing but the real program looks.

Finding 137 said a may-redden claim must name the fixture's shape. **This is its sharper sibling:
naming the risk correctly is not the same as designing it out.** QL-P1C-007 identified the exact two
files, the exact mechanism and the exact file size, wrote an instruction to stop when it happened —
and shipped the cause anyway. **A predicted failure that the contract itself creates is a design
defect, not a risk to be documented.** When the may-redden analysis says "these tests will take the
real dependency", the next question is not "what should the implementer do when they go red" but
"why are they taking it at all".
