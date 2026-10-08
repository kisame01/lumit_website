# Decision — deploy by cPanel Git, and the scope of the restyle

**Decided by the owner, 2026-10-08.** Recorded by the Opus 5.5 planner context that wrote the
LWS-P1A-006 contract. Two decisions in one record because they were taken in the same conversation
and the second depends on the first.

---

## 1. D-LWS-007 — closed: deploy through cPanel Git™ Version Control

**Decision.** The site deploys by **pull deployment** from cPanel's Git™ Version Control. cPanel clones
the public repository `https://github.com/kisame01/lumit_website.git` over HTTPS; the owner clicks
**Update from Remote**, then **Deploy HEAD Commit**; a `.cpanel.yml` at the repository root copies the
site files into `public_html` by name.

**No credential is stored anywhere.** The repository is public, and cPanel's documentation states that
a clone URL "cannot contain a username-and-password pair". There is no token in GitHub, no key on the
server, nothing in a chat, a file or a contract. That is why this route was acceptable when the three
routes previously on the table in `OPEN_DECISIONS.md` — all of which needed a secret stored somewhere —
were not yet worth it.

**Why the earlier "not yet" changed.** It said: revisit after the next upload, with evidence about how
often the site actually changes. The evidence:

- **Three uploads on 2026-09-19 alone**, and **one of them half-landed** — five pages updated, three
  files did not, and the live site served new HTML against an old stylesheet until it was caught from
  outside by `Last-Modified`.
- A restyle and a font change are both now planned, which is two more multi-file uploads.
- A route exists that needs no secret at all. It was not in the original table.

**Constraints that come with it — each is load-bearing:**

1. **The repository path is outside `public_html`** — `repositories/lumit_website`. Cloning into the
   web root would publish `docs/`, `scripts/` and every record in this repository.
2. **`.cpanel.yml` names every file it copies.** No wildcards, no recursive copy, no `rm`. This is what
   keeps the records off the public web.
3. **B-008 proves `.cpanel.yml` matches the site** — nothing missing, nothing extra. A file the site
   uses but the manifest omits would silently not deploy, which is the half-landed upload again by a
   different route. `LWS-P1A-006`.
4. **Never force-push `main`.** cPanel's Update from Remote is fast-forward only and fails on a
   rewritten history. Branch protection — block force pushes and deletions — **stops being hygiene
   and becomes part of the deploy path.**
5. **Never edit files inside the cPanel clone.** cPanel cannot deploy from a dirty working tree.
6. **File Manager remains the fallback**, and `README.md`'s deploy section is rewritten only after the
   first git deploy has been verified from outside.
7. **`$HOME` in `.cpanel.yml`, not the username**, because the repository is public. If Elitehost does
   not set `$HOME` during a deploy, the copy fails and the live site does not change. Hard-coding the
   home path is the owner's fallback, not an agent's.

**The planner emulated a deploy before recommending it**: the eleven site files landed byte-identical,
an existing `php.ini` survived, and `docs/`, `scripts/`, `STATE.md`, `.git` and `.cpanel.yml` stayed
out. That was an emulation, not Elitehost; the first real deploy is verified from outside.

## 2. D-LWS-010 — the restyle: what it is, and what it is not

**The owner asked for** proper styling and icons, following a redesigned page, in a separate CSS file,
responsive on mobile and desktop, with the text unchanged. The reference is
`docs/reference/redesign_20261008.html` (24,983 bytes).

**What the reference is.** A **single-page mockup of the homepage** with its own styles inline, an
inline SVG icon sprite, and a light-only palette. It is a strong visual direction — card layouts,
icon tiles, effort pills on the disposition matrix, a navy closing band — and **almost all of its
body text is the live homepage's text**.

**Settled by the owner, 2026-10-08:**

| question | decision |
|---|---|
| Logo | **Keep the real mark**, `assets/lumit-mark.svg`. The reference redraws it inline, and its `L` uses the same navy that was invisible in dark mode before LWS-P1A-003 fixed it. The mark is also the favicon. |
| Dark mode | **Keep it.** The new palette gets a dark variant the way the current stylesheet already does. The reference is light-only. |
| Text | **The live site's text wins** — `<title>`, meta description and `enquiries@lumittechnology.com` everywhere. **One wording change is adopted:** the closing block's em-dash becomes a comma ("…existing environment, we can turn…"), on all six pages identically. That was an open item from the LWS-P1A-005 review and the reference resolves it. |

**Settled by the planner, as interpretation of the request — any can be overruled by the owner:**

- **The six-page structure stays.** The reference's nav — Approach, Method, Services, Why Lumit — is
  in-page anchors for a single page. The live site has six routes, a sitemap and a gate that checks
  every link. **The restyle changes how the site looks, not how it is organised.**
- **Styles live in `styles.css`.** No `style="…"` attributes in the six pages; the reference has
  several and they become classes.
- **Icons are inline-SVG symbols with no library and no CDN.** The reference already does this; it
  keeps RULE 001 intact. Whether the sprite is one shared file or inline per page is for the
  restyle contract.
- **Self-hosting the fonts stays a separate task** (D-LWS-005). The reference still loads Google
  Fonts, exactly as the live site does. With git deployment a separate task costs nothing extra.

## 3. What the reference gets wrong, measured — so the contract does not copy it

| # | finding | evidence |
|---|---|---|
| 1 | **The closing button emails `hello@lumittechnology.com`**, which does not exist. Live is `enquiries@` and the live closing button links to `/contact/`. | text diff against the live homepage |
| 2 | **With JavaScript off, a phone gets no navigation at all.** `nav{display:none}` below 720px is unconditional. LWS-P1A-003's Constraint 2 exists to prevent exactly this. | reference CSS line 122 |
| 3 | **The menu script sits outside `<header>`**, so B-004 would not gate it. The live toggle's script is inside the masthead deliberately. | reference lines 312–319 |
| 4 | **The keyboard focus ring is cyan `#19C2F0` on a near-white page: 1.99:1.** WCAG asks 3:1 for a focus indicator. The live site uses its accent blue. | computed |
| 5 | **White icons on the service tiles fall to 2.10:1** at the cyan end of the gradient. | computed, 3:1 needed |
| 6 | Breakpoint **720px**; the live toggle is measured and verified at **767.98px**. | reference line 120 |
| 7 | Inline `style` attributes, a redrawn logo, no dark mode, Google Fonts — covered in §2. | — |

**Every text-on-background pair in the reference passes WCAG AA**, the tightest being muted grey on
the table header at 4.52:1. The effort pills, the navy band and the footer are all comfortably over.

**Fourteen text segments differ from the live homepage.** Apart from the items above, they are the
tab title and description (live wins), the nav labels (six-page nav wins), capitalisation that CSS
`text-transform` reproduces without changing the text, and two headings where the reference merges
the live page's gutter labels — "Six options per workload", "Six areas" — into the heading. **The
live headings and labels stay; the restyle decides how the labels look.**

## 4. Sequence

1. **`LWS-P1A-006`** — `.cpanel.yml` and B-008. Contract written, issued to Cursor Grok 4.7 High.
2. **First git deploy** — byte-identical files, every `Last-Modified` moves. The pipeline is proven on
   a change that cannot break anything.
3. **`LWS-P1A-007`** — the restyle, deployed through the proven pipeline.
4. **`LWS-P1A-008`** — self-hosted fonts, D-LWS-005.
