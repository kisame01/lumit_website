# Lumit Website — Planner/Reviewer Kickoff, LWS-P1-004: clean the live site up

**THIS IS A CONTINUATION IN A NEW CONTEXT, NOT A FRESH PROJECT.** The site is **live** at
`https://lumittechnology.com`, the repository has a public remote, and `main` is four commits in. Do
not re-derive any of that.

Written 2026-09-19 by the Cowork planner context that reviewed `LWS-P1A-002` and took the site
through deployment. **Everything in §2 and §5 was measured — by fetching the live site, by querying
DNS, and by rendering the pages at 375px — not recalled and not taken from the owner's report.**

**Read §1, then §2, then §5. §5.1 is your first job and it is bigger than the owner thinks it is.**

---

## 0. FILE LAYOUT

`lower_snake_case` for every file and folder under `docs/`; `docs/naming_convention.md` is the full
rule. Root files keep their SCREAMING_CASE names. **Identifiers are not filenames:** `LWS-P1-004`,
`B-006`, `D-LWS-007` keep their form in prose.

```
docs/context/claude/opus/5/high/handover/   session_handover_<yyyymmdd>_<slug>.md   <- you
docs/context/cursor/grok/4_6/high/          <task>_contract.md                      <- the coder
docs/decision/  docs/review/  docs/plan/  docs/note/                                <- records
```

**Write records straight to the repo and give the owner the path, not a chat code block.**

The next free planner task ID is **`LWS-P1-005`**, the next coder contract is **`LWS-P1A-004`**
(`LWS-P1A-003` is written and sitting at `docs/context/cursor/grok/4_6/high/lws_p1a_003_contract.md`),
and the next free behaviour ID is **`B-007`**. **`B-006` is consumed by `LWS-P1A-003`** — the
responsive masthead.

**The coder is Cursor running grok 4.6 high. There is no Grok 5.6** — 4.6 is the current Grok in
Cursor, confirmed by search on 2026-09-19. A previous planner invented `5_6/`, wrote a contract into
it, and the path has since been corrected. `cursor/grok/5_6/` no longer exists. **Do not recreate it.**

---

## 1. Bridge status — read this before your first tool call

**`device_bash` is dead on this machine.** Confirmed again 2026-09-19: the mount fails with
`mnt/lumit_website failed to mount and cannot be reached from this shell`. **You have no shell on the
owner's machine.** He pastes all command output.

**`device_list_dir`, `device_stage_files` and `device_commit_files` work.** Request
`D:\dev\projects\lumit_website` in your **first** tool call — granted immediately, no prompt delay.

**The built-in browser works and it changes how you review.** `Claude_Browser__preview_start`,
`navigate`, `javascript_tool`, `read_network_requests` and `resize_window` are all live. You will
need `request_access` per host first; it is granted immediately.

This is the single biggest capability change since the last handover. **You can now measure the live
site yourself:**

- `javascript_tool` running `fetch()` in the page context gives you status codes, response headers
  and exact `arrayBuffer().byteLength` per route. That is how §2.2's byte table was produced.
- `fetch('https://dns.google/resolve?name=…&type=TXT')` from the page context gives you real DNS.
  **The container's own network cannot do this** — the egress proxy rejects `cloudflare-dns.com`.
  Go through the browser.
- `resize_window` with preset `mobile` plus an off-screen iframe at 375px lets you find layout
  overflow precisely, element by element. That is how §5.1 was diagnosed.

**Stop asking the owner whether something looks right. Measure it.**

**You can run `node` in the container.** Staging the site plus `scripts/` and running the gate there
is how both `LWS-P1A-001` and `LWS-P1A-002` were actually verified rather than believed. Container
Node is v22.22.2; the owner's machine runs v24.14.1. Nothing in the checker is version-sensitive.

### Editing a repo file with no shell

1. `device_stage_files` the file; record `mtimeMs` for `expectedMtimeMs`.
2. Edit in the **container** with `encoding="utf-8", newline="\n"`, asserting each anchor occurs once.
3. Write to a fresh path under `/mnt/user-data/outputs/`.
4. `device_commit_files` with that `stagedPath`.
5. **Verify the landed byte count with `device_list_dir`. Every time.**

---

## 2. State at handover — verified 2026-09-19

### 2.1 Version control

| | |
|---|---|
| remote | `https://github.com/kisame01/lumit_website`, **public** |
| `main` | `ea647e5906cf5f62697549c6c5544c603c7ae142`, pushed, working tree clean |
| gate | `site check: 6 pages \| 68 internal links \| 6 assets` / `site check ok`, exit 0 |

