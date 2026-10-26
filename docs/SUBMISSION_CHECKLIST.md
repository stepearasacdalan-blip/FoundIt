# Final submission checklist review

Review date: 26 October 2026. Status describes repository evidence and the user-reported walkthrough; do not treat unverified steps as passed.

| Rubric item | Status | What we know / next action |
|---|---|---|
| Completed website opens and main links work on GitHub | Partial | GitHub Pages workflow succeeded and user confirmed publishing. User screenshots show the site. Perform a final live click-through of Browse, Report, Recovery Center, and Privacy before presenting. |
| Clear topic and audience | Met | Campus lost-and-found for students and campus staff is clearly described in the home page and README. |
| Required pages and functional requirements | Partial | Public reports, sign-in, report submission, and claim submission are user-reported working. SmartMatch, watchlist, claim review and two-party return should be walked through in the current deployed version. |
| HTML/CSS/JavaScript organized | Met | Page files, styles, scripts, backend, images, and docs are separated in folders. |
| Sitemap and wireframes/design documentation | Included locally | See `SITEMAP_AND_WIREFRAMES.md`. |
| Labeled actual screenshots including responsive view | Missing | Capture the running published site at desktop and mobile widths; label them clearly. Do not submit the reference mockup as a website screenshot. |
| Testing table with actual results | Included, with limits | `TESTING.md` marks user-reported checks separately from source review. Add observed mobile, watchlist, and return results after trying them. |
| Relevant code snippets explained | Included locally | See `CODE_SNIPPETS.md`; examples are tied to backend source functions. |
| References and external asset sources | Included, attribution needs confirmation | See `ASSET_SOURCES.md`. Confirm who created/provided the campus image and add its source/license if externally obtained. |
| No passwords, API keys, or private information exposed | No secret found in reviewed public config | OAuth client ID and Apps Script URL are public configuration, not secrets. Keep client secrets and private sheet/claim data out of GitHub. |
| PT documentation proofread and ready | Partial until replacement uploaded | Corrected README and docs are in this local package. GitHub's live README and some docs were previously incorrect; upload the docs fix before submitting. |
| Prepared to demonstrate and explain design/code | Partial | Use the demo outline below and be honest about which flows were tested. |

## Simple demo outline

1. Open the GitHub Pages site and show Browse and the report cards.
2. Sign in, submit a sample lost report, and show it in the public list.
3. Show a SmartMatch suggestion and explain the visible matching reasons; say it is only a clue.
4. Submit a claim using a harmless test item and show the private claim status in Recovery Center.
5. If two authorized test accounts are available, demonstrate review and both SafeReturn confirmations. Do not claim a return happened unless the app records it.
6. Show responsive layout and dark mode, then describe the Google Apps Script + private spreadsheet backend.

For a class demonstration, use test data and avoid real sensitive identifying details.
