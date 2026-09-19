# Note — 2026-09-19 — Windows line endings would have broken every byte count in this repository

**Found:** in the output of the very first `git add -A`, moments after `git init`.
**Fixed:** `.gitattributes`, added as the second commit.

---

## What happened

`git add -A` printed the same warning thirty-seven times:

```
warning: in the working copy of 'contact/index.html', LF will be replaced by CRLF
the next time Git touches it
```

Every file. The six pages, `styles.css`, `sitemap.xml`, `.htaccess`, `assets/lumit-mark.svg`, the
checker, and all the records. `core.autocrlf` is set to `true` globally on this machine, which is the
usual Windows default and is normally harmless.

## Why it is not harmless here

**Byte counts are the scope-proof mechanism in this project.** The planner has no shell on the
machine — `device_bash` has been dead since the 8 September 2026 Windows update — so it proves what a
coder changed by comparing a recursive directory listing of sizes and mtimes taken before the
contract against one taken after. Every contract freezes eleven byte counts in its §7 and calls any
difference a defect.

A CRLF conversion adds one byte per line. `contact/index.html` has 99 lines, so it would become
roughly 5,271 bytes rather than 5,173. **Every baseline in every record would be wrong at once**, and
wrong in a way that looks exactly like a coder having edited the site.

The conversion had not happened yet. Git stores LF in the repository and converts on checkout, so the
blobs on GitHub are correct and the working tree was still LF at the time of the first commit. It
would have struck on the next checkout, branch switch, stash or reset — that is, at the start of
`LWS-P1A-002`, and it would have been diagnosed as a scope breach.

## The fix

`.gitattributes` pins the working tree to LF: `* text=auto eol=lf`, plus explicit entries for every
extension whose byte count appears in a record. Because the files are already LF on disk and LF in
the repository, adding it changes nothing today — which is exactly why it was worth doing before
anything else touched the tree, rather than after.

Recorded as **RULE 004**.

## The finding worth carrying

**A measurement discipline has dependencies of its own, and they are invisible until they move.**
Byte counts were chosen as the proof mechanism precisely because they cannot be argued with. That
holds only while nothing in the toolchain rewrites files behind the measurement. Nobody planned for
the version control system to be the thing that moved them.

Worth asking of any repository in this estate that proves scope the same way: is `.gitattributes`
there, and does it say `eol=lf`?
