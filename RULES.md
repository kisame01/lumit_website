# Rules

Three, and they are all true of this repository. A rule that is not enforced or not honoured is worse
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
