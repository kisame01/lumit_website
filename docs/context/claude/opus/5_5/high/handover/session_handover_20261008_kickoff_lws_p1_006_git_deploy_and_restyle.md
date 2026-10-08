# Lumit Website — Planner/Reviewer Kickoff, LWS-P1-006: deploy by git, then restyle

**THIS IS A CONTINUATION IN A NEW CONTEXT, NOT A FRESH PROJECT.** The site has been live at
`https://lumittechnology.com` since 2026-09-19, the repository is public at
`https://github.com/kisame01/lumit_website`, and five coder contracts have been reviewed and merged.
Do not re-derive any of that.

Written 2026-10-08 by the planner context that reviewed LWS-P1A-003 to LWS-P1A-005 and wrote
LWS-P1A-006. **Everything in §3 was measured on 2026-10-08** — by fetching the live site, querying
DNS through two resolvers, reading the GitHub API, and diffing the redesign against the live page —
not carried forward from September and not taken from the owner's report.

**You are Claude Opus 5.5 High, the planner and reviewer. The coder is Cursor running Grok 4.7 High.
The owner is Lucian, and he alone merges, pushes, spends money and clicks control panels.**

**Read §1, §3 and §5 before your first tool call. §5 is your first job.**

---

## 0. Files and identifiers

`lower_snake_case` for everything under `docs/`; `docs/naming_convention.md` is the rule. Root files
keep their SCREAMING_CASE names. **Identifiers are not filenames:** `LWS-P1A-006`, `B-008`,
`D-LWS-010` keep their form in prose.

```
docs/context/claude/opus/5_5/high/handover/   session_handover_<yyyymmdd>_<slug>.md   <- you
docs/context/cursor/grok/4_7/high/            <task>_contract.md                      <- the coder
docs/context/cursor/grok/4_7/high/handover/   the coder's kickoff brief
docs/decision/  docs/review/  docs/note/  docs/reference/                             <- records
```

The September lanes, `claude/opus/5/high/` and `cursor/grok/4_6/high/`, are history. **Never rename
them** — the path is the record of which model did the work.

| next free | ID |
|---|---|
| planner task | **`LWS-P1-007`** — this kickoff is `LWS-P1-006` |
| coder contract | **`LWS-P1A-007`** — `LWS-P1A-006` is written and issued |
| behaviour | **`B-009`** — `B-008` is consumed by `LWS-P1A-006` |

**Behaviour IDs are per repository.** `lumit_webapp` has its own `B-008`; it is unrelated.

**Write records straight into the repository and give the owner the path.** Not a chat code block.

## 1. How this project runs

- **The owner reads decisions, not essays.** Every reply is one of **NEXT TASK, REVIEW or DECISION**.
  Four or five lines a block. Commands as a paste-ready block. He skips steps in long sequences —
  this is documented, not a guess.
- **He wants agents to fetch their own evidence.** Do not ask him to paste output you can read
  yourself, and do not ask whether something "looks right" — measure it.
- **He wants to be corrected when the evidence disagrees with him.** On 2026-10-08 he said the
  redesign's text was unchanged; fourteen segments differed, one of them an email address that would
  bounce. Telling him was the job.
- **Machine:** Windows, PowerShell 5.1. **No `&&`.** One command per line. `-m` inline on every commit
  and merge. `git --no-pager diff`.
- **`D:\dev\projects\setup\OPERATOR.md` is binding** on tone, command style and approvals.
- **No credentials anywhere** — not in a file, a contract, the repository or a chat. The git
  deployment in §5 was chosen precisely because it needs none.
- **`lumit_webapp` is a different, private project under heavier governance.** Do not touch it from
  here. On 2026-10-08 the owner linked it by mistake and confirmed **git deployment for the site means
  `lumit_website`**.

## 2. Tools — what works, as of 2026-10-08

**`device_list_dir`, `device_stage_files` and `device_commit_files` work.** Request
`D:\dev\projects\lumit_website` in your first tool call. `D:\dev\projects\lws_deploy` was also
connected; it is the owner's old manual-upload staging folder and becomes unnecessary once git
deployment works.

**`device_bash` was dead in September** — the mount failed, after an 8 September Windows update. It
was not re-tested on 2026-10-08. Try it once; if the mount fails, do not retry, and budget for having
no shell on his machine.

**Editing a repository file with no shell:**

