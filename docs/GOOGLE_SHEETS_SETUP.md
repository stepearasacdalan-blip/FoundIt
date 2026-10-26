# Google Sheets setup and schema

Create a new private spreadsheet. In Apps Script, set `SPREADSHEET_ID`, then run `setupSheets`; it creates these tabs and header rows. Do not publish or share the spreadsheet with site visitors.

| Tab | Fields | Purpose |
|---|---|---|
| Reports | id, type, title, category, description, color, approxDate, location, ownerEmail, status, createdAt, imageData, imageColor | Public reports plus private owner identity. Public responses remove `ownerEmail`; `imageData` and `imageColor` are returned for public item photos. |
| Claims | id, itemId, itemTitle, claimantEmail, privateClues, message, status, reviewerEmail, reviewNote, returnRef, claimantConfirmed, finderConfirmed, createdAt, updatedAt | Private ownership proof and authorized review / return workflow. |
| Watchlist | id, userEmail, itemId, createdAt | A user's saved lost report. |
| Notifications | id, userEmail, type, title, body, itemId, read, createdAt | In-app notifications; no email/push provider is included. |
| AuditLog | id, actorEmail, action, targetId, details, createdAt | Reserved schema; this starter does not yet write audit events. |

The setup uses one row per record, with the first row as the exact field names. Keep the spreadsheet private. Back it up before schema changes. This case-study store only has a small header-extension step, not a general migration or transaction framework and is not suitable for high-volume production.

## Updating an existing FoundIt spreadsheet for photos

If you are updating an already-configured project, replace its Apps Script code with the new `backend/Code.gs`, save, then run `setupSheets` once from the Apps Script editor. It appends the new `imageData` and `imageColor` headers to Reports and keeps existing rows. After that, create a new deployment version (Deploy → Manage deployments → Edit → New version → Deploy). Use the same web app URL in FoundIt. Report photos are resized by the browser and stored in the private spreadsheet, but the photo itself is returned as public listing data. Do not upload identifying or sensitive pictures.

