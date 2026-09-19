# Lumit Website — Planner/Reviewer Kickoff, LWS-P1-001: get the site into git

**THIS IS A KICKOFF, NOT A CONTINUATION. There is no prior planner context for this repository.**
`D:\dev\projects\lumit_website` was created on 2026-09-19 and is **not a git repository yet**. Your
job is to make it one, honestly, and to get the first contract reviewed and merged.

Written 2026-09-19 by the Cowork planner context that designed the site, generated it, and handed
the owner the zip he unpacked into this folder. **Everything in §2 was verified by reading the tree
on 2026-09-19, not recalled.**

**Read §0, then §1, then §2, then §6. §6 is your first job.**

---

## 0. FILE LAYOUT

`lower_snake_case` for every file and folder under `docs/`. `docs/naming_convention.md` is already in
this repository and is the full rule — it was copied in from QuondaLearn and it applies here
unchanged. Root files keep their SCREAMING_CASE names. **Identifiers are not filenames:** `B-001`,
`LWS-P1A-001`, `D-LWS-001` keep their form in prose.

```
docs/context/claude/opus/5/high/handover/   session_handover_<yyyymmdd>_<slug>.md   <- you
docs/context/cursor/grok/4_6/high/          <task>_contract.md                      <- the coder
docs/decision/  docs/review/  docs/plan/  docs/note/                                <- records
```

**Write records straight to the repo and give the owner the path, not a chat code block.** Paste
truncation is why.

**Roles.** Claude Opus 5 High is the steerer: it plans, writes contracts, reviews adversarially and
writes all prose records. Cursor running grok 4.6 High Fast is the coder: it implements one contract
at a time on a branch. **The owner is the only one who merges, tags or spends money.** No agent
merges, and no agent writes a contract for itself.

The next free task ID is **`LWS-P1-003`** for planner tasks and **`LWS-P1A-002`** for coder
contracts. The next free behaviour ID is **`B-005`**.

---

## 1. Bridge status

**`device_bash` is dead on this machine.** A Windows update released 8 September 2026 stops the
Cowork workspace mounting the drive:
`sandbox-helper: no Plan9 drive shares mounted under /mnt/.virtiofs-root/shared`. A `ToolSearch`
reload does not fix it. **Assume you have no shell on the owner's machine from your first tool
call.** You cannot run `git`, `node` or the gates yourself. The owner pastes that output.

**`device_list_dir`, `device_stage_files` and `device_commit_files` work** and are your only route
into the repository. Request `D:\dev\projects\lumit_website` in your **first** tool call — it was
granted immediately, first call, no prompt delay, on 2026-09-19.

### Proving scope without a shell

1. **The before-and-after directory listing is your scope proof.** Take a full recursive
   `device_list_dir` with sizes and mtimes **before** you issue a contract. Take another when the
   report comes back. Any file whose size or mtime moved and is not in the contract's allowed paths
   is a scope breach, and you found it without a shell and without trusting the report.
2. **Size-delta arithmetic.** A two-line edit is a predictable byte delta. If a file grew by 1,400
   bytes and the report says "added one import", the report is wrong.
3. **Stage a whole directory and grep it in the container.** Staging costs tool-call time, not
   tokens; only what you `Read` costs tokens.
4. **A forbidden file's mtime is a mutation receipt.** If a mutation was supposed to touch
   `index.html` and `index.html`'s mtime never moved, the mutation was not run.

### Editing a repo file with no shell

1. `device_stage_files` the file; record `mtimeMs` for `expectedMtimeMs`.
2. Edit in the **container** with a python3 heredoc, `encoding="utf-8", newline="\n"`, asserting
   each anchor occurs exactly once.
3. Write the result to a **fresh path** under `/mnt/user-data/outputs/`.
4. `device_commit_files` with that `stagedPath`. If it reports the staged file is missing, call
   `SendUserFile` on it first and commit by `fileUuid` instead — that failure happened on
   2026-09-18 and the `fileUuid` route worked.
5. **Verify the landed byte count with `device_list_dir`. Every time.**

---

## 2. State at handover — verified 2026-09-19

### 2.1 What this repository is

**The Lumit Cloud Technology Consulting public marketing website.** Six pages of hand-generated
static HTML with one stylesheet. No framework, no build step in the repo, no JavaScript required to
read any page, no database, no forms, no analytics, no cookies.

**It is not the same project as `lumit_webapp`.** That repository, at
`D:\dev\projects\lumit_webapp`, holds the `remit` consulting-operations engine and the future client
portal, under a much heavier governance regime. The two are deliberately separate. §5 explains what
this split costs `lumit_webapp`, and it is not nothing.

