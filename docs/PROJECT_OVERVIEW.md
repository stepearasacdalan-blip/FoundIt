# FoundIt project overview

## Purpose and users

FoundIt is for students, staff, and campus visitors who lose or find personal items. Guests can browse public reports. Google-authenticated users can create reports, submit private claims, manage their own lost-report watchlist, and follow recovery progress. The person who filed a found report or an allowlisted staff member reviews claims for that found item.

## User journey and statuses

The intended journey is **Reported → Possible Match → Claim Submitted → Verification → Approved → Return Confirmed**.

- Reports start `OPEN`.
- SmartMatch suggestions are possible matches, not proof.
- Claims can be `SUBMITTED`, `MORE_INFO`, `APPROVED`, `REJECTED`, `DISPUTED`, or `RETURNED`.
- An approved SafeReturn claim is complete after claimant and authorized finder each confirm handover.
- A report closed as returned is removed from public browse. The owner may also mark their lost report recovered if the handover happened outside the claim flow.
- A report can remain open when there is no match yet. Human reviewers make verification decisions.

## SmartMatch rules

The backend compares one lost report with open found reports. Current points are:

| Signal | Points |
|---|---:|
| Same category | 3 |
| Up to three shared words (at least four characters) in title/description | 1 each |
| Same broad color family, typed or estimated from a photo | 2 |
| Same general-area text | 1 |
| Approximate dates within 14 days | 1 |

Scores of 3 or more are returned as possible matches with the reasons. This rule set can produce false positives or miss matches. It does not use AI or object recognition.

## Claim and return workflow

1. The claimant chooses a public found report and submits private clues.
2. The backend checks the claimant's Google ID token and records the claim privately.
3. The found-report owner or allowlisted staff can ask for more information, approve, reject, or escalate the claim. Other users cannot review it.
4. Approval creates a unique SafeReturn text reference.
5. The claimant and authorized finder/staff each confirm the handover. Only after both confirmations is the return recorded.

Private claim clues, claimant message, reviewer identity/notes, and return confirmations are returned only to authorized accounts by the backend. Never put private clues in a public report.

## Data schema

Google Sheets contains these tabs:

- **Reports:** `id`, `type`, `title`, `category`, `description`, `color`, `approxDate`, `location`, `ownerEmail`, `status`, `createdAt`, `imageData`, `imageColor`. The public endpoint removes `ownerEmail`; item images and their broad color estimate are public.
- **Claims:** `id`, `itemId`, `itemTitle`, `claimantEmail`, `privateClues`, `message`, `status`, `reviewerEmail`, `reviewNote`, `returnRef`, `claimantConfirmed`, `finderConfirmed`, `createdAt`, `updatedAt`.
- **Watchlist:** `id`, `userEmail`, `itemId`, `createdAt`.
- **Notifications:** `id`, `userEmail`, `type`, `title`, `body`, `itemId`, `read`, `createdAt`. These are in-app only.
- **AuditLog:** reserved fields; this starter does not yet write audit events.

`setupSheets` creates missing tabs and appends required headers to existing sheets. Back up the spreadsheet before schema changes.

## Security checks

- The Apps Script verifies the Google ID token with Google's tokeninfo endpoint, checks the configured OAuth audience, and requires a verified email.
- Authenticated endpoints call backend authorization checks; role and ownership are not trusted from the browser.
- Claim private fields are excluded from public reports and filtered by claimant, report owner, or staff access in the backend.
- Staff emails are configured in Apps Script Script Properties, not in public JavaScript.
- The Google spreadsheet must remain private; all browser data access must go through Apps Script.
- The OAuth client ID and Apps Script web app URL are public client configuration. No client secret belongs in GitHub Pages.

## Limits

Images are downscaled to a small JPEG stored in a Sheets cell. Image matching estimates a broad color family only; it does not recognize the item. The starter lacks email/push delivery, robust rate limits, transactional locking, and production audit retention. Do not treat it as a production campus service without a security and privacy review.
