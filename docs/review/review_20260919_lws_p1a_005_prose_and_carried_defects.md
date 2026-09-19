# Review — LWS-P1A-005: the prose pass, the shared enquiries address, and two carried defects

**Verdict: APPROVE.** Reviewed 2026-09-19 by the Opus 5 planner context that wrote the contract.

**Nothing here is taken from the implementer's report.** The tree was staged into the reviewer's
container and `node scripts/check_site.mjs` was run there. All five contract mutations were
reproduced independently, every changed line was diffed against the pre-task baseline, and the whole
§6 measurement grid was re-measured by a **different method** from the implementer's — Playwright with
`javaScriptEnabled: false` rather than a sandboxed iframe. Container Node is v22.22.2; the implementer
ran v24.14.1.

---

## 1. Scope — seven files, and every changed line accounted for

| file | baseline | final | delta |
|---|---|---|---|
| `index.html` | 12,862 | **12,860** | −2 |
| `about/index.html` | 6,953 | **6,962** | +9 |
| `contact/index.html` | 5,784 | **5,646** | −138 |
| `engagements/index.html` | 6,399 | **6,408** | +9 |
| `how-we-work/index.html` | 7,046 | **7,001** | −45 |
| `services/index.html` | 17,050 | **17,040** | −10 |
| `styles.css` | 12,636 | **12,667** | +31 |

`.htaccess` 796, `robots.txt` 73, `sitemap.xml` 649, `assets/lumit-mark.svg` 24,646,
`scripts/check_site.mjs` 10,034, `package.json` 132, `.gitattributes` 902 — **all unchanged.** No CRLF
anywhere. RULE 004 intact. Every one of the fourteen numbers matches the implementer's table.

**Phase 3's `styles.css` is exactly +31**, the number the contract predicted from the reviewer's own
render test. **Phase 4 is +12 on every HTML file**, and the arithmetic checks out: `?v=2` is four
characters, and there are three references per page.

### 1.1 Every changed line, diffed against the baseline

The reviewer diffed all six pages line by line. **There are no changes outside the four phases.**
Per page: the icon `<link>`, the stylesheet `<link>`, the masthead `<img src>`, and between one and
four prose lines. `contact/index.html` additionally carries the collapsed contact row.

**Phase 4 coverage is complete.** All three references are versioned on all six pages:

```
line 15   <link rel="icon" href="/assets/lumit-mark.svg?v=2" …>
line 19   <link rel="stylesheet" href="/styles.css?v=2">
line 25   <img src="/assets/lumit-mark.svg?v=2" …>      <- inside the gated masthead
```

Nothing was missed, which was the real risk — a single unversioned reference would have left the
stale-cache defect half-fixed and invisible.

## 2. The chrome — the thing most likely to have gone wrong, and it did not

**The closing block and the footer are byte-identical to the pre-task baseline on all six pages.**
The reviewer extracted each block and compared. The prose pass stayed out of the chrome entirely,
which is what §3 asked for.

**All six mastheads are identical to each other**, raw 1,325 and 1,305 after stripping
`aria-current="page"`, same SHA-256 on all six. Against the baseline the masthead moved by exactly
**+4 bytes** and the diff is one line — the `?v=2` on the mark's `src`. Nothing else in the gated
block changed.

**Every page keeps exactly one `<h1>`, `<title>`, meta description and canonical.** B-002 intact —
this was the likeliest accidental casualty of a prose pass and it survived.

**The internal link count is 68**, unchanged, as predicted: collapsing two contact rows into one
removes a `mailto:`, which is not an internal link.

**Tag balance checked well beyond B-007's four names.** Phase 2 restructured a `<div>`, and B-007 only
counts `header`, `section`, `footer` and `script` — so the reviewer counted `div`, `span`, `a`, `p`,
`td`, `tr`, `table`, `nav`, `button`, `main`, `ul`, `li`, `h1`, `h2` and `h3` as well. **All balanced
on all six pages.** The collapsed row is well-formed:

```html
<div class="cline"><span class="k">Enquiries</span><span class="v"><a href="mailto:enquiries@lumittechnology.com">enquiries@lumittechnology.com</a></span></div>
```

It sits above the existing "Based in" and "Serving" rows and reads consistently with them.

## 3. Clean run — reproduced, not accepted

```
site check: 6 pages | 68 internal links | 6 assets
site check ok
```

Exit 0. Zero violations across B-001 to B-007.

## 4. The five mutations — all five reproduced exactly

| # | result | exit |
|---|---|---|
| M1 `about/` masthead `?v=2` → `?v=3` | `about/index.html:22  B-004 header differs from index.html` | 1 |
| M2 one word in `services/`'s footer | `services/index.html:169  B-004 footer differs from index.html` | 1 |
| M3 `contact/` stylesheet → `/styles-x.css?v=2` | `contact/index.html:19  B-001 /styles-x.css?v=2 does not resolve`. **B-004 stayed green** | 1 |
| M4 `</script>` removed from all six | six `B-007 <script> has 1 start and 0 end tags`, line 39 | 1 |
| M5 closing block duplicated in `engagements/` | `engagements/index.html:106  B-005 closing block occurs 2 times`. **B-004 did not also fire** | 1 |

Same line numbers, same byte counts, and M5's banner rising to 69 internal links and back to 68 on
restore. Every file restored to its exact pre-mutation count; the clean run re-confirmed after all
five.