1. `device_stage_files` the file; note `mtimeMs`.
2. Edit in the container with `encoding="utf-8", newline=""`, asserting each anchor occurs once.
3. Write it under `/mnt/user-data/outputs/`.
4. `device_commit_files` with `expectedMtimeMs`.
5. **Verify the landed byte count with `device_list_dir`. Every time.**

**`git merge` touches the mtime of files it did not change.** If a commit is refused on mtime, re-stage,
confirm by checksum that the content is untouched, then write. Do not use `force` to skip that check.

**The built-in browser is your instrument.** `request_access` per host, then `javascript_tool` in a
page context:

- **Live bytes:** `fetch(path + '?cb=' + Date.now(), {cache:'no-store'})` and
  `arrayBuffer().byteLength`. **Never `String.length`** — UTF-16 units, not bytes; the em-dashes alone
  make a served page look smaller than the file.
- **Whether an upload actually landed:** read `Last-Modified` from the same fetch. This is what caught
  the half-landed upload.
- **DNS:** `fetch('https://dns.google/resolve?name=…&type=TXT')`, and cross-check with
  `https://cloudflare-dns.com/dns-query` and `accept: application/dns-json`. The container's own
  network cannot reach either.
- **GitHub:** `fetch('https://api.github.com/repos/kisame01/lumit_website/branches/main')` from a page
  context gives the SHA and `protected` without credentials. The container's `gh` returns 403 unless the
  repository is attached to the session.
- **Stale browser cache will fool you.** On 2026-09-19 a measurement showed the old layout because the
  page loaded `styles.css` from cache (`transferSize: 0`). `fetch(url, {cache:'reload'})` refreshes the
  cache entry; then reload and re-measure.

**The container has Node v22 and Playwright with Chromium.** Import it by absolute path:
`/home/claude/.npm-global/lib/node_modules/playwright/index.mjs`. Stage the tree, serve it with a
ten-line `node:http` server, and measure at fixed viewports. **`browser.newContext({javaScriptEnabled:
false})` is the honest no-JS test** — Cursor's environment cannot keep script disabled across
navigation and uses a sandboxed iframe instead. Two methods agreeing is better evidence than one.

**Staging the tree and running the gate in the container is how every contract so far has been
verified rather than believed.** Do it for every review.

## 3. State at handover — verified 2026-10-08

| | |
|---|---|
| live site | **all ten files byte-identical to `main`**; every route 200; missing URL 404 |
| LWS-P1A-005 | **live** — landed 2026-09-19 18:37–18:39 UTC; confirmed only on 2026-10-08 |
| `main` | **`203ab193de9e98fedb0164236cb5ed0428f8fc1c`**, unchanged since 2026-09-19 |
| branch protection | **off** |
| gate | `site check: 6 pages \| 68 internal links \| 6 assets` / `site check ok` |
| DMARC | **`v=DMARC1; p=none;` — still no `rua=`**, both resolvers, TTL 14400 |
| `enquiries@` | live on the contact page; `lucian@`/`tumi@` appear nowhere on the site |

```
.htaccess 796 · index.html 12,860 · styles.css 12,667 · robots.txt 73 · sitemap.xml 649
assets/lumit-mark.svg 24,646 · about/ 6,962 · contact/ 5,646 · engagements/ 6,408
how-we-work/ 7,001 · services/ 17,040 · scripts/check_site.mjs 10,034
```

**Records written or updated on 2026-10-08**, all uncommitted when this was written:
`docs/decision/decision_20261008_cpanel_git_deployment_and_restyle_scope.md` (new),
`docs/context/cursor/grok/4_7/high/lws_p1a_006_contract.md` (new), the coder's kickoff brief (new),
this file (new), `STATE.md`, `OPEN_DECISIONS.md`, `ROADMAP.md` and `AGENTS.md` (updated). The redesign
reference `docs/reference/redesign_20261008.html` was placed by the owner.

**`STATE.md` will name `main` as `203ab19…` after the owner commits these records.** That staleness
recurs because a handover is committed in the commit it describes. Expect it; it is not a defect.

## 4. Decisions already taken — do not reopen

- **D-LWS-001:** the six HTML files are the source of truth. No generator.
- **D-LWS-003:** the repository is public, on `kisame01`. **That is now load-bearing** — it is why git
  deployment needs no credential.
