# FoundIt rubric review

Reviewed 26 October 2026 against the supplied performance-task rubric and the current project files.

| Rubric area                  | Assessment                              | Evidence and remaining check                                                                                                                                                                                                                                                                      |
| ---------------------------- | --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Purpose & content            | Strong                                  | FoundIt is focused on campus item recovery. It includes explainable SmartMatch, private ClueLock verification, SafeReturn handover, a watchlist, and a Recovery Center. Possible matches are clues, not proof of ownership.                                                                       |
| HTML structure & navigation  | Strong                                  | The page has semantic header, navigation, main content, sections, forms, and footer; it includes a viewport declaration, in-page navigation, privacy page, and collapsible small-screen navigation. No public link to the admin setup guide remains.                                              |
| CSS design & responsive UI   | Good                                    | CSS contains six responsive media-query blocks, responsive grids, a compact mobile header, mobile menu, and reduced-motion support. Source reviewed; actual phone/tablet screenshots and overflow checks still need to be done in the user's browser.                                             |
| JavaScript & Google Sheets   | Good, with live-flow checks outstanding | The app connects to Apps Script and Google Sheets. User-reported checks confirm sign-in, sheet initialization, report submission/public display, and claim submission. Notification delivery, authorized staff review, and both parties completing SafeReturn still need a full live walkthrough. |
| Code, testing & presentation | Good for a case-study prototype         | Setup, deployment, privacy, project overview, and testing documentation are included. The testing log is honest about what has and has not been tested. Production security review and deployment-origin/CORS validation remain before a real campus pilot.                                       |

## Responsive behavior to check in your browser

1. Open the site through VS Code Live Server.
2. Narrow the browser window or use Chrome DevTools' device toolbar (phone icon) and choose a phone-sized viewport.
3. Confirm the Menu button opens and closes Browse, Recovery Center, Report, and Sign in.
4. Scroll the report cards, filters, forms, and footer. Confirm there is no page-wide sideways scrolling; the category chips may scroll horizontally by design.
5. Try the same page at tablet and desktop widths.

## Honest status

The mobile changes are implemented in CSS and the JavaScript menu handler. This environment did not complete a visual browser/device test, so do not treat the responsive layout as fully device-verified yet. User-reported backend checks above are not independently rerun here. SafeReturn confirmation and real notification delivery have not been claimed as passed.

Dark mode is available from the header and remembers its setting on the same device. A signed-in session survives page refresh in the current browser tab while the Google ID token remains valid. Owners can close their own lost report with **Mark recovered** in Recovery Center; a confirmed SafeReturn also closes the claimant's unique best matching lost report when one exists.
