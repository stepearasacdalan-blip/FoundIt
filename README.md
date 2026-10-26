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

Keep `index.html`, `privacy.html`, and the `assets` folder together at the root of the GitHub Pages publishing source. The CSS and JavaScript must remain at `assets/css/style.css` and `assets/js/app.js`.

## Configure before publishing

In `assets/js/app.js`, near the top, fill in the public configuration values:

```js
const PUBLISHED_CONFIG = {
  apiUrl: "YOUR FULL APPS SCRIPT WEB APP URL ENDING IN /exec",
  oauthClientId: "YOUR GOOGLE OAUTH CLIENT ID ENDING IN .apps.googleusercontent.com",
};
```

These values are public browser configuration, not secrets. Never add a client secret or private verification information here. After valid values are set, the Presenter setup panel is hidden. Add `?setup=1` to the site URL to show the panel again.

The Google OAuth client must allow the GitHub Pages origin, for example `https://your-account.github.io` (origin only; do not include the repository path). Keep the Google spreadsheet private. Each visitor still signs in with their own Google account.

## Apps Script and spreadsheet

1. Copy `backend/Code.gs` into the Apps Script project and save.
2. Run `setupSheets` once to create or extend the sheet headers.
3. Deploy a new web-app version and use its full `/exec` URL in `PUBLISHED_CONFIG`.

The project uses Google Sheets as a starter database. Watchlist alerts are shown inside the Recovery Center; email and push notifications are not configured.

## Run locally

Open the project folder in VS Code and use Live Server to serve `index.html`. Google sign-in requires a localhost or HTTPS origin that is also registered in the OAuth client.

## Limitations

This is a class-project starter, not a production campus service. Photo matching estimates a broad color family; it does not recognize the object. SmartMatch results can be wrong and do not prove ownership. Review Apps Script permissions, quotas, privacy, and abuse protections before any real campus pilot.
