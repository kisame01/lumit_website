Task Contract LWS-P1A-006 — B-008, deploy by cPanel Git, and make the gate prove what gets deployed

> ROLE: you implement this contract. You do not write contracts. If a line here looks wrong, say
> which line and why in your report — do not rewrite it and do not hand back a task.

Task: LWS-P1A-006 — sixth task in this repository, **first for Cursor running Grok 4.7 High.**
Risk: **R1 — two files, and neither is served to a visitor.** One new file at the repository root,
one change to the gate. No page, stylesheet or asset changes.
Repository: `D:\dev\projects\lumit_website`
Behaviour IDs: **B-008** (new). B-001 to B-007 exist and must not regress.

Read `docs/context/cursor/grok/4_7/high/handover/session_handover_20261008_coder_kickoff.md` first.
It is short and it is the house rules.

---

## 0. Why this task exists

**The site is deployed by hand today**, through cPanel File Manager on Elitehost, one folder at a time.
On 2026-09-19 that went wrong: an upload **half-landed**. Five pages updated and three files did not,
and for ten minutes the live site served new HTML against an old stylesheet. Nobody could tell from
looking at the pages that landed.

**On 2026-10-08 the owner decided to deploy through cPanel's Git™ Version Control instead.** cPanel
clones the public GitHub repository `https://github.com/kisame01/lumit_website` over HTTPS, and on
the owner's click copies the site into `public_html`. The repository is public, so **no password,
token or key is stored anywhere** — cPanel's own documentation says a clone URL "cannot contain a
username-and-password pair". That decision is recorded in
`docs/decision/decision_20261008_cpanel_git_deployment_and_restyle_scope.md`.

**What gets copied is controlled by one file, `.cpanel.yml`, by name.** That is the safety property —
`docs/`, `scripts/`, `STATE.md` and `.git` must never reach the public web — and it is also the new
risk. **A file the site needs that is not listed in `.cpanel.yml` silently does not deploy.** The
next task is a restyle that adds new asset files. Without a check, the first of them to be missed
reproduces the half-landed upload exactly, through the new pipeline.

**B-008 makes the gate prove that `.cpanel.yml` deploys exactly the site: nothing missing, nothing
extra.**

**You still do not run `git`.** No `add`, `commit`, `branch`, `checkout`, `stash`. The owner commits.

## 1. File one — `.cpanel.yml`, exactly this

Create `.cpanel.yml` at the repository root with **exactly** this content. The planner has already
emulated a cPanel deploy with it against the current tree: the eleven site files landed
byte-identical, an existing `php.ini` in `public_html` survived, and `docs/`, `scripts/`,
`STATE.md`, `.git` and `.cpanel.yml` itself stayed out.

```yaml
---
deployment:
  tasks:
    - export DEPLOYPATH=$HOME/public_html
    - /bin/mkdir -p $DEPLOYPATH/assets $DEPLOYPATH/about $DEPLOYPATH/contact $DEPLOYPATH/engagements $DEPLOYPATH/how-we-work $DEPLOYPATH/services
    - /bin/cp .htaccess $DEPLOYPATH/.htaccess
    - /bin/cp index.html $DEPLOYPATH/index.html
    - /bin/cp styles.css $DEPLOYPATH/styles.css
    - /bin/cp robots.txt $DEPLOYPATH/robots.txt
    - /bin/cp sitemap.xml $DEPLOYPATH/sitemap.xml
    - /bin/cp assets/lumit-mark.svg $DEPLOYPATH/assets/lumit-mark.svg
    - /bin/cp about/index.html $DEPLOYPATH/about/index.html
    - /bin/cp contact/index.html $DEPLOYPATH/contact/index.html
    - /bin/cp engagements/index.html $DEPLOYPATH/engagements/index.html
    - /bin/cp how-we-work/index.html $DEPLOYPATH/how-we-work/index.html
    - /bin/cp services/index.html $DEPLOYPATH/services/index.html
```

**857 bytes, LF line endings, one trailing newline.** If your count differs, you have not made the
same file. `.gitattributes` already pins `*` to LF, so do not touch it.

**Why `$HOME` and not `/home/<username>/`:** the repository is public, and the cPanel username is half
of the account login. `$HOME` keeps it out of a public file. If `$HOME` turns out not to be set
during an Elitehost deploy, the copy fails and **nothing on the live site changes** — a safe failure,
and the planner verifies every deploy from outside. That fallback is the owner's decision, not yours.

