# Lumit Website — Planner/Reviewer Kickoff, LWS-P1-002: put the site on the internet

**THIS IS A KICKOFF. Your job is a deployment, not a build.** The site is finished. The hosting is
paid for. Nothing in this task writes application code, and **no agent touches the hosting control
panel or the DNS zone** — the owner clicks, you tell him exactly what to click and you verify the
result afterwards from outside.

Written 2026-09-19 by the Cowork planner context that designed and generated the site. **Everything
in §2 was confirmed against the owner's own invoice and the repository tree on 2026-09-19, not
recalled.**

**Read §0, then §2, then §5. §5 is the whole of your first job.**

---

## 0. FILE LAYOUT

`lower_snake_case` under `docs/`; `docs/naming_convention.md` is the full rule and it applies here.
Root files keep their SCREAMING_CASE names. **Identifiers are not filenames:** `LWS-P1-002`,
`D-LWS-004`, `B-001` keep their form in prose.

```
docs/context/claude/opus/5/high/handover/   session_handover_<yyyymmdd>_<slug>.md   <- you
docs/context/cursor/grok/4_6/high/          <task>_contract.md                      <- the coder
docs/decision/  docs/review/  docs/plan/  docs/note/                                <- records
```

**Write records straight to the repo and give the owner the path, not a chat code block.**

The next free planner task ID is **`LWS-P1-003`**; the next free coder contract is **`LWS-P1A-002`**.

---

## 1. Bridge status

**`device_bash` is dead on this machine** — a Windows update released 8 September 2026 stops the
Cowork workspace mounting the drive
(`sandbox-helper: no Plan9 drive shares mounted under /mnt/.virtiofs-root/shared`). A `ToolSearch`
reload does not fix it. **You have no shell on the owner's machine.**

`device_list_dir`, `device_stage_files` and `device_commit_files` work. Request
`D:\dev\projects\lumit_website` in your **first** tool call.

**For this task you also have `WebFetch`, and it is your primary instrument.** Once the site is up,
you verify it from the outside — fetch the pages yourself rather than asking the owner whether they
look right. That is the difference between evidence and a report.

---

## 2. State at handover — verified 2026-09-19

### 2.1 What is bought and paid for

The owner purchased both on 2026-09-18, invoice total **R372.17** including 15% VAT:

| item | supplier | detail |
|---|---|---|
| `lumittechnology.com` | Elitehost | registered 18/09/2026, expires 17/09/2027, R279.00 |
| "Unlimited (Local)" shared hosting | Elitehost | cPanel, R65/month, pro-rated R93.17 to 31/10/2026 |
| SSL | Let's Encrypt via cPanel AutoSSL | included, **R0** — the separately-sold R240/year certificate was deliberately not bought |
| Mailboxes | included in the plan | **R0** |

**Whole-year cost of the site and mail is about R1,060.** The alternative costed at the time —
Cloudflare Registrar plus Cloudflare Pages plus Google Workspace for two users — came to roughly
R4,500, because Workspace alone is around R4,300. The owner spotted that the bundled mailboxes made
email free rather than hosting free. He was right and the planner was not; it is recorded in
`lumit_webapp/docs/rulings/RULING-008-hosting-and-mail.md`.

### 2.2 Mail, already done

**`lucian@lumittechnology.com` and `tumi@lumittechnology.com` exist.** The owner created them in
cPanel on 2026-09-19. Both appear on the site's contact page as `mailto:` links.

**`hello@` was proposed and not created.** The recommendation was a forwarder rather than a mailbox,
so a prospect does not immediately learn they have reached one person. The owner went with the two
named addresses. That is his call and it is settled — do not re-open it unless he does.

**SPF, DKIM and DMARC are NOT confirmed done.** See §5.3. This is the part of the setup most likely
to have been skipped, and the one whose failure shows up as a client saying "I never got your
proposal" three weeks later.

### 2.3 What is in the repository

Six pages of static HTML, one stylesheet, the mark as SVG, `robots.txt`, `sitemap.xml` and an
Apache `.htaccess`. Ten files, byte counts confirmed on 2026-09-19:

```
.htaccess 796 · index.html 12,251 · styles.css 11,539 · robots.txt 73 · sitemap.xml 649
assets/lumit-mark.svg 24,545 · about/ 6,342 · contact/ 16,049 · engagements/ 5,788
how-we-work/ 6,435 · services/ 16,439
```

Routes: `/` · `/services/` · `/how-we-work/` · `/engagements/` · `/about/` · `/contact/`