`scripts/check_site.mjs` is **9,413** bytes and now enforces B-001 to B-005.

**Branch protection is still off.** When it goes on: **block force pushes and block deletions only**.
Do **not** enable "require a pull request" — the owner is the sole committer and it locks him out.
A previous handover got this wrong.

### 2.2 The site is live, and every byte of it matches the repository

Measured by fetching each route and reading `arrayBuffer().byteLength`:

```
/ 12,251 · /services/ 16,439 · /how-we-work/ 6,435 · /engagements/ 5,788
/about/ 6,342 · /contact/ 5,173 · sitemap.xml 649 · robots.txt 73
.htaccess 796 · styles.css 11,539 · assets/lumit-mark.svg 24,545
```

All six routes 200 with distinct, correct `<title>`s. `sitemap.xml` as `application/xml`,
`robots.txt` as `text/plain`. **No line-ending rewrite in transit** — RULE 004 held end to end.

`.htaccess` is present and active, proven by behaviour rather than by looking for the file: `http://`
self-upgrades to `https://`; `X-Content-Type-Options`, `X-Frame-Options` and `Referrer-Policy` are on
every response; `https://www.lumittechnology.com/about/` lands on `https://lumittechnology.com/about/`
**with the path preserved**. A missing URL returns **status 404**, not a soft 200.

`/php.ini` returns **403** — Elitehost's stock config sits in `public_html` and the server already
blocks it. It was left in place deliberately; deleting it on cPanel can break the account's PHP
handler. No `.htaccess` rule needed.

### 2.3 DNS and mail — three of four confirmed, one is not

Queried live via `dns.google` through the browser:

| record | value | verdict |
|---|---|---|
| SPF | `v=spf1 +a +mx +ip4:164.160.91.16 include:spf.zamailgate.com ~all` | correct |
| DKIM | `default._domainkey`, 2048-bit RSA | correct |
| MX | `0 mail.lumittechnology.com.` | correct |
| `www` | **CNAME → `lumittechnology.com.`** | correct — closes D-LWS-004 |
| **DMARC** | **`v=DMARC1; p=none;`** | **incomplete — no `rua=`** |

**`_dmarc` already existed before anyone touched it, and it has no reporting address.** It is a valid
record that does nothing: monitor-only with the monitor switched off. The owner was asked to **edit**
it — never to add a second, because two DMARC records on one name is treated as *no policy at all* —
to:

```
v=DMARC1; p=none; rua=mailto:lucian@lumittechnology.com; fo=1
```

**As of the last query it still read `v=DMARC1; p=none;`.** The zone TTL is 14400, so a recent save
can sit behind four hours of resolver cache. **Re-query before you conclude anything.** Do not accept
"I did it" and do not accept a screenshot of the zone editor — query DNS.

Certificate: AutoSSL Domain Validated for the apex, `www` and eight service subdomains, expiring
17 December 2026, auto-renewing. R0.

**A real mail round trip was completed** — outside address in to `lucian@`, reply back out, both
arrived. Reported by the owner; this one genuinely cannot be verified from here.

### 2.4 Records in the repository

`README.md` · `AGENTS.md` · `CLAUDE.md` · `CODEOWNERS` · `SECURITY.md` · `RULES.md` (four rules) ·
`STATE.md` · `OPEN_DECISIONS.md` · `ROADMAP.md`, plus four reviews, two decisions and two notes.
**`STATE.md` and `OPEN_DECISIONS.md` are the two to read first.**

Note `STATE.md` currently names `main` as `deb8eaf…`; it is now `ea647e5…`. **Correct it in your
first write.** This staleness recurs because the handover is committed in the same commit it
describes — expect it, don't treat it as a defect.

---

## 3. Decisions already taken — do not re-open

- **D-LWS-001: the six HTML files are the source of truth.** No generator, never restored.
- **D-LWS-002:** the QuondaLearn exam files were deleted before commit one.
- **D-LWS-003:** public, on `kisame01`. Public is what makes branch protection free.
- **D-LWS-004: closed yes**, on evidence. `www` is a CNAME to the apex, the certificate covers it,
  the redirect preserves the path.
- **Elitehost for domain, hosting and mail** — `RULING-008` in `lumit_webapp`.
- **Deployment is manual, by cPanel File Manager upload** — but see D-LWS-007 in §6, which the owner
  has now asked to revisit.
