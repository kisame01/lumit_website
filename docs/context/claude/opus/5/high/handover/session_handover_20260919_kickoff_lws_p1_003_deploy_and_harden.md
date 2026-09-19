# Lumit Website — Planner/Reviewer Kickoff, LWS-P1-003: get it live, and review LWS-P1A-002

**THIS IS A CONTINUATION IN A NEW CONTEXT, NOT A FRESH PROJECT.** `D:\dev\projects\lumit_website` is
now a git repository with a public remote and two reviewed commits. Do not re-derive any of that.

Written 2026-09-19 by the Cowork planner context that reviewed `LWS-P1A-001`, fixed the contact-page
defect and took the repository through its first commit. **Everything in §2 was verified by listing
the tree and by fetching GitHub on 2026-09-19, not recalled.**

**Read §1, then §2, then §5. §5 is your first job. Two jobs run in parallel — read §5.0 before you
sequence anything.**

---

## 0. FILE LAYOUT

`lower_snake_case` for every file and folder under `docs/`; `docs/naming_convention.md` is the full
rule. Root files keep their SCREAMING_CASE names. **Identifiers are not filenames:** `LWS-P1-003`,
`B-005`, `D-LWS-004` keep their form in prose.

```
docs/context/claude/opus/5/high/handover/   session_handover_<yyyymmdd>_<slug>.md   <- you
docs/context/cursor/grok/5_6/high/          <task>_contract.md                      <- the coder
docs/decision/  docs/review/  docs/plan/  docs/note/                                <- records
```

**Write records straight to the repo and give the owner the path, not a chat code block.**

The next free planner task ID is **`LWS-P1-004`**, the next coder contract is **`LWS-P1A-003`**, and
the next free behaviour ID is **`B-006`**.

**Note the coder path moved.** `LWS-P1A-001` is under `cursor/grok/4_6/high/`; `LWS-P1A-002` was
written to `cursor/grok/5_6/high/` because the owner said he is now running grok 5.6. **Confirm which
model is actually in Cursor before you issue anything** — if it is still 4.6, the contract belongs in
the old path and this is a naming error to fix, not to perpetuate.

---

## 1. Bridge status — read this before your first tool call

**`device_bash` is dead on this machine.** Confirmed again on 2026-09-19: the mount fails with
`mnt/lumit_website failed to mount and cannot be reached from this shell`. A `ToolSearch` reload does
not fix it. **You have no shell on the owner's machine.** He pastes all command output.

**`device_list_dir`, `device_stage_files` and `device_commit_files` work.** Request
`D:\dev\projects\lumit_website` in your **first** tool call — granted immediately, no prompt delay,
on 2026-09-19.

**`WebFetch` needs the URL to have come from the owner.** A cold fetch of a URL he has not pasted
returns `PROVENANCE_REQUIRED` and the permission request times out unanswered. **Ask him to paste the
URL into the chat, then fetch it.** Also note fetches are **cached for 15 minutes per URL** — an
empty-repository answer for a repo that has since been pushed to is a stale cache, not the truth.
Bust it by fetching a different path, such as the commit URL.

**You can run `node` in the container.** Staging the site plus `scripts/` and running the gate there
is legitimate and is how `LWS-P1A-001` was actually verified rather than believed. The container ran
Node v22.22.2; the owner's machine runs v24.14.1. Nothing in the checker is version-sensitive.

### Editing a repo file with no shell

1. `device_stage_files` the file; record `mtimeMs` for `expectedMtimeMs`.
2. Edit in the **container** with a python3 heredoc, `encoding="utf-8", newline="\n"`, asserting each
   anchor occurs exactly once.
3. Write the result to a fresh path under `/mnt/user-data/outputs/`.
4. `device_commit_files` with that `stagedPath`.
5. **Verify the landed byte count with `device_list_dir`. Every time.**

A rejection saying *"device file changed since stage"* is often only an mtime touch with identical
bytes. **Re-stage, compare the content, and only then reapply** — do not reach for `force`.

---

## 2. State at handover — verified 2026-09-19

### 2.1 In version control, and verified from outside

| | |
|---|---|
| remote | `https://github.com/kisame01/lumit_website`, **public** |
| `main` | `07382f288f5e3b03c378b87f2d0cf84e4aabc66d` |
| commit 1 | `7d72c00e314e43b1ef9f0ce743ca5af495c61dc0` — 37 files, 3,933 insertions |
| commit 2 | `07382f2…` — `.gitattributes`, RULE 004, the line-endings note |