**The repository is not under version control yet.** That is `LWS-P1-001`, a separate kickoff at
`docs/context/claude/opus/5/high/handover/session_handover_20260919_kickoff_lws_p1_001_add_to_git.md`.
**The two tasks are independent** — the site can be uploaded before it is committed, and probably
will be. Say so plainly rather than blocking one on the other, but do not let `LWS-P1-001` quietly
never happen: until it does, this site exists in exactly one place on one machine.

### 2.4 What the `.htaccess` does, because it can take the site down

```
force https on every request
www.lumittechnology.com -> lumittechnology.com, 301
X-Content-Type-Options nosniff, Referrer-Policy strict-origin-when-cross-origin, X-Frame-Options SAMEORIGIN
CSS cached 7 days, SVG 30 days, HTML not cached
ErrorDocument 404 /index.html
```

**The forced-HTTPS rule is the trap.** If the certificate has not been issued when the files land,
every request redirects to `https://` and the visitor gets a browser security warning instead of a
website. **AutoSSL runs first, upload second.** This is the single most likely way for this task to
appear to have failed when nothing is actually wrong.

---

## 3. Decisions already taken — do not re-open these

- **Elitehost for domain, hosting and mail.** Recorded as `RULING-008` in `lumit_webapp`.
- **Deployment is manual, by cPanel File Manager upload.** An automated deploy would need FTP
  credentials as a repository secret. The sister repository's RULE 012 forbids a workflow that
  references any secret, and spending a ruling to save two minutes a month on a site that changes a
  handful of times a year is the wrong trade. **Revisit only when the change rate justifies it.**
- **No Google Workspace.** Reversible at any time by swapping MX records; nothing else moves.
- **No contact form, no analytics, no cookies, no third-party script.** The contact page says in
  writing that the site stores nothing about a visitor. That promise is now a constraint: anything
  that would falsify it needs the owner, not a judgement call.

---

## 4. Owner items — one open, plus two facts still missing

### D-LWS-004 · Does `www` resolve, and to what?

**Blocking: nothing today, but it will embarrass someone eventually.** The `.htaccess` redirects
`www` to the apex, which only works if `www.lumittechnology.com` has a DNS record and the SSL
certificate covers it. cPanel's AutoSSL normally issues for both when both exist in the zone.
**Confirm both; do not assume.** If `www` has no record, the redirect is dead code and anyone typing
`www.` gets nothing.

### Two facts the site is still missing

Ask **once**, in the same block, and do not nag:

1. **A phone number.** The contact page has none, deliberately — one was never supplied and inventing
   one was not an option. Consultancy prospects do look for a number.
2. **A booking link**, if he ever sets up a scheduler. The "Book a landscape session" button
   currently opens an email. That is honest and it works; a calendar link would work better.

Neither blocks going live. Both are a five-minute edit afterwards.

---

## 5. YOUR FIRST JOB: get it up, then prove it from outside

### 5.1 Certificate first

Give the owner this, and nothing else in the same block:

> cPanel → **SSL/TLS Status** → tick `lumittechnology.com` and `www.lumittechnology.com` → **Run
> AutoSSL** → wait until both show a valid certificate.

If AutoSSL fails, it is almost always because DNS has not propagated to the point where Let's
Encrypt can validate the domain. The domain was registered on 2026-09-18, so this should be settled
— but check the nameservers are Elitehost's own before diagnosing anything else.

### 5.2 Then the upload

Four steps, and the hidden-files line matters:

> 1. cPanel → **File Manager** → **public_html**
> 2. Delete Elitehost's placeholder `index.html`
> 3. Upload the ten site files (or the zip, then right-click → **Extract**, then delete the zip)
> 4. Settings → tick **Show Hidden Files** → confirm `.htaccess` is present

**`.htaccess` is a dotfile and File Manager hides dotfiles by default.** If it is missing, five of
the six routes still work but the HTTPS redirect, the `www` canonicalisation, the security headers
and the 404 page all silently do not exist. **This is the check people skip.**

### 5.3 Then the mail records, which are not optional

> cPanel → **Email Deliverability** → if `lumittechnology.com` shows any problem, click **Repair**.
> That writes SPF and DKIM into the zone for you.

cPanel does **not** write DMARC. Add it by hand:

> cPanel → **Zone Editor** → Manage `lumittechnology.com` → **Add Record**
> Type `TXT` · Name `_dmarc` · TTL `14400`
> Value: `v=DMARC1; p=none; rua=mailto:lucian@lumittechnology.com; fo=1`

