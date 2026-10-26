# Security and privacy

## Controls in this starter

- Google Identity Services ID tokens are sent with authenticated actions and checked server-side using Google's tokeninfo endpoint. The backend verifies token audience against `OAUTH_CLIENT_ID` and requires `email_verified`.
- Report creation and claim submission require a valid token. Claim review and return confirmation independently verify account authorization in the Apps Script backend.
- Private claim clues are not included in the public report endpoint. Only the claimant, the report owner, and allowlisted staff can read applicable claim data through Recovery Center.
- All user text inserted into the public listing UI is escaped before HTML rendering. Form inputs are length-limited in both browser and server.
- Staff authority comes from the Apps Script `STAFF_EMAILS` Script Property, never a browser role value.
- Return completion requires an approved claim and confirmation by the claimant plus finder/report owner or authorized staff.

## Risks and remaining work

This is not production-ready. Tokeninfo is a simple validation path and depends on a Google network call per request. Add robust rate limits, replay/abuse monitoring, spreadsheet locking/concurrency control, structured audit events, data retention/deletion policies, backups, CSP and deployment hardening before a real campus pilot. `AuditLog` is provisioned but not yet populated. There is no photo upload, direct messaging, block/report-user moderation, email/push delivery, or staff-wide review console. The return reference is a unique text reference, not a QR image.

Google Sheets is not an authorization layer. The sheet must remain private and all access must pass through Apps Script. Apps Script deployment identity and audience settings matter; review them before deployment. A public Apps Script URL is not a secret. The implementation checks identity and object-level permissions, but should receive a security review before handling real claimant details. Browser CORS/redirect behavior also needs live-origin validation.

Collect only information needed to distinguish an item. Do not ask for passwords, account recovery answers, student IDs, exact addresses, or payment. Never display a claimant's private clues in a public listing.
