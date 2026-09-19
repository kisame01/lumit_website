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
or correct canonical (B-002), a sitemap that disagrees with the pages on disk (B-003), and shared
chrome that has drifted apart (B-004).

## Deploying

Manual, by cPanel File Manager upload to `public_html` on Elitehost. Two things that bite:

1. **Run AutoSSL before uploading.** `.htaccess` forces HTTPS, so files landing before the
   certificate exists give every visitor a security warning.
2. **`.htaccess` is a dotfile** and File Manager hides it by default. Settings → Show Hidden Files,
   and confirm it is there. Without it the HTTPS redirect, the `www` canonicalisation, the security
   headers and the 404 page all silently do not exist.

## Layout

`docs/` uses `lower_snake_case` throughout; `docs/naming_convention.md` is the rule.
Root files keep their SCREAMING_CASE names.