- **No Google Workspace. No contact form, no analytics, no cookies, no third-party script.**
- **No phone number and no booking link on the site, and no "coming soon" placeholder.** Owner's
  call: silence reads deliberate, "coming soon" reads unfinished. Superseded only by §6's operator
  project actually shipping.
- **`hello@` was declined** in favour of the two named addresses. Settled.

---

## 4. The deployment lesson, because it will recur

**cPanel File Manager's Upload accepts files, never folders.** On 2026-09-19 the owner uploaded the
four root files individually and hand-created the five page directories. The folder mtimes gave it
away — 10:42, 10:43, 10:44, 10:45, 10:45, where an archive extraction stamps them all in one second.

`.htaccess` is the file most likely to be lost that way: File Manager hides dotfiles by default, and
without it the redirects, the security headers and the 404 all fail silently while the homepage still
looks perfect. **It survived this time.** The reviewer suspected it was missing, was wrong, and was
wrong in the safe direction — the check cost one minute.

**Next deployment: build a zip of exactly the eleven files, flat at the archive root, and use
Extract.** Never upload the repository folder — that publishes `.git` and `docs/` on the public web.

---

## 5. YOUR FIRST JOB — the mobile layout, and it is worse than reported

The owner reported mobile as "perfect, just 2 small kinks". **Measured at 375×812, every page
scrolls horizontally, and the homepage is the worst by a factor of six.** He has not seen the bigger
one. Tell him plainly.

### 5.1 Defect A — the homepage is 662px wide inside a 375px viewport

`document.documentElement.scrollWidth` is **662** on `/`. 287px of overflow. Diagnosed to the exact
element:

```
div.matrix-scroll   width 642   overflow-x: auto    min-width: 0     <- correctly configured
  table.matrix      width 640                       min-width: 640px <- intentional, fine
div (no class)      width 642   overflow-x: visible min-width: auto  <- THE DEFECT
div.annot           width 335
```

The unclassed `div` between `.matrix-scroll` and `.annot` is a flex or grid item with the default
`min-width: auto`, so it **refuses to shrink below its content width** and drags the scroller out
with it. `.matrix-scroll` is doing its job; its parent never lets it narrow. The classic fix is
`min-width: 0` on that intermediate item, possibly with `max-width: 100%` on `.matrix-scroll`.

**Confirm the diagnosis yourself before writing the contract.** Load `/` in an off-screen 375px
iframe, walk the ancestor chain from `.matrix-scroll`, and read `min-width` and `overflow-x` at each
level. Do not take this paragraph's word for it.

### 5.2 Defect B — "Book a session" overflows the masthead on every page

50px of overflow on all six routes, `a.btn` at `left: 268.6, right: 424.9` against a 375 viewport.
Its parent is `div.wrap.masthead-in`, `display: flex`, **`flex-wrap: nowrap`**, `gap: 14px`, and the
button itself is `white-space: nowrap`. The masthead simply does not wrap at phone widths.

This is the one the owner noticed, and his phone screenshot corroborates the measurement: at phone
width the nav links stack vertically down the masthead while the button stays on a single row beside
them and runs off the right edge, clipped mid-word at "Book a ses…". It is the smaller of the two.

Note what the same screenshot shows about the mark: in dark mode the cloud glyph and the `LUMIT`
wordmark both read clearly. It is the `L` letterform *inside* the cloud — the `fill="#041E49"` — that
goes low-contrast. **The defect is narrower than "the logo is invisible", so scope the fix to that
fill and do not repaint the whole mark.**

### 5.3 Defect C — the mark is near-invisible in dark mode

`assets/lumit-mark.svg` carries hard-coded colours: `fill="#041E49"` for the letterform, plus blue
and cyan gradients. **No `currentColor` and no `prefers-color-scheme` block.** `#041E49` on a dark
page is the problem the owner described, and because the mark is also the favicon the tab icon goes
with it.

An SVG loaded through `<img>` *does* honour its own internal `@media (prefers-color-scheme: dark)`,
so a `<style>` block inside the file is the one-file fix. **Verify that claim in the browser before
you commit to it** — if it does not hold, inlining the SVG is the fallback and it changes six pages
instead of one file.

### 5.4 Defect D — the masthead is 290px tall on a phone, and this one changes the risk profile