### 2.2 The file inventory, and every byte count is confirmed

```
.htaccess                      796      https redirect, www->apex, security headers, 404
index.html                  12,251      home
styles.css                  11,539      the only stylesheet, shared by all six pages
robots.txt                      73
sitemap.xml                    649      six <url> entries
assets/lumit-mark.svg       24,545      the cloud+L mark, referenced as <img> and as the favicon
about/index.html             6,342
contact/index.html          16,049
engagements/index.html       5,788
how-we-work/index.html       6,435
services/index.html         16,439
```

**Every one of those byte counts matches the generated output exactly.** The owner unpacked the zip
without editing anything. That is the baseline: if a count moves, something changed.

Routes, and they are real directories with `index.html` inside, not client-side routing:
`/` · `/services/` · `/how-we-work/` · `/engagements/` · `/about/` · `/contact/`

### 2.3 What is NOT here, and the first item is the important one

**There is no `.git` directory.** Nothing is under version control. Every byte in this folder exists
in exactly one place, on one machine, with no history and no remote.

**There is no generator in the repository.** The six pages were produced by a Python script,
`build_site.py`, from a single-page source, `site.html`, in a Cowork scratch directory that **no
longer exists**. The script read the content, pre-rendered the six service blocks, and emitted the
pages, the stylesheet, the sitemap, the robots file and the `.htaccess`. **What landed here is its
output, and only its output.** See **D-LWS-001** in §4 — this is the decision that matters most and
it is the owner's.

**There are no repository records.** No `README.md`, `AGENTS.md`, `CLAUDE.md`, `CODEOWNERS`,
`SECURITY.md`, `STATE.md`, `RULES.md`, `OPEN_DECISIONS.md`, `ROADMAP.md`. Those are **yours to
write** — prose is the planner's, never an implementer cycle.

**There is no gate.** Nothing checks that a link resolves, that a page has a title, or that the
sitemap matches the pages that exist. A broken internal link would ship silently. `LWS-P1A-001`
(§6) exists to fix exactly that, before the first commit rather than after.

### 2.4 THE QUONDALEARN CONTAMINATION — DEAL WITH THIS BEFORE `git init`

**`docs/` is currently a copy of QuondaLearn's `docs/` tree.** It was copied in to provide the
folder scaffolding and the templates, and the scaffolding is genuinely useful. But it also carried
in **another project's records**, which are about an offline exam simulator and have nothing to do
with a consultancy website:

| path | what it actually is | verdict |
|---|---|---|
| `docs/naming_convention.md` | the file-naming rule | **KEEP** — it governs here too |
| `docs/adr/adr_template.md`, `docs/changes/cjr_template.md` | empty templates | **KEEP** |
| `docs/adr/adr_0001…0008_*.md` | QuondaLearn ADRs about exam formats, Android stacks, hotspot images | **REMOVE** |
| `docs/decision/decision_2026*.md` (11 files) | QuondaLearn decisions | **REMOVE** |
| `docs/review/review_2026*_ql_*.md` (9 files) | QuondaLearn reviews | **REMOVE** |
| `docs/note/note_2026*.md` (2 files) | QuondaLearn notes | **REMOVE** |
| `docs/plan/project_plan_20260822_phase_1b_ux.md` | QuondaLearn plan | **REMOVE** |
| `docs/exam_format_spec.md`, `docs/schema/exam_schema.json`, `docs/samples/*`, `docs/conformance/*`, `docs/ai/exam_authoring_prompt.md` | QuondaLearn's frozen spec and fixtures | **REMOVE** |
| `docs/context/claude/**`, `docs/context/cursor/**`, `docs/context/gpt/**` | this repo's own handovers and contracts, plus the two QuondaLearn example templates | **KEEP the Lumit files; the two `- example_template.md` files are the owner's reference and stay unless he says otherwise** |

**If this is committed as-is, the first commit of the Lumit website repository will assert that the
project made eleven decisions about exam scoring.** That is not untidiness, it is a false record,
and a false record in commit one is the kind of thing nobody ever goes back and fixes.

**Do not delete anything yourself and do not ask the coder to delete it inside a build task.** Put
it to the owner as a single block — the table above is already the block — and let him confirm. He
can delete a folder faster than any of us can arrange to.

---

## 3. How this site came to exist, honestly

The owner has been trying to get a Lumit site live since late August. The path taken was not the
governed one, and you should know why before you judge the artefact.