- **D-LWS-004:** `www` is a CNAME to the apex; the redirect preserves the path.
- **D-LWS-007, closed 2026-10-08: deploy by cPanel Git™ Version Control**, pull deployment, public
  HTTPS clone, no secret. `.cpanel.yml` names every file. B-008 proves it.
- **D-LWS-009:** one shared address, `enquiries@lumittechnology.com`. Live and tested.
- **D-LWS-010, 2026-10-08 — the restyle:** keep the real mark; keep dark mode; **the live text wins**
  — `<title>`, meta description, `enquiries@`; the six-page structure stays; styles in `styles.css`;
  icons as inline SVG with no library; adopt the closing-block em-dash fix on all six pages.
- **Elitehost for domain, hosting and mail.** No Google Workspace. **No contact form, no analytics, no
  cookies, no third-party script** — RULE 001, which the contact page states in writing.
- **No phone number, no booking link, no "coming soon".** D-LWS-008 is a separate project.
- **Branch protection, when it goes on:** block force pushes and deletions **only**. "Require a pull
  request" locks out the sole committer.

## 5. YOUR FIRST JOB — review LWS-P1A-006, then walk the owner through the first git deploy

**The contract is `docs/context/cursor/grok/4_7/high/lws_p1a_006_contract.md`.** It creates
`.cpanel.yml` — exact content given, **857 bytes** — and adds **B-008** to the gate: the set of files
`.cpanel.yml` copies must equal the set of files the site uses, derived from the pages rather than
hard-coded. Nine mutations; **M5 is the one that matters** — a new asset used by a page, present on
disk, absent from the manifest, which nothing before B-008 would catch.

**This is Grok 4.7's first contract here.** Read its report as evidence, the way the last five were:
every Grok 4.6 push-back on a contract line turned out to be worth reading, and three were simply right.

### 5.1 Review it independently

1. Recursive `device_list_dir` with sizes before you read the report — your scope proof.
2. Stage the tree and the new files; run the gate in the container; reproduce all nine mutations.
3. **Read the site-set derivation in the code.** The point of B-008 is that the restyle's new files are
   caught without anyone editing the check. If it hard-codes the current eleven beyond `.htaccess`,
   `robots.txt` and `sitemap.xml`, it fails the contract even if every mutation passes.
4. **Re-run the deploy emulation against the coder's exact `.cpanel.yml`** — this is what was run
   before the contract was issued:

```bash
T=$SCRATCH/cpanel_test; rm -rf $T; mkdir -p $T/home/public_html $T/home/repositories
REPO=$T/home/repositories/lumit_website; cp -a <staged tree> $REPO
mkdir -p $REPO/docs && echo private > $REPO/docs/x.md      # must never be published
echo stock > $T/home/public_html/php.ini                    # must survive a deploy
python3 -I -c "import re,sys;[print(m.group(1)) for l in open(sys.argv[1]) for m in [re.match(r'^\s*-\s+(.*)$',l)] if m]" \
  $REPO/.cpanel.yml > $T/tasks.sh
(cd $REPO && HOME=$T/home bash -e $T/tasks.sh)
# expect exactly the eleven site files, byte-identical, plus php.ini; and no docs/, scripts/,
# STATE.md, .git or .cpanel.yml under public_html
```

An emulation is not Elitehost. It proves the manifest; the first real deploy proves the host.

### 5.2 Then the owner's steps in cPanel — exactly these

**First, a ten-second check:** cPanel → **Files** → is there a **Git™ Version Control** icon? Some
hosts switch it off. If it is missing, stop; the fallback is File Manager, and a ticket to Elitehost.

Then, after he has committed and pushed LWS-P1A-006:

1. **Git™ Version Control → Create.**
2. **Clone a Repository: on.**
3. Clone URL: `https://github.com/kisame01/lumit_website.git`
4. Repository Path: `repositories/lumit_website` — **never anything inside `public_html`.**
5. Repository Name: `lumit_website` → **Create**.
6. **Manage → Pull or Deploy → Update from Remote → Deploy HEAD Commit.**

**The first deploy copies byte-identical files.** The site does not visibly change, but **every one of
the eleven `Last-Modified` stamps moves.** That is your proof. Check all eleven from outside, plus the
headers, both redirects and the 404.

**If the deploy fails:** the likeliest cause is `$HOME` not being set during the deploy. The live site
will not have changed. The fallback is hard-coding `/home/<username>/public_html` in `.cpanel.yml` —
**the owner's decision, because the repository is public** and the username is half the login.