Both confirmed by fetching the commit pages on GitHub, not by trusting the push output.

### 2.2 The eleven site files — current, and `contact/index.html` is NOT what older records say

```
.htaccess 796 · index.html 12,251 · styles.css 11,539 · robots.txt 73 · sitemap.xml 649
assets/lumit-mark.svg 24,545 · about/ 6,342 · contact/ 5,173 · engagements/ 5,788
how-we-work/ 6,435 · services/ 16,439
```

**`contact/index.html` is 5,173, not 16,049.** It shipped with a leaked generator tail and was fixed
on 2026-09-19 — see `docs/review/review_20260919_contact_page_leaked_generator_tail.md`. Any record
or handover quoting 16,049 predates that fix. The site-wide internal link total is **68**, not 69.

Routes: `/` · `/services/` · `/how-we-work/` · `/engagements/` · `/about/` · `/contact/`

### 2.3 The gate

`scripts/check_site.mjs` (8,016), `package.json` (132), `.gitignore` (46), `.gitattributes` (902).
Zero dependencies, no lockfile, imports restricted to `node:fs`, `node:path`, `node:url`. Reviewed and
approved: `docs/review/review_20260919_lws_p1a_001_gate.md`.

```
site check: 6 pages | 68 internal links | 6 assets
site check ok
```

**One known gap, and `LWS-P1A-002` closes it.** `extractBlock` takes the first match, so a page
carrying two chrome blocks is compared on its first and the second is never gated. Proven, not
assumed: a second different `<footer>` appended to `about/index.html` and the gate still passed.
Nothing on the current tree is un-gated, so it is preventive.

### 2.4 Records in the repository

`README.md` · `AGENTS.md` · `CLAUDE.md` · `CODEOWNERS` · `SECURITY.md` · `RULES.md` (four rules) ·
`STATE.md` · `OPEN_DECISIONS.md` · `ROADMAP.md`, plus three reviews, one decision and one note under
`docs/`. **`STATE.md` and `OPEN_DECISIONS.md` are the two to read first** — they are current as of
commit two and they are the contract between sessions.

### 2.5 Hosting, bought and paid for — nothing deployed yet

Elitehost, purchased 2026-09-18, R372.17 including VAT. `lumittechnology.com` registered 18/09/2026,
expires 17/09/2027. "Unlimited (Local)" cPanel shared hosting at R65/month. SSL is Let's Encrypt via
AutoSSL, **R0** — the separately-sold R240/year certificate was deliberately not bought. Mailboxes
are included, **R0**.

`lucian@lumittechnology.com` and `tumi@lumittechnology.com` exist and are on the contact page as
`mailto:` links. `hello@` was proposed, declined in favour of the two named addresses, and **is
settled — do not re-open it.** SPF, DKIM and DMARC are **not confirmed done**.

---

## 3. Decisions already taken — do not re-open

- **D-LWS-001: the six HTML files are the source of truth.** No generator, never restored. B-004 (and
  now B-005) carry the part a generator actually protected.
- **D-LWS-002:** the QuondaLearn exam files were deleted before commit one.
- **D-LWS-003:** public, on `kisame01`. Public is what makes branch protection free.
- **Elitehost for domain, hosting and mail** — `RULING-008` in `lumit_webapp`.
- **Deployment is manual, by cPanel File Manager upload.** An automated deploy needs FTP credentials
  as a repository secret. Revisit only when the change rate justifies it.
- **No Google Workspace. No contact form, no analytics, no cookies, no third-party script.**

---

## 4. Owner items still open

### D-LWS-004 · Does `www` resolve, and to what?
`.htaccess` redirects `www` to the apex, which works only if `www.lumittechnology.com` has a DNS
record **and** the certificate covers it. AutoSSL normally issues for both when both are in the zone.
**Confirm both; do not assume.**

### D-LWS-005 · Google Fonts against the promise the contact page makes
Every page preconnects to `fonts.googleapis.com` and `fonts.gstatic.com` and loads a stylesheet from
Google, so every visitor's IP reaches Google on every page load. The contact page tells visitors the
site "runs no tracking, sets no cookies requiring consent, and keeps no database of visitors."
Narrowly true; still a third-party request the site did not need. Self-hosting the two families costs
roughly 200 KB under `assets/` and one head edit per page. **Recommendation: self-host.** Not blocking.

