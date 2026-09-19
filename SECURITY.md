# Security

## What this site collects

**Nothing.** No forms, no cookies, no analytics, no third-party script, no database, no server-side
code. The contact page says so to visitors in writing, and that sentence is a constraint on this
repository, not marketing copy: anything that would falsify it needs the owner's decision, not a
judgement call in a pull request.

One qualification, recorded honestly: every page loads a webfont stylesheet from
`fonts.googleapis.com`, so a visitor's IP address reaches Google on each page load. Self-hosting the
two families closes it. Tracked in `OPEN_DECISIONS.md`.

## Headers

Set by `.htaccess`: HTTPS forced on every request, `www` → apex 301, `X-Content-Type-Options: nosniff`,
`Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: SAMEORIGIN`.

## Credentials

**None belong in this repository — not in a file, not in a contract, not in a workflow.** Deployment
is a manual cPanel upload precisely so that no FTP credential has to exist as a repository secret.

## Reporting something

Email `lucian@lumittechnology.com`.