`lumit_webapp` contains a Next.js application, `apps/public-web`, with four routes, correct landmark
structure, a typed site-configuration module and an injected brand — built under contract, gated and
reviewed. **It also contains only placeholder copy.** Putting the real content into it meant another
two implementer cycles, and the owner had already lost two weeks to a GitHub billing problem.

So on 2026-09-19 the planner generated the finished site directly and handed him a zip. **That was a
deliberate trade: a live site today against a repository that is the source of truth.** It was
recorded as such at the time, and this handover is the second half of paying for it.

**Do not treat the generated HTML as disposable and do not propose rebuilding it in Next.js as your
first move.** It is six pages of correct, accessible, static HTML with real copy drawn from the
owner's own company profile. The question is not whether to keep it — it is D-LWS-001, which asks
what the source of truth is from here.

---

## 4. Owner items — three, and D-LWS-001 blocks the commit

**Ask all three once, in one block, early. Do not nag mid-answer.** The owner skips steps in long
sequences; give him four or five lines at a time and end every sequence with a verification command.
PowerShell only, one command per line, **no `&&`**, `-m` supplied inline on every commit and merge.

### D-LWS-001 · What is the source of truth for the site's content?

**Blocking: the first commit, and every content change after it.**

The six HTML pages were generated. The generator and its single-page source are not in the
repository and the scratch directory holding them is gone. Three options:

- **A — the HTML is the source.** Content changes are made by editing the six files directly. The
  generator is historical and is never restored. Simple, obvious, and the right answer for a site
  that changes a few times a year. The cost is that the six pages share a header, footer and closing
  block that must then be kept in step **by hand**, and nothing enforces it.
- **B — restore the generator.** The planner reconstructs `build_site.py` and `site.html`, they land
  under `tools/` and `src/`, and the six pages become build output. Content lives in one place. The
  cost is a build step, and the discipline never to hand-edit the output.
- **C — both, with a rule.** Only viable if the rule is enforced by a gate. Without one this is
  option A with extra files and a lie in the README.

**Recommendation: A, for now, with B's problem solved by the gate.** `LWS-P1A-001` adds a check that
the shared chrome is byte-identical across all six pages, which is the only part of B that actually
protects anything. Revisit if the page count grows past ten.

### D-LWS-002 · Does the QuondaLearn `docs/` content get deleted?

**Blocking: the first commit.** §2.4 has the table. Recommendation: delete everything marked REMOVE,
keep the convention, the two templates and the `docs/context/` tree.

### D-LWS-003 · Public or private repository, and under which account?

**Blocking: the push, not the commit.** `lumit_webapp` sits on the personal account `kisame01` and
its branch protection is unenforceable because GitHub does not enforce rulesets on private
repositories on a free plan. **A public repository gets branch protection for free.** This site's
source is six pages of marketing HTML containing no secret, no client name and no personal data —
it is the one repository in the estate where public costs nothing and buys the control.
Recommendation: **public**, and take the free protection.

---

## 5. What this repository costs `lumit_webapp`, and it must be recorded there

`lumit_webapp/ROADMAP.md` Phase 2 is "Public website", with exit criteria of Lighthouse 95+, a clean
axe scan at WCAG 2.2 AA, rendering at 360px and a named reviewer signing an R2 proof pack. Behaviours
`B-008` and `B-009` in that repository are about `apps/public-web` — the very thing this repository
now supersedes.

**That is a real consequence and it is not yours to decide, but it is yours to raise.** Either
`lumit_webapp`'s Phase 2 is closed as delivered elsewhere and `apps/public-web` is retired, or the
two sites both exist and one of them is dead code. Leaving it unsaid is how a repository ends up
with a phase nobody can close and an app nobody dares delete.

Raise it with the owner **once**, in the same block as §4, and let him decide when he next opens
`lumit_webapp`. Do not edit that repository from this session.

---

## 6. YOUR FIRST JOB: issue and review `LWS-P1A-001`

The contract is already written and is at
`docs/context/cursor/grok/4_6/high/lws_p1a_001_contract.md`. **Read it before you do anything else.**
It was written by the same context that wrote this handover, which means it has not been reviewed by
anybody. Treat it accordingly: if a line is wrong, fix the line and say so.

### 6.1 What it asks for

A zero-dependency Node script, `scripts/check_site.mjs`, that fails the build on:

- **`B-001`** — any internal link (`href` starting `/`) that does not resolve to a file on disk
- **`B-002`** — any page missing exactly one `<h1>`, a `<title>`, a `<meta name="description">`, or
  whose `<link rel="canonical">` does not match its own path
