# Setup guide

1. Create a private Google Sheet for FoundIt. Do not share it publicly.
2. Create a Google Cloud OAuth 2.0 **Web application** client ID. Add the exact development and production website origins under Authorized JavaScript origins. Do not create or publish a client secret for this browser sign-in flow.
3. In Apps Script, create a project and paste `backend/Code.gs` into `Code.gs`.
4. In Apps Script project settings, add Script Properties: `SPREADSHEET_ID` (the spreadsheet ID) and `OAUTH_CLIENT_ID` (the same public OAuth client ID). Optionally set `STAFF_EMAILS` to comma-separated, lowercase staff email addresses. Do not put staff addresses in frontend code.
5. Run `setupSheets` from the Apps Script editor while signed in as the spreadsheet owner. Review requested Google permissions.
6. Deploy as a Web App. Select the script owner as execution identity. Set access to the broadest audience needed for guests to browse (normally anyone); application mutations still require a server-verified Google identity token and action-level checks. Confirm current Google account/deployment policies before use.
7. Copy the deployed `/exec` URL. Serve this folder from the intended website origin. Select **Sign in**, enter the Apps Script URL and OAuth client ID in the setup area, then save. Values are stored only in that browser's local storage. A public OAuth client ID and web app URL are not secrets.
8. Verify from the actual site origin that list, report, claim, reviewer, watchlist, and return requests work. If CORS/redirect blocks fetch, use an authenticated CORS-capable proxy; do not disable browser security.
9. Add a report using a test Google account, claim it using a second account, review with the first account or allowlisted staff, then confirm the return separately from each account. Remove test records before a real pilot.

The frontend currently expects an API response readable by browser `fetch`. Apps Script web app redirects/CORS may make direct browser access unreliable. That must be validated during deployment; this source has no working cloud configuration yet.
