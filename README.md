# FoundIt Campus Lost-and-Found

FoundIt is a campus lost-and-found website with a connected recovery process: explainable SmartMatch suggestions, private ClueLock claims, SafeReturn handovers, and an account-based lost-item watchlist.

## Features

- Browse, search, and filter public lost and found reports.
- Submit reports with an optional photo. Photos are public; avoid faces and private identifying details.
- SmartMatch compares category, shared words, color (including a broad color estimate from a photo), general area, and approximate date. A possible match is only a clue, never proof of ownership.
- Submit private claims and follow claim review and return status in the Recovery Center.
- Save your own lost reports to a watchlist and see possible-match notices in the Recovery Center.
- Choose dark mode; the preference is saved across page refreshes.

## Files

- `index.html` and `privacy.html`: website pages.
- `assets/css/style.css`: website design and responsive layout.
- `assets/js/app.js`: website behavior and public configuration.
- `backend/Code.gs`: Google Apps Script API.
- `docs/`: setup, deployment, privacy, testing, and project notes.

## Apps Script and spreadsheet

The project uses Google Sheets as a starter database. Watchlist alerts are shown inside the Recovery Center; email and push notifications are not configured.

## Limitations

This is a class-project starter, not a production campus service. Photo matching estimates a broad color family; it does not recognize the object. SmartMatch results can be wrong and do not prove ownership. Review Apps Script permissions, quotas, privacy, and abuse protections before any real campus pilot.