The owner asked on 2026-09-19 for the stacked six-item nav to become horizontal or a hamburger.
Measured across thirteen widths, the masthead height is **73px at 1100, 106px at 768, 187px at 600,
267px at 480 and 290px at 375** — at phone width it eats **36% of the viewport before any content**.
Horizontal is not an option at 375: six labels do not fit, and a scrolling strip hides items. **A
toggle is the answer.**

**This is now `B-006`, and it is specified in `LWS-P1A-003`.**

**It also invalidates the convenient thing about A, B and C.** A and B are `styles.css`; C is the SVG
alone. D is not — a toggle needs a control **inside `<header class="masthead">`**, which means all six
HTML files change and **B-004 and B-005 are live on this task**. The six mastheads must stay
byte-identical or the gate goes red, which is the gate doing its job.

The contract turns that into an advantage: it *requires* the toggle markup and its inline script to
sit inside the masthead, so the gate covers the new code for free. It also predicts equal byte deltas
across the six HTML files as a second, independent check that one block was pasted six times rather
than typed six times.

**Watch the `<script>`.** Six new inline scripts, and the defect that shipped on `contact/index.html`
was an unterminated `<script>` that rendered perfectly for a day. The gate still cannot see an
unterminated tag — that is residual 2 in §5.6, and it is now materially more likely to bite.

### 5.5 Then the unslop pass — and it is a separate contract, deliberately

The owner has asked for the prose to be cleaned, em-dashes first. **Do not bundle it with the layout
fixes.** Layout is CSS and one asset; prose edits touch all six HTML files, move every byte count and
run straight through the B-004/B-005 chrome comparison. Two contracts, in this order:

- **`LWS-P1A-003` — the responsive masthead (B-006), plus defects A, B and C.** Written, issued,
  awaiting the coder. Your first job is to review its report.
- **`LWS-P1A-004` — the prose pass.** It **reports what it found before it changes a word**. RULE 002
  applies to prose exactly as it applies to markup. Every edited page's byte count is re-recorded.
  Watch the chrome: if the pass rewords anything inside the masthead, closing block or footer, it
  must do so identically on all six pages or B-004 goes red — which is the gate doing its job.

There is a local `anthropic-skills:unslop` skill available in the Cowork session. Read it before
writing that contract.

### 5.6 And `B-007`, still unwritten — the two gate residuals

Two residuals from the `LWS-P1A-002` review, both disclosed honestly by the coder and both confirmed
by the reviewer's own mutations:

1. **A chrome defect on the reference page reports six times.** Delete the footer from `index.html`
   and the gate emits one B-005 plus five `B-004 footer missing` lines, because `chromeOk` is only
   consulted for `loaded.slice(1)`. One defect, six violations.
2. **An unterminated chrome start tag is invisible.** Append `<footer>` with no `</footer>` and the
   gate prints `site check ok`. The count is of complete start-plus-end pairs — which is exactly what
   the contract specified, so this is correct-as-built, not a coder error. **It is also the same
   shape as the defect that actually shipped on `contact/index.html`.**

Full detail in `docs/review/review_20260919_lws_p1a_002_b005.md`.

---

## 6. New work the owner raised on 2026-09-19

### 6.1 D-LWS-007 · Deploying to cPanel without a human clicking

The owner asked whether Claude or Cursor can push to Elitehost directly. **Yes, and every route needs
a credential stored somewhere.** Lay the options out and let him choose; do not pick for him.

| route | what it needs | who holds the secret |
|---|---|---|
| GitHub Actions + cPanel **API token** | token in GitHub repository secrets; a workflow file in the repo | GitHub. **Claude never sees it.** |
| GitHub Actions + **FTP credentials** | FTP password in GitHub secrets | GitHub, but it is an account password, not a scoped token |
| Claude or Cursor calling cPanel UAPI directly | token pasted into a session | **Rejected.** See below. |

**Recommendation: the cPanel API token via GitHub Actions**, if he wants this at all. A token is
scopable and revocable and is not the account password; the workflow file lives in the repository
where it can be reviewed; and the secret is set by him in GitHub's UI and never enters a chat.

**The third route is not on the table.** No credential goes into a session, a file, a contract or the
repository — that rule predates this handover and does not bend for convenience.

**My honest read: not yet.** This site changed once in its life, today. An automated deploy earns its
keep at a change rate this site does not have, and it adds a credential to protect in exchange. The
cleanup work in §5 produces exactly one more upload. **Revisit after that upload, with real evidence
about how often this actually happens.** Say so, and then do what he decides.

### 6.2 A new project, not this repository — the bot call operator