**Every later deploy is:** gate green locally → commit → push → **Update from Remote → Deploy HEAD
Commit** → planner verifies `Last-Modified` from outside. Never edit files inside the cPanel clone; a
dirty working tree blocks deployment. Never force-push `main`; Update from Remote is fast-forward only.

### 5.3 After the first verified deploy

Rewrite `README.md`'s **Deploying** section — it still describes File Manager uploads and still says
the gate checks B-001 to B-004. It is now B-001 to B-008. **Write it only after the deploy is verified
from outside**, not before; a README describing a deploy that has not happened is the kind of record
this repository exists to avoid.

## 6. THEN — LWS-P1A-007, the restyle

**The owner's words:** proper styling and icons, following the redesigned page; a full stylesheet in
the brand colours; icons for the services, the process steps and the comparison table; responsive on
mobile and desktop; a styled header, hero, service cards and call to action; **in a separate CSS file,
not inline**; the text unchanged.

**The reference:** `docs/reference/redesign_20261008.html`, 24,983 bytes. **Read the decision record
§2 and §3 before you open it.** What it is: a **single-page homepage mockup** with inline styles, an
inline SVG `<symbol>` sprite of 26 stroke icons, cards, effort pills on the disposition matrix, and a
navy closing band. Strong direction. **Do not port its structure — port its look.**

### 6.1 What the reference gets wrong — the contract must not copy any of these

| # | finding | so the contract says |
|---|---|---|
| 1 | Closing button emails **`hello@`**, which does not exist | live `enquiries@` and live `/contact/` link stay |
| 2 | **No navigation on a phone with JavaScript off** — `nav{display:none}` below 720px, unconditionally | keep the live `.is-enhanced` progressive enhancement from LWS-P1A-003 |
| 3 | Menu script **outside `<header>`**, so ungated | keep the live toggle script inside the masthead |
| 4 | **Focus ring cyan on near-white: 1.99:1** | focus ring in the accent blue on light, cyan only on navy; ≥ 3:1 |
| 5 | **White icon on the cyan end of the service tile: 2.10:1** | darken the gradient's light end or use a navy glyph; ≥ 3:1 |
| 6 | Breakpoint 720px | keep **767.98px** — measured and verified |
| 7 | Single-page anchor nav | keep the six routes and the live nav labels |
| 8 | Redrawn inline logo | keep `assets/lumit-mark.svg` |
| 9 | Light only | dark variant of every token |
| 10 | `style="…"` attributes | classes in `styles.css` |
| 11 | `<title>` and description changed | live wins |
| 12 | Decorative icons lack `aria-hidden="true"` | every decorative `<svg>` gets `aria-hidden="true" focusable="false"` |

**Every text-on-background pair in the reference passes WCAG AA** — computed, the tightest is muted
grey on the table header at 4.52:1. Keep that margin when you add the dark palette; check it again.

### 6.2 Decisions the contract has to make — mine are recommendations

- **Icon sprite: one shared file, `assets/icons.svg`, referenced as
  `<use href="/assets/icons.svg?v=1#i-cloud">`.** Cached once, not duplicated six times. The gate's
  `collectAttrs` already picks up `href`, so **B-001 checks the file exists and B-008 automatically
  requires it in `.cpanel.yml`** — the first real test of B-008's design. **But nothing checks that
  `#i-cloud` exists in the file.** A typo renders as a silent blank square. **That is `B-009`**: every
  `<use href>` fragment names a `<symbol id>` that exists in its file.
- **The internal link count will rise** if `<use href>` is counted as a link, by one per icon used.
  Decide whether the banner counts them, and state the new expected banner exactly in the contract —
  "68" has been a stop condition in five contracts and must not silently become wrong.
- **Bump `styles.css` to `?v=3`.** The September lesson: new markup with a cached old stylesheet is the
  half-deployed state. Every version string must move when the file does.
- **The masthead is gated chrome.** Restyling it is CSS; anything added to its markup — a menu icon in
  the toggle, say — must be byte-identical on all six or B-004 fires.
- **The closing block is gated chrome too.** The em-dash fix goes in identically six times; B-004
  verifies it for free.
- **Live markup the reference renamed:** the live `<h1>` uses `<em>` where the reference uses `<span>`;
  the live page has `.gut` gutter labels ("01 — Position") where the reference has icon `.tag`s. Style
  the live markup; do not swap it.

