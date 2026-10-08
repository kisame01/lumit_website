# Lumit Cloud Technology Consulting — public website

The marketing site for Lumit, at **https://lumittechnology.com**.

Six pages of static HTML and one stylesheet. No framework, no build step, no JavaScript required to
read any page, no database, no forms, no analytics, no cookies.

```
/                 index.html
/services/        services/index.html
/how-we-work/     how-we-work/index.html
/engagements/     engagements/index.html
/about/           about/index.html
/contact/         contact/index.html
```

Plus `styles.css` (shared by all six), `assets/lumit-mark.svg` (the mark, and the favicon),
`robots.txt`, `sitemap.xml` and an Apache `.htaccess`.

## The HTML is the source

There is no generator. Content changes are made by **editing the six `index.html` files directly**.
See `docs/decision/decision_20260919_source_of_truth_and_first_commit.md` for why.

The six pages each carry their own copy of the masthead, closing block and footer. **Change one,
change all six** — the gate enforces that they stay byte-identical.

## Running the gate

```
node scripts/check_site.mjs
```

Or `npm run gates`. Zero dependencies — `node` and nothing else. **Do not run `npm install`;** there
is nothing to install and this repository has no lockfile by design.

It fails the build on a dead internal link (B-001), a page missing its `<h1>`, `<title>`, description
or correct canonical (B-002), a sitemap that disagrees with the pages on disk (B-003), shared chrome
that has drifted apart (B-004) or appears other than once (B-005), a broken masthead toggle (B-006),
unbalanced tags (B-007), and a `.cpanel.yml` that would not deploy exactly the site (B-008).

## Deploying

**By cPanel Git™ Version Control, pull deployment.** First used 2026-10-08. cPanel holds a clone of
this public repository at `repositories/lumit_website` — **outside `public_html`** — and
`.cpanel.yml` copies the site files into `public_html` by name. No credential is stored anywhere.

1. `node scripts/check_site.mjs` is green.
2. Commit, merge to `main`, `git push origin main`.
3. cPanel → **Git™ Version Control** → **Manage** → **Pull or Deploy** → **Update from Remote**, then
   **Deploy HEAD Commit**. Check the SHA shown is the one you pushed.
4. Verify from outside: every file the commit changed shows a new `Last-Modified`.

**Rules that keep it working:**

- **A new site file must be added to `.cpanel.yml`**, or it does not deploy. B-008 fails the gate
  until it is — for files the pages reference. **It does not yet see files referenced only from
  `styles.css` by `url()`**; see `docs/review/review_20261008_lws_p1a_006_b008.md` §5.
- **Never edit files inside the cPanel clone.** A dirty working tree blocks deployment.
- **Never force-push `main`.** Update from Remote is fast-forward only.
- cPanel shows "must enable shell access to allow you to view clone URLs". **That is expected and
  harmless** — it hides the server clone's own URL; cloning from GitHub and deploying both work
  without shell access.

**Fallback:** cPanel File Manager upload to `public_html`. `.htaccess` is a dotfile and File Manager
hides it by default — Settings → Show Hidden Files. Without it the HTTPS redirect, the `www`
canonicalisation, the security headers and the 404 page all silently do not exist.

## Layout

`docs/` uses `lower_snake_case` throughout; `docs/naming_convention.md` is the rule.
Root files keep their SCREAMING_CASE names.
