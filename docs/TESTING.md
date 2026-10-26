# Testing and verification record

Updated 26 October 2026. Results distinguish user-reported checks from checks independently observed in the repository.

| Check | Result | Evidence / limitation |
|---|---|---|
| GitHub Pages build | Passed | GitHub Actions reported the latest Pages workflow completed with `success` on 26 October 2026. This confirms publishing, not every page interaction. |
| Public site opened and styled | User-reported / screenshot evidence | User shared a screenshot of the published, styled FoundIt page and confirmed the site was published. A direct page load through this review's web tool was unavailable. |
| Navigation targets | Source review | `index.html` includes Browse, Recovery Center, Report, privacy, and section links. A live click-through was not independently performed during this review. |
| Google sign-in | User-reported passed | User reported signing in after configuring Google OAuth and Apps Script. Google sign-in from a new device still needs a fresh sign-in and valid OAuth origin. |
| Spreadsheet setup | User-reported passed | User reported running `setupSheets` and seeing changes in the spreadsheet. |
| Report submission and public display | User-reported passed | User reported the submitted lost report appeared in Latest reports. |
| Claim submission | User-reported passed | User reported submitting a claim. Authorized review, request-more-info, reject/escalate, and return handover are not independently verified here. |
| Dark mode persistence | Implemented; not freshly device-tested | Code stores theme in local storage and applies it on load. Capture a screenshot after toggling and refreshing. |
| Sign-in persistence across refresh | Implemented; limited to a valid session token in the same browser tab | Code restores the session from session storage and validates it again. Google ID tokens expire; another device/browser requires sign-in. |
| Watchlist persistence and UI | Implemented; needs current-deployment walkthrough | Backend associates watch records with the signed-in Google email. Confirm same-account save, refresh, and in-app possible-match notice after deploying the current backend/frontend pair. |
| Photo upload and photo-color matching | Implemented in source; live test not recorded | Browser compresses photos, backend saves them, and SmartMatch compares broad color families. It does not recognize objects. |
| Responsive desktop/mobile layout | CSS/source review only | Responsive breakpoints and menu are present. A labeled phone/tablet screenshot and actual mobile viewport check are still needed for submission evidence. |
| Two-party SafeReturn completion | Not yet verified | Requires claimant and authorized finder/staff to confirm the same approved handover. No completed return is claimed. |
| Email/push notifications | Not implemented | Watchlist notices appear in the Recovery Center only; no external notification provider is configured. |

## Before submission

1. Confirm the published page and each main navigation link.
2. On desktop and phone-sized viewports, capture screenshots of the actual site and label them `FoundIt-desktop.png` and `FoundIt-mobile.png` (or similar). Do not use the design reference image as evidence of the running app.
3. Walk through watchlist save/reload/match and SafeReturn with the required accounts, then update this table only with observed results.
