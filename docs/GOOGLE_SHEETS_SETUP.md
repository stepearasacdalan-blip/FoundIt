# Google Sheets setup and schema

Create a new private spreadsheet. In Apps Script, set `SPREADSHEET_ID`, then run `setupSheets`; it creates these tabs and header rows. Do not publish or share the spreadsheet with site visitors.

| Tab | Fields | Purpose |
|---|---|---|
| Reports | id, type, title, category, description, color, approxDate, location, ownerEmail, status, createdAt | Public reports plus private owner identity. `ownerEmail` is removed from public responses. |
| Claims | id, itemId, itemTitle, claimantEmail, privateClues, message, status, reviewerEmail, reviewNote, returnRef, claimantConfirmed, finderConfirmed, createdAt, updatedAt | Private ownership proof and authorized review / return workflow. |
| Watchlist | id, userEmail, itemId, createdAt | A user's saved lost report. |
| Notifications | id, userEmail, type, title, body, itemId, read, createdAt | In-app notifications; no email/push provider is included. |
| AuditLog | id, actorEmail, action, targetId, details, createdAt | Reserved schema; this starter does not yet write audit events. |

The setup uses one row per record, with the first row as the exact field names. Keep the spreadsheet private. Back it up before schema changes. This case-study store has no migration or transaction framework and is not suitable for high-volume production.