## 2. File two — B-008 in `scripts/check_site.mjs`

### 2.1 What B-008 checks

Read `.cpanel.yml` from the repository root. Parse it with no dependency — the format above is fixed,
so a line parser is enough: every line after `tasks:` that matches `^\s*-\s+(.+)$` is one task.

**Rules, each a B-008 violation when broken:**

1. **The file exists.** Missing → `.cpanel.yml:1  B-008 .cpanel.yml not found`.
2. **The first task is exactly `export DEPLOYPATH=$HOME/public_html`.**
3. **Every other task is one of exactly two shapes:**
   - `/bin/mkdir -p` followed by one or more `$DEPLOYPATH/<dir>` arguments;
   - `/bin/cp <src> $DEPLOYPATH/<src>` — **the destination is `$DEPLOYPATH/` followed by the source
     path, character for character.** No renames.

   Anything else → `B-008 task not allowed: <task>`. That includes `rm`, `rsync`, `mv`, any flag on
   `cp` such as `-r`, `-R` or `-a`, and any second `export`.
4. **No source is absolute, contains `..`, or contains a wildcard** (`*`, `?`, `[`, `]`, `{`, `}`).
5. **Every `cp` destination directory exists before it is used** — either `$DEPLOYPATH` itself or a
   directory created by an earlier `mkdir -p` task.
6. **Every `cp` source exists on disk** as a file.
7. **The deployed set equals the site set — this is the rule the task exists for.**

   - **The site set** is: every page the gate already discovers from the filesystem; plus every
     internal `href` or `src` on any page that resolves to an existing file, using the gate's
     existing `collectAttrs` and `resolveOnDisk`; plus the three root files no page links to —
     `.htaccess`, `robots.txt`, `sitemap.xml`. **Derive it; do not hard-code the eleven.** The next
     task adds files and this must notice them without being edited.
   - **The deployed set** is the set of `cp` sources.
   - In the site set but not deployed →
     `.cpanel.yml:1  B-008 <path> is part of the site but is not deployed`
   - Deployed but not in the site set →
     `.cpanel.yml:<line>  B-008 <path> is deployed but is not part of the site`
   - Deployed twice → `.cpanel.yml:<line>  B-008 <path> is deployed more than once`

Line numbers are the 1-based line of the offending task in `.cpanel.yml`, in the same `path:line  ID
message` shape every other violation uses.

### 2.2 What must not change about the gate

- **The banner stays exactly** `site check: 6 pages | 68 internal links | 6 assets` on this tree. Do
  not add a deployment count to it — reviews and contracts compare the banner as a string.
- The last line stays `site check ok` or `site check FAILED: <n> violations`. Clean tree exits 0.
- B-008 runs **after** B-001 to B-007 and **suppresses nothing**. A missing page and an undeployed
  page are different defects.
- Pages are still discovered from the filesystem. Nothing is hard-coded to six.
- Imports stay `node:fs`, `node:path`, `node:url`. **RULE 003: no dependency, no YAML library, no
  lockfile, no `npm install`.**

## 3. Nothing else

```
.cpanel.yml                    CREATE
scripts/check_site.mjs         MODIFY
```

**No site file changes.** Not any `.html`, not `styles.css`, not `assets/**`, not `.htaccess`, not
`robots.txt`, not `sitemap.xml`. Not `package.json`, `.gitignore`, `.gitattributes`, `README.md`,
`STATE.md`, `OPEN_DECISIONS.md`, `ROADMAP.md`, `AGENTS.md` or anything under `docs/`.

**If B-008 goes red on the clean tree, stop.** Either your check is wrong or the manifest in §1 is —
report which. **Do not edit a site file to make B-008 pass.** RULE 002.

## 4. Byte counts — the baseline you start from

```
.htaccess                      796          <- must not change
index.html                  12,860          <- must not change
styles.css                  12,667          <- must not change
robots.txt                      73          <- must not change
sitemap.xml                    649          <- must not change
assets/lumit-mark.svg       24,646          <- must not change
about/index.html             6,962          <- must not change
contact/index.html           5,646          <- must not change
engagements/index.html       6,408          <- must not change
how-we-work/index.html       7,001          <- must not change
services/index.html         17,040          <- must not change
scripts/check_site.mjs      10,034          <- will change
.cpanel.yml                (absent)         <- created, 857
package.json                   132          <- must not change
.gitattributes                 902          <- must not change
```

