# Rules

Four, and they are all true of this repository. A rule that is not enforced or not honoured is worse
than no rule.

## RULE 001 — The site stores nothing about a visitor

No form, no cookie, no analytics, no third-party script, no database. The contact page promises this
in writing. **Anything that would falsify it is the owner's decision.**

## RULE 002 — Never change the site to make a check pass

If `node scripts/check_site.mjs` goes red, either the check is wrong or the site is wrong. Say which.
A gate that was made quiet by editing the thing it measures has measured nothing.

## RULE 003 — Zero dependencies

`package.json` carries no `dependencies` and no `devDependencies` key, and there is no lockfile. One
`npm install` and this repository acquires a supply chain and a review obligation it does not need.
Adding one is a decision, recorded in `docs/decision/`, not a commit.

## RULE 004 — LF line endings, in the repository and in the working tree

Enforced by `.gitattributes`. **Do not override it with `core.autocrlf` for this repository.**

Byte counts are how scope is proved here — the planner has no shell on the machine and reads sizes
and mtimes instead. A tool that silently rewrites every line ending turns every recorded byte count
into a number that no longer describes any file. See
`docs/note/note_20260919_crlf_and_byte_count_discipline.md`.