The owner wants a phone operator that books meetings, explicitly as an alternative to publishing
personal cell numbers. **This is its own repository and its own Claude project. Do not build it
here.** Capture it, hand it over, and keep this repository to six HTML pages.

His three requirements, in his words:

1. Tell the caller it is a bot, and that no information is stored.
2. Ask what times they are available and book a slot in Lucian's and/or Tumi's mailbox.
3. Offer a rating at the end, thank them for being willing to speak to a bot, and pass the rating back.

Build approach he floated: an open-source library fronting a choice of models — ChatGPT, Gemini,
Claude, or a cheap strong Chinese model — chosen for cost and voice latency.

**Two things to put to him before anything gets built, because they are correctness issues rather
than preferences:**

- **Requirement 1 is not achievable as stated.** A bot that takes a name, a phone number and an
  availability window and writes a calendar invite **is** storing personal information — in the
  calendar, in the mailbox, and almost certainly in the voice provider's logs and transcripts. The
  honest version of that sentence is a minimal-retention promise the system can actually keep, not
  "nothing is stored". **Getting this wrong on a recorded line is worse than not building it**, and
  it would contradict RULE 001, which the site states in writing.
- **POPIA applies.** South African processing of personal information, plus a recorded or transcribed
  call, brings consent and notification obligations. That shapes the opening script and the retention
  window — it is a design input on day one, not a compliance review at the end.

Neither is a reason not to build it. Both are reasons the first artefact is a one-page scope with the
opening script written out, not a stack choice.

---

## 7. Findings carried in — the ones that cost something

1. **`device_bash` is dead. 8 September 2026 Windows update.** Budget for it from the first call.
2. **The browser changed the job.** Six routes, five DNS records and three layout defects were
   measured in four tool calls. Any handover that still says "ask the owner to paste the URL" is out
   of date — you can `request_access` and fetch.
3. **"It renders" is not evidence a page is correct.** `contact/index.html` looked perfect in a
   browser for a day while carrying an unterminated `<script>` and a duplicate footer.
4. **"It looks fine on my phone" is not evidence either.** The owner reported two small kinks; the
   homepage was 1.8× the viewport wide. Measure `scrollWidth`.
5. **A record existing is not a record being correct.** `_dmarc` was present and useless. Read values,
   never row names.
6. **Reconstruct timelines from mtimes before accusing anybody of anything.** Staggered folder mtimes
   are what proved the zip was never extracted.
7. **Byte counts are the scope-proof mechanism and they have a dependency** — `.gitattributes` and
   RULE 004. Also: `String.length` counts UTF-16 units, not bytes. Em-dashes and other multi-byte
   characters will make a served page look "smaller" than the repository. **Use
   `arrayBuffer().byteLength`.** This nearly produced a false defect report.
8. **The coder was right and the contract was wrong, once**, and it pushed back correctly a second
   time. Read implementer push-back as evidence, not as a task being handed back.
9. **Never pad a short SHA.** Read the full hash from `git rev-parse`.
10. **Two `git` failures on 2026-09-19 were both "already done"** — a branch that existed and a `git mv`
    whose source had already moved. Check state before declaring a problem.
11. **The owner reads decisions, not essays.** Every response is exactly one of NEXT TASK, REVIEW or
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
  This is why §6.1's recommended route puts the secret in GitHub, where he sets it and no agent reads it.
- **`lumit_webapp` is a different project under heavier governance. Do not edit it from this session.**
  Its ROADMAP Phase 2 "Public website" and its `B-008`/`B-009` are now superseded *in production* by
  this repository. **Raise it there, not here.**

---

## 9. What to do first

1. `device_request_folder_access` on `D:\dev\projects\lumit_website`. First tool call.
2. Recursive `device_list_dir` with sizes. **Save it** — it is your before-listing and your scope proof.
3. Read `STATE.md`, `OPEN_DECISIONS.md`, then
   `docs/review/review_20260919_lws_p1a_002_b005.md`.
4. Confirm §2.2's byte counts **on the live site**, through the browser, not just on disk. If one
   differs between disk and server, the server is stale and that is the finding.
5. **Re-query `_dmarc` DNS.** If `rua=` is still missing, that is the one open item from Phase 2 and
   it goes to the owner before anything else.
6. Reproduce §5.1 and §5.2 at 375px yourself.
7. **Then stop.** Restate in three or four lines where things stand, put §6's two decisions to the
   owner in one block, and wait. Do not act on your own restatement.
