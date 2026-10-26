# FoundIt Campus Lost-and-Found

FoundIt is a responsive campus lost-and-found starter project centered on a connected recovery process: SmartMatch, private ClueLock claims, and a two-party SafeReturn handover. Its look takes inspiration from the attached screenshot's welcoming hero and item grid, while using an original maroon-and-coral identity and layout.

## What is implemented

- Guest-facing report browsing, search and combined type/category/location filters.
- Authenticated lost/found reports, with public details separated from claim clues.
- Explainable rule-based possible matches (category, shared words, color, location, and approximate date).
- Claims with backend authorization, private clue review, request-more-info, approve, reject, and escalate states.
- A unique SafeReturn reference after approval; claimant and finder/staff each confirm handover before the report is marked returned.
- Lost-report watchlist records and in-app notifications for subsequent possible found matches.
- A Recovery Center view, responsive design, keyboard-operable controls, and reduced-motion support.

## Technology and files

- Frontend: HTML, CSS, vanilla JavaScript.
- Backend: Google Apps Script (`backend/Code.gs`).
- Initial data store: private Google spreadsheet with Reports, Claims, Watchlist, Notifications, and AuditLog tabs.
- Sign-in: Google Identity Services ID token, verified server-side with Google's tokeninfo endpoint.

See [docs/PROJECT_OVERVIEW.md](docs/PROJECT_OVERVIEW.md), [docs/SETUP_GUIDE.md](docs/SETUP_GUIDE.md), [docs/GOOGLE_SHEETS_SETUP.md](docs/GOOGLE_SHEETS_SETUP.md), [docs/SECURITY_AND_PRIVACY.md](docs/SECURITY_AND_PRIVACY.md), [docs/TESTING.md](docs/TESTING.md), and [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

## Preview

Open `index.html` directly to inspect the design. For full browser behavior, serve the folder over HTTP (for example, VS Code Live Server). Without the configured API, the site intentionally shows a setup message and no fake activity.

## External setup still required

This workspace does not contain a Google spreadsheet, deployed Apps Script URL, Google OAuth client ID, GitHub repository authorization, or a published site. Consequently, authentication, persistence, and live notifications are not configured here. Follow the setup guide to configure them; never enter an OAuth client secret in the frontend.

Google Apps Script web app cross-origin behavior can vary with deployment and browser settings. Test the deployed API from the actual GitHub Pages origin. If browser `fetch` is blocked by CORS or Apps Script redirects, put a small authenticated proxy in front of Apps Script (or move the backend to a platform with explicit CORS support) before production use.

## Security note

This is an academic starter, not a production-ready campus service. Google Sheets is a limited datastore; Apps Script quotas, concurrency, audit retention, and abuse controls need review. Keep the spreadsheet private, deploy as the script owner only after reviewing authorization, and restrict the Apps Script deployment's audience as far as the sign-in/token design allows. See the security document.

## Recent usability updates

- HTML, CSS, JavaScript, and Apps Script source files are formatted with readable indentation.
- Dark mode is controlled by the header toggle and saved in browser local storage, so it remains selected across navigation and browser restarts on that device.
- A signed-in Google ID token is kept in session storage for page refreshes in the same browser tab. The backend validates it again on reload. Google ID tokens expire; if it is no longer valid, the user must sign in again. Signing out clears the saved token.
- A lost report owner can choose **Mark recovered** from Recovery Center. It is removed from public reports after that action. When a two-party SafeReturn handover completes and exactly one of that claimant's open lost reports is the top rule-based match, the backend also marks that lost report returned. Ambiguous possible matches remain open and are never silently closed.