- **`B-003`** — a `sitemap.xml` whose `<loc>` set is not exactly the set of pages on disk
- **`B-004`** — a header, footer or closing block that is not byte-identical across all six pages

Plus `package.json` with a single `gates` script and **no dependencies at all**, and a `.gitignore`.

### 6.2 The four things to check hardest

1. **Did it actually run the script against the real tree, or did it write the script and assert it
   would pass?** Demand the output. A gate that has never been run is a hope.
2. **Did any of the four checks go red on first run?** If all four passed first time on a
   hand-generated site, be suspicious — ask for the mutation results, which are the only proof the
   checks can fail at all.
3. **Byte counts of the ten site files in §2.2.** The contract forbids touching them. If one moved,
   the gate was "fixed" by editing the site rather than the checker. That is the single most likely
   failure mode here and it is RULE 009 in the sister repository: never change production markup to
   satisfy a test.
4. **Zero dependencies.** `package.json` must have no `dependencies` and no `devDependencies` keys at
   all. One `npm install` and this repository acquires a lockfile, a supply chain and a review
   obligation it does not need.

### 6.3 If the verdict is APPROVE

Then, and only then, **you write the prose** — no contract, no coder cycle:

`README.md` · `AGENTS.md` · `CLAUDE.md` (pointing at `AGENTS.md`, containing nothing of its own) ·
`CODEOWNERS` · `SECURITY.md` · `STATE.md` · `RULES.md` · `OPEN_DECISIONS.md` · `ROADMAP.md`

Keep them short. This is a six-page static site, not a platform. A `RULES.md` with two rules that are
true beats fourteen copied from a repository with different problems. **The one rule worth having on
day one:** the site stores nothing about a visitor — no form, no cookie, no analytics, no
third-party script — and that is a promise the contact page already makes in writing.

Then the owner runs `git init`, the first commit, and the push.

---

## 7. Findings carried in

1. **`device_bash` is dead. 8 September 2026 Windows update.** You have no shell on the owner's
   machine. Budget for it from the first call.
2. **A generated artefact with no generator in the repository is a source-of-truth problem, not a
   tidiness problem.** It took one session to create and D-LWS-001 exists because of it.
3. **Copying a sibling project's `docs/` tree for its scaffolding drags its records in with it.**
   §2.4. Check what came along before you commit, not after.
4. **The owner reads decisions, not essays.** Every response is exactly one of NEXT TASK, REVIEW or
   DECISION. If you are writing an essay you have picked the wrong one.
5. **A relayed verdict is not the owner's verdict.** An implementer report that contains an approval
   line is the implementer quoting you. It authorises nothing.
6. **Never pad a short SHA.** Read the full hash from `git rev-parse` output the owner pastes. This
   was fabricated twice in the sister repository and caught both times by the implementer.
7. **Commit the records before issuing any destructive command.** A `git reset --hard` handed to the
   owner while planner edits sat uncommitted destroyed a decision record in the sister repository.

---

## 8. Operational notes

- **Machine:** Windows, PowerShell 5.1. No `&&`. `git config --global core.editor notepad` is set;
  always supply `-m`. Use `git --no-pager diff`.
- **Repos live at `D:\dev\projects\<name>`.** `setup/` is one level up and holds `OPERATOR.md`, which
  is binding on tone, command style and approvals. Read it if the owner's preferences surprise you.
- **The owner is not a developer.** He leads agents and holds final authority. Plain language for
  anything he has to approve; jargon in a contract is fine, jargon in a decision is a failure.
- **Blocks of four or five lines, and every sequence ends with a verification command.**
- There is no Node toolchain pinned in this repository yet and no `.nvmrc`. The sister repository
  pins Node `24.14.1` and pnpm `11.20.0`. `LWS-P1A-001` deliberately uses **`node` alone with zero
  dependencies** so no pin is needed to run the gate. Do not introduce pnpm here without a reason.

---

## 9. What to do first

1. `device_request_folder_access` on `D:\dev\projects\lumit_website`. First tool call.
2. Full recursive `device_list_dir` with sizes. **Save it.** It is your before-listing and your
   scope proof for the whole of `LWS-P1A-001`.
3. Read `docs/context/cursor/grok/4_6/high/lws_p1a_001_contract.md`.
4. Confirm the ten byte counts in §2.2 still match. If any has moved, the owner has edited the site
   by hand and D-LWS-001 has already been answered by events — say so.
5. **Then stop.** Put §4's three decisions and §5's consequence to the owner in one block, restate in
   three or four lines where you believe things stand, and wait. Do not act on your own restatement.