**M1 lands, so Phase 4's masthead edit really is inside the gated block.** **M3 confirms the versioned
URL is genuinely resolved rather than skipped** — a broken one reports, and B-004 correctly stays
green because the `<link>` is in `<head>`, outside the chrome. **M4 is the LWS-P1A-004 regression
guard and it holds.**

## 5. The measurements — re-measured by a different method, and they agree

The implementer used a sandboxed same-origin iframe without `allow-scripts`, having found that
script-disable did not survive navigation in its environment. The reviewer used Playwright contexts
with `javaScriptEnabled: false`. **Two different mechanisms, identical numbers** — which is the best
available evidence that neither method introduced an artefact.

**Zero horizontal overflow in every cell**, and zero elements past the edge outside `.matrix-scroll`.
All six routes agree exactly at every width and state.

| state | 320 | 375 | 767 | 768 | 1100 |
|---|---|---|---|---|---|
| **no JS** | 203.3 | **203.3** | 132.8 | 105.8 | 73.4 |
| **JS, closed** | 61 | **61** | 61 | 105.8 | 73.4 |
| **JS, open** | 351.7 | **351.7** | 369.7 | — | — |

Six nav links visible in every no-JS cell and in every open cell.

**Phase 3 did what it was for.** The no-JS masthead at 375 was **421px wide with 46px of overflow**
before this task; it is now **375px wide with none**, and 64px shorter. The enhanced states are
untouched at 61px closed and 351.7px open, so the fix cost nothing.

The no-JS masthead at 767 is 132.8px — two wrapped rows. That is the wrap working, not a defect, and
the implementer called it correctly.

## 6. The prose pass

Fifteen changes across six files, reported before they were made, as RULE 002 requires. Eleven are
em-dashes used as a pause, replaced with a comma or a colon depending on whether the clause continues
or introduces. Four cut something: an empty "practical", a pair of empty intensifiers, and
`how-we-work/`'s opener.

**No technical claim, number or proper noun was altered.** The reviewer checked every changed line
against its original.

The implementer also listed what it deliberately left: the About capability cards, "almost always" on
two pages, "roughly" on the contact page — each because the underlying fact is genuinely soft.
**Leaving a vague sentence vague is the correct call**; the alternative is inventing a sharper claim
than the business made, which §2.1 forbade and which is the failure mode of this kind of pass.

One editorial note, for the owner rather than the implementer. `how-we-work/`'s lede went from
"A structured, outcome-led approach that stays flexible enough to fit existing delivery models,
governance frameworks and internal capabilities" to "**The approach fits existing delivery models,
governance frameworks and internal capabilities**". It drops claims rather than adding any, which is
the safe direction, but it now opens the page's first paragraph with "The approach" before the
approach has been described. Worth a look next time the page is open. Not a defect and not worth a
task of its own.

## 7. The finding — the most visible em-dash on the site is still there

35 em-dashes remain. Most are correct and should stay: the `<title>` and `og:title` separators, the
brand `aria-label`, and the gutter labels (`01 — Position`, `02 — Method`), which are design elements
rather than prose.

**One is neither.** In the shared closing block, on **all six pages**:

> "…better performance from your existing environment **—** we can turn the challenge into a practical
> roadmap"

That is an em-dash used exactly as a pause, in the closing call to action, which is the last thing
every visitor reads on every page. **It is the single most-seen instance on the site and the pass did
not touch it**, because §3 told the implementer the easiest safe answer was to leave the chrome prose
alone. The implementer followed the contract. **The contract was over-cautious.**

It is fixable: change it identically on all six pages and **B-004 verifies the identity for free** —
that is the whole point of the chrome gate. It is a candidate for `LWS-P1A-006` alongside the fonts,
or for the owner to wave through as fine as it is. **Recorded rather than fixed here**, because
changing chrome prose is a decision about the site's voice, not a defect.

## 8. Residual risks

1. **Google Fonts is still on every page** — preconnect plus a stylesheet, against a contact page that
   promises no third-party anything. Held to `LWS-P1A-006` by §9 of the contract. **This is now the
   most important open item on the site.**
2. **The closing-block em-dash**, §7 above.
3. **`enquiries@lumittechnology.com` must exist before this uploads.** See §9.
4. The About capability cards remain brochure-vague. Owner's call, not the implementer's.

## 9. Before this ships — the one thing that is not a preference

**The `enquiries@` mailbox has to exist in cPanel, and a test message has to arrive, before these
files go up.** After this upload the contact page offers exactly one way to reach the business, and
`lucian@` and `tumi@` no longer appear anywhere on the site. If the mailbox is not there, every
enquiry bounces and nobody finds out until someone mentions it. D-LWS-009.

Deciding who reads it matters for the same reason and is cheaper to settle now than after the first
missed enquiry.

## 10. Next

- Owner commits on a branch and merges with `--no-ff`. **No agent merges.**
- **This one needs an upload** — eight files changed on the site.
  Create the mailbox, test it, then upload: the six `index.html` files and `styles.css`. The mark is
  unchanged, so it does not need re-uploading; the `?v=2` on its URL is what makes browsers refetch
  the version already on the server. **Check `Last-Modified` on every file afterwards**, because the
  last upload half-landed and looked fine on the pages that landed.
- `LWS-P1A-006` — self-host the webfonts (D-LWS-005), and optionally the closing-block em-dash.
- Still open and unchanged: the `_dmarc` `rua=` edit, and branch protection on `main`.
