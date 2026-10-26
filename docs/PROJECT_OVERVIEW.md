# Project overview

## Purpose and users

FoundIt helps campus members publish safe public reports, find possible related reports, verify claims using private clues, and record a safe item return. Guests can browse. A verified Google account is required for reporting, claiming, watchlist, and recovery actions. A report owner or allowlisted staff member can review claims for that item.

## Workflow and states

The normal journey is **Reported → Possible Match → Claim Submitted → Verification → Approved → Return Confirmed**. Alternatives include **No Match Yet** (no rule score meets the threshold), **Additional Information Needed** (`MORE_INFO`), **Rejected**, and **Disputed**. The initial report status is `OPEN`; it becomes `RETURNED` when claimant and authorized finder each confirm an approved SafeReturn claim. The public board hides returned reports; the lost-report owner can also mark a report recovered from their Recovery Center when the item was recovered outside this claim flow. The system does not claim that a possible match proves ownership.

## SmartMatch rules

The server compares a lost report with open found reports. It adds points for same category (3), up to three shared words longer than three characters in title/description (1 each), same color family, whether typed or estimated from the photo (2), same exact general-area text (1), and dates within 14 days (1). Scores of at least 3 are surfaced as possible matches. Reasons are returned with the score. These rules are a starting point and can produce false positives or miss matches; people must review them.

## Privacy boundary

Public reports contain title, category, public description, color, approximate date, general area, status, and creation date. They do not contain owner email or claim clues. Claims contain claimant email, private clues, and private reviewer notes. Only the claimant, the report owner, and allowlisted staff can receive the relevant claim record from `myRecovery`; server endpoints independently recheck permissions for every decision.

## Photos and image-assisted matching

Reports may include an optional photo. The browser resizes/re-encodes it as a small JPEG (up to about 30 KB) and estimates a broad color family from sampled pixels. The photo is public with the report. SmartMatch compares the photo's estimated color family with the other report's typed or estimated color, alongside the text, category, location, and date rules. It does not use computer vision to identify the object itself. The estimate is a clue only; people still verify ownership with ClueLock.

The Reports sheet adds `imageData` and `imageColor` columns. After updating `Code.gs`, run `setupSheets` once to append missing headers to an existing sheet, then deploy a new Apps Script version. Existing report rows remain in place. The backend rejects image data over 40,000 characters to stay under a Sheets cell limit. Avoid photos containing faces, IDs, serial numbers, or other private information.