### Two facts the site is still missing
A **phone number** — the contact page has none, one was never supplied, and inventing one was not an
option. A **booking link** — "Book a landscape session" currently opens an email. Ask once, together,
and do not nag. Neither blocks anything.

### Raised once, and not this repository's to decide
`lumit_webapp` ROADMAP Phase 2 is "Public website" and `B-008`/`B-009` there cover `apps/public-web` —
the thing this repository supersedes. Either that phase closes as delivered elsewhere and
`apps/public-web` retires, or both exist and one is dead code. **Do not edit that repository from this
session.**

---

## 5. YOUR FIRST JOB

### 5.0 Two tracks, and they are independent — run them in parallel

`LWS-P1A-002` touches only `scripts/check_site.mjs`. The deployment touches only cPanel and DNS.
**Neither blocks the other**, so the coder works while the owner clicks. Sequencing them costs a day
for no benefit, and the owner's stated budget is time.

Before either, **branch protection on `main`** — two clicks, free because the repository is public,
and it is the one thing that protects everything already committed.

### 5.1 Track A — review `LWS-P1A-002`

The contract is at `docs/context/cursor/grok/5_6/high/lws_p1a_002_contract.md`, written 2026-09-19 by
the planner context that reviewed `LWS-P1A-001`. It adds **B-005**: each of the masthead, closing
block and footer must occur exactly once per page, evaluated before B-004 and suppressing B-004 for
that block when it fails.

**The four things to check hardest:**

1. **Was the gate actually run, with output pasted?** A gate that has never been run is a hope.
2. **Did M3 fire B-004 for the footer as well as B-005?** If so the suppression in §2 is not
   implemented. Did M4 still fire B-004? If not, the suppression went too far and switched B-004 off.
   Those two mutations exist only to catch each other's failure mode.
3. **The eleven byte counts in §6.** If one moved by roughly the number of lines in the file, that is
   a line-ending conversion, not an edit — check `.gitattributes` survived.
4. **Still zero dependencies**, still only `node:fs`/`node:path`/`node:url`, `package.json` and
   `.gitignore` untouched.

**Verify it yourself:** stage the site and `scripts/` into the container and run `node
scripts/check_site.mjs` there. Do not review from the report alone — that is how `LWS-P1A-001`'s real
gap was found.

On APPROVE, the owner commits on a branch and merges. **No agent merges.**

### 5.2 Track B — get it live, then prove it from outside

**Certificate first, and give him this alone in its own block:**

> cPanel → **SSL/TLS Status** → tick `lumittechnology.com` and `www.lumittechnology.com` → **Run
> AutoSSL** → wait until both show a valid certificate.

`.htaccess` forces HTTPS on every request. **If files land before the certificate exists, every
visitor gets a browser security warning instead of a website.** This is the single most likely way
for this task to look failed when nothing is wrong. AutoSSL first, upload second.

**Then the upload, four steps, and the hidden-files line matters:**

> 1. cPanel → **File Manager** → **public_html**
> 2. Delete Elitehost's placeholder `index.html`
> 3. Upload the eleven site files (or a zip, then right-click → **Extract**, then delete the zip)
> 4. Settings → tick **Show Hidden Files** → confirm `.htaccess` is present

**`.htaccess` is a dotfile and File Manager hides dotfiles by default.** Without it, five of six
routes still work but the HTTPS redirect, the `www` canonicalisation, the security headers and the
404 page all silently do not exist. **This is the check people skip.**

**Then the mail records, which are not optional:**

> cPanel → **Email Deliverability** → if `lumittechnology.com` shows any problem, click **Repair**.

That writes SPF and DKIM. cPanel does **not** write DMARC — add it by hand:

> cPanel → **Zone Editor** → Manage `lumittechnology.com` → **Add Record**
> Type `TXT` · Name `_dmarc` · TTL `14400`
> Value: `v=DMARC1; p=none; rua=mailto:lucian@lumittechnology.com; fo=1`

`p=none` is monitor-only and correct for a domain that has never sent mail. **Around 2026-10-19, once
his own mail is passing, move to `p=quarantine`, then later `p=reject`.** Straight to reject is how a
new domain silently bins its own invoices. The date is already in `STATE.md`.

**Then one real mail round trip** — outside address to `lucian@`, and a reply back — before those
addresses sit on a public website.

### 5.3 Then verify it yourself. This is the part that makes you a reviewer.

**Do not ask the owner whether the site looks right. Fetch it.** Ask him to paste the URL first, then:

1. All six routes return content — not a redirect loop, not a 404.
2. Each page's `<title>` differs and matches its route.
3. `https://www.lumittechnology.com/` lands on the apex.
4. `http://lumittechnology.com/` upgrades to HTTPS.
5. `/sitemap.xml` and `/robots.txt` parse and list the six real URLs.
6. A URL that does not exist gets the `.htaccess` 404 behaviour.

**A page that fetches is evidence. A screenshot he pasted is a report.**

### 5.4 Then write it down

`docs/decision/decision_<yyyymmdd>_site_live.md` — the date, the URLs that verified, the certificate
status, whether `www` resolved, whether DMARC landed. Two hundred words. Update `STATE.md` and tick
ROADMAP Phase 2. **A deployment nobody wrote down cannot be audited when it breaks.**

---

## 6. If the deployment goes wrong — the four worth predicting

| symptom | almost certainly |
|---|---|
| Security warning on every page | `.htaccess` uploaded before AutoSSL issued. Run AutoSSL; nothing needs re-uploading. |
| `/` works, `/services/` 404s | `.htaccess` missing, or folders flattened on extraction. Look for `services/index.html`, not `services.html`. |
| Loads but unstyled | `styles.css` not at the root of `public_html`, or extracted one directory too deep. Every page links `/styles.css` absolutely. |
| Logo is a broken image | `assets/lumit-mark.svg` missing. It is also the favicon, so the tab icon is blank too. |

**If two are true at once, the zip extracted into a subdirectory.** Look for
`public_html/lumit-site/index.html` before debugging anything else.

---

## 7. Findings carried in — the ones that cost something

1. **`device_bash` is dead. 8 September 2026 Windows update.** Budget for it from the first call.
2. **"It renders" is not evidence a page is correct.** `contact/index.html` looked perfect in a
   browser for a day while carrying an unterminated `<script>` and a duplicate footer. A
   hand-generated site has no compiler to say otherwise.
3. **Land planner edits before a coder starts.** On 2026-09-19 a contract revision and a source fix
   landed while Cursor was mid-run. Its report was honest and stale, and it read as a discrepancy
   until the mtimes were reconstructed. **The planner caused that. Do not repeat it.**
4. **Reconstruct timelines from mtimes before accusing anybody of anything.** That is what turned an
   apparent fabrication into a race condition.
5. **A measurement discipline has dependencies of its own.** Byte counts were chosen as scope proof
   because they cannot be argued with — which held only until `core.autocrlf` nearly rewrote every
   file. See `docs/note/note_20260919_crlf_and_byte_count_discipline.md`.
6. **The coder was right and the contract was wrong, once.** Read implementer push-back as evidence,
   not as a task being handed back. It cost nothing to check and it corrected a contract error.
7. **Never pad a short SHA.** Read the full hash from `git rev-parse` or from the commit page.
8. **The owner reads decisions, not essays.** Every response is exactly one of NEXT TASK, REVIEW or
   DECISION. Four or five lines per block, every sequence ending in a verification command. He skips
   steps in long ones — this is documented, not a guess.

---

## 8. Operational notes

- **Machine:** Windows, PowerShell 5.1. **No `&&`.** One command per line. `-m` inline on every
  commit and merge. `git --no-pager diff`.
- **`setup/OPERATOR.md`** at `D:\dev\projects\setup\` is binding on tone, command style and approvals.
- **The owner is not a developer.** He leads agents and holds final authority. Plain language for
  anything he approves; jargon in a contract is fine, jargon in a decision is a failure.
- **He is the only one who merges, tags, spends money or clicks a control panel.** No agent merges.
- **No credentials anywhere** — not in a file, not in a contract, not in the repository, not in chat.
- **`lumit_webapp` is a different project under heavier governance. Do not edit it from this session.**

---

## 9. What to do first

1. `device_request_folder_access` on `D:\dev\projects\lumit_website`. First tool call.
2. Recursive `device_list_dir` with sizes. **Save it** — it is your before-listing and your scope
   proof for `LWS-P1A-002`.
3. Read `STATE.md`, `OPEN_DECISIONS.md`, then
   `docs/context/cursor/grok/5_6/high/lws_p1a_002_contract.md`.
4. Confirm the eleven byte counts in §2.2. If one moved, say so before anything else — and check
   whether it moved by about the file's line count, which means a line-ending conversion.
5. **Then stop.** Restate in three or four lines where things stand, put §4's open items to the owner
   in one block, and wait. Do not act on your own restatement.