### 6.3 Five pages have no mockup

The reference covers the homepage only. `services/` has six sections, `how-we-work/` four steps,
`about/` four panels, `contact/` three keyed rows, `engagements/` is mostly prose. They share class
names with the homepage, so most of the restyle carries across through `styles.css`. **For icons on
those pages, specify the mapping in the contract** — the six service icons for the six service
sections is the obvious one — rather than leave the coder to choose. The sprite has no mail icon; the
contact page may want one.

### 6.4 What the review must measure

Light and dark × JavaScript on and off × toggle open and closed × 320, 375, 767, 768 and 1100 × all six
routes. **Zero horizontal overflow everywhere**; masthead 61px closed below the breakpoint unless the
contract changes it deliberately; masthead blocks byte-identical; contrast for text and for icons and
focus rings; **every icon renders** — a missing symbol is invisible to the eye at a glance and obvious
to `getBBox()`.

**Before you issue it, prototype the risky parts in the container** — the dark palette's contrast, the
external `<use>` rendering, the no-JS layout. Two contracts in September carried a predicted result
that turned out wrong; both were caught by the coder, and both could have been caught by the planner
first.

## 7. THEN — LWS-P1A-008, self-hosted fonts

D-LWS-005. Work Sans and JetBrains Mono are both SIL OFL — self-hosting is permitted; ship `OFL.txt`
beside them. `woff2`. Take only the weights the restyle actually uses. Record each file's source URL
and SHA-256. Add `*.woff2 binary` to `.gitattributes` so nobody's tooling ever treats a font as text.
**B-008 will refuse the deploy until every font file is in `.cpanel.yml`** — which is exactly its job.

## 8. Owner items still open

- **DMARC `rua=`** — open since launch. Edit, never add a second record. `rua=` goes to `lucian@`, not
  `enquiries@`. **The 2026-10-19 move to `p=quarantine` cannot happen on time**; it is re-dated to four
  weeks after the edit, in `STATE.md`.
- **Branch protection** — force pushes and deletions only. **Now part of the deploy path.**
- **AutoSSL** renews before 17 Dec 2026. Confirm it did in early December.

## 9. Findings carried in — the ones that cost something

1. **"It renders" is not evidence.** `contact/index.html` shipped an unterminated `<script>` that
   rendered perfectly for a day. B-007 now catches it.
2. **"It looks fine on my phone" is not evidence.** The homepage was 662px wide in a 375px viewport
   when the owner reported "two small kinks".
3. **A record existing is not a record being correct.** `_dmarc` is present and has been useless for
   three weeks.
4. **An upload that looks fine can be half-landed.** Check `Last-Modified`.
5. **Long cache plus unversioned URLs serves new HTML with old CSS for a week.** Version every asset
   URL, and bump it when the file changes.
6. **Byte counts are the scope proof**, and they depend on `.gitattributes` and RULE 004.
   `String.length` is not bytes.
7. **The coder was right and the contract was wrong — repeatedly.** LWS-P1A-003's M4 prediction,
   LWS-P1A-004's §2.2/§2.4 conflict, and smaller ones. Read push-back as evidence.
8. **Test the instruction before you issue it.** LWS-P1A-005's no-JS fix and versioned-URL behaviour
   were rendered and gated in the container first; that contract came back with no wrong predictions.
9. **Never pad a short SHA.** Read the full hash.
10. **The redesign said "text unchanged" and was mostly right.** Diff it anyway; the one exception was an
    address that would have bounced every enquiry from the homepage.

## 10. What to do first

1. `device_request_folder_access` on `D:\dev\projects\lumit_website`. First tool call.
2. Recursive `device_list_dir` with sizes. **Save it** — your before-listing.
3. Read `STATE.md`, `OPEN_DECISIONS.md`, and
   `docs/decision/decision_20261008_cpanel_git_deployment_and_restyle_scope.md`.
4. Re-fetch the live site's ten files and `main`'s SHA. **If anything moved since §3, that is the
   finding.**
5. If Cursor's LWS-P1A-006 report has arrived, review it per §5.1. If not, wait for it — do not start
   LWS-P1A-007 while LWS-P1A-006 is unreviewed; the restyle is meant to go through a proven pipeline.
6. **Then stop**, restate in three or four lines where things stand, and give the owner one NEXT TASK
   block.
