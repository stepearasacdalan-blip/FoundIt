# References and asset sources

## Project-authored assets

- `assets/images/campus-header.png` — campus banner image supplied/selected by the project author. Record the original photographer, source URL, and usage permission here if it was obtained from an external source. Do not claim a license that has not been checked.
- Report photos — uploaded by users when submitting reports. They are application data, not bundled stock imagery. Use only photos appropriate for public display and avoid faces or sensitive identifying details.
- FoundIt logo, interface illustrations, CSS, HTML, and JavaScript — project files maintained in this repository.

## External services and references

- Google Identity Services — used for Google account sign-in in the browser. The OAuth client ID is public client configuration; never publish a client secret.
- Google Apps Script web app and Google Sheets — backend endpoint and starter data store. Keep the spreadsheet private; access should go through backend authorization.
- Google OAuth tokeninfo endpoint — backend checks the submitted identity token and expected audience.

No external CSS framework, icon package, or stock-photo library is intentionally bundled. If you add one, list its name, source link, version, and license here.

## Data and privacy notes

The Apps Script URL and OAuth client ID are visible in browser code by design and are not passwords. Do not commit OAuth client secrets, private verification clues, personal access tokens, or a publicly shared spreadsheet link.