`p=none` means monitor, do not block — correct for a domain that has never sent mail. **In about a
month, once his own mail is passing, move to `p=quarantine`, then later `p=reject`.** Going straight
to `reject` is how a new domain silently bins its own invoices. Put the follow-up in `STATE.md` with
a date, or it will not happen.

**Then make him send one real test:** from an outside address to `lucian@`, and a reply back. One
round trip proves both directions before the address goes on a public website.

### 5.4 Then verify it yourself — this is the part that makes you a reviewer

**Do not ask the owner whether the site looks right. Fetch it.**

1. `WebFetch` all six URLs. Every one must return content, not a redirect loop and not a 404.
2. Confirm each page's `<title>` differs and matches the route.
3. Confirm `https://www.lumittechnology.com/` lands on the apex.
4. Confirm `http://lumittechnology.com/` upgrades to HTTPS.
5. Fetch `/sitemap.xml` and `/robots.txt` and confirm both parse and list the six real URLs.
6. Request a URL that does not exist and confirm the 404 behaviour is the `.htaccess` one.

**A page that fetches and renders is evidence. A screenshot the owner pasted is a report.** The
difference is the whole reason this role is separate from his.

### 5.5 Then write it down

A short record at `docs/decision/decision_<yyyymmdd>_site_live.md`: the date it went live, the URLs
that verified, the certificate status, whether `www` resolved, and whether the DMARC record landed.
Two hundred words. **A deployment nobody wrote down is a deployment nobody can audit when it
breaks.**

---

## 6. If it goes wrong — the four failures worth predicting

| symptom | almost certainly |
|---|---|
| Browser security warning on every page | `.htaccess` uploaded before AutoSSL issued. Run AutoSSL; nothing needs re-uploading. |
| `/` works, `/services/` 404s | `.htaccess` missing, or the folders were flattened during extraction. Check for `services/index.html`, not `services.html`. |
| Site loads but has no styling | `styles.css` not at the root of `public_html`, or extracted one directory too deep. Every page links `/styles.css` absolutely. |
| The logo is a broken image | `assets/lumit-mark.svg` missing. It is also the favicon, so the tab icon will be blank too. |

**If two of those are true at once, the zip was extracted into a subdirectory.** Look for
`public_html/lumit-site/index.html` before you debug anything else.

---

## 7. Findings carried in

1. **`device_bash` is dead. 8 September 2026 Windows update.** No shell on the owner's machine.
2. **Certificate before files, every time.** A forced-HTTPS `.htaccess` on a domain with no
   certificate is indistinguishable from a broken site.
3. **`.htaccess` is invisible in cPanel File Manager by default.** Its absence fails silently and
   partially, which is worse than failing loudly.
4. **The owner reads decisions, not essays.** Four or five lines per block; every sequence ends with
   a verification step. He skips steps in long ones — this is documented, not a guess.
5. **Verify from outside.** You have `WebFetch`. Use it rather than asking him to look.
6. **A deployment is not done when the files are up.** It is done when the certificate is valid, the
   redirects behave, the mail records are in and somebody wrote down that all of that was true.

---

## 8. Operational notes

- **Machine:** Windows, PowerShell 5.1. No `&&`. Always `-m` inline. `git --no-pager diff`.
- **`setup/OPERATOR.md`**, one level up at `D:\dev\projects\setup\`, is binding on tone, command
  style and approvals.
- **The owner is not a developer.** Plain language for anything he approves. He holds final
  authority and he is the only one who spends money or clicks a control panel.
- **Do not put credentials anywhere.** Not in a file, not in a contract, not in this repository, not
  in the chat. If a step needs a password, the owner types it.
- `lumit_webapp` at `D:\dev\projects\lumit_webapp` is a different project with heavier governance.
  **Do not edit it from this session.** If something here has consequences there — and the retirement
  of its `apps/public-web` does — raise it once and leave it to him.

---

## 9. What to do first

1. `device_request_folder_access` on `D:\dev\projects\lumit_website`. First tool call.
2. `device_list_dir` recursive. Confirm the ten byte counts in §2.3 are unchanged.
3. `WebFetch https://lumittechnology.com` — **before you instruct anything.** The owner may already
   have uploaded it. If it is live, your job is §5.4 and §5.5, not §5.1.
4. **Then stop.** Restate in three or four lines where you believe things stand, put D-LWS-004 and
   the two missing facts to him in one block, and wait for confirmation before issuing steps.