Report all fifteen at the end. If a count is off by roughly the number of lines in a file, you have a
line-ending conversion, not an edit — say so and stop. RULE 004.

## 5. Mutations — nine, one at a time, every one reverted

Record the byte count before you touch a file and again after you restore it. **State both numbers for
every mutation.**

| # | mutation | predicted red | predicted green |
|---|---|---|---|
| M1 | Delete the `/bin/cp about/index.html …` task | **B-008** `about/index.html is part of the site but is not deployed` | B-001 to B-007 |
| M2 | Add `- /bin/cp STATE.md $DEPLOYPATH/STATE.md` at the end | **B-008** `STATE.md is deployed but is not part of the site` | B-001 to B-007 |
| M3 | Add `- /bin/cp -R docs $DEPLOYPATH/docs` at the end | **B-008** task not allowed | B-001 to B-007 |
| M4 | Change the `styles.css` task's destination to `$DEPLOYPATH/style.css` | **B-008** task not allowed (destination ≠ source). Whether `styles.css` *also* reports as not deployed depends on whether you count a disallowed task's source — **either is acceptable; report which you chose and why** | B-001 to B-007 |
| M5 | Create `assets/probe.svg` (any valid SVG) and add `<img src="/assets/probe.svg" alt="">` inside `<main>` on `about/index.html` only, **without** touching `.cpanel.yml` | **B-008** `assets/probe.svg is part of the site but is not deployed`. **B-001 stays green** — the file exists | B-001, B-002, B-003, B-004, B-005, B-007 |
| M6 | Replace the six page `cp` tasks with one `- /bin/cp */index.html $DEPLOYPATH/` | **B-008** task not allowed, and six pages not deployed | B-001 to B-007 |
| M7 | Rename `.cpanel.yml` to `.cpanel.yml.bak` | **B-008** `.cpanel.yml not found` | B-001 to B-007 |
| M8 | Move the `mkdir -p` task to the very end | **B-008** for every `cp` into a sub-directory — the directory does not exist yet when it is used | B-001 to B-007 |
| M9 | **Regression** — remove `</script>` from all six mastheads | **B-007**, six lines, exactly as before this task | B-001 to B-006, **B-008** |

**M5 is the one this task exists for.** It is the restyle's failure mode rehearsed in advance: a new
asset the site uses, present on disk, invisible to every check that existed before today. M5 needs
two files restored — the SVG removed and `about/index.html` back to 6,962.

**M9 matters because M5 touches a page.** Confirm B-008 does not mask or duplicate B-007's output.

**A mutation that comes back green is a result, not a failure.** Report it and stop. Do not strengthen
the check after the fact to make it red, and do not change a site file to make anything green.

## 6. Report back

1. all fifteen byte counts from §4, before and after;
2. the full clean-run output including the banner, and `node -v`;
3. the nine mutation results — exact violation lines, exit codes, before/after byte counts;
4. how the site set is derived, quoted from your code — **show that nothing in it is hard-coded to the
   current eleven files** beyond the three root files §2.1 names;
5. how `.cpanel.yml` is parsed, quoted, and why it needs no dependency;
6. residual risks and open questions;
7. anything in this contract you think is wrong, quoted by line.

## 7. Stop and ask if

- the clean tree does not come back with zero violations, or the banner is not
  `6 pages | 68 internal links | 6 assets`;
- **B-008 fires on the clean tree** with the §1 manifest;
- M1, M5 or M7 comes back green;
- your `.cpanel.yml` is not 857 bytes;
- you believe any file outside §3 needs to change;
- you find yourself wanting a YAML library or any other dependency. You do not need one.

## 8. After you report — not your work, recorded so you know where this goes

The planner reviews your report independently: stages the tree, runs the gate, reproduces the
mutations, and **re-runs the deploy emulation** against your exact `.cpanel.yml`. Then the owner, in
cPanel: **Files → Git™ Version Control → Create → Clone a Repository**, Clone URL
`https://github.com/kisame01/lumit_website.git`, Repository Path `repositories/lumit_website` —
**never inside `public_html`** — then **Manage → Pull or Deploy → Update from Remote → Deploy HEAD
Commit**. The first deploy copies byte-identical files, so the site does not visibly change, but
every `Last-Modified` moves. The planner checks all eleven from outside. **That is the proof the
pipeline works before the restyle goes through it.**
