# Project overview

## Purpose and users

FoundIt helps campus members publish safe public reports, find possible related reports, verify claims using private clues, and record a safe item return. Guests can browse. A verified Google account is required for reporting, claiming, watchlist, and recovery actions. A report owner or allowlisted staff member can review claims for that item.

## Workflow and states

The normal journey is **Reported → Possible Match → Claim Submitted → Verification → Approved → Return Confirmed**. Alternatives include **No Match Yet** (no rule score meets the threshold), **Additional Information Needed** (`MORE_INFO`), **Rejected**, and **Disputed**. The initial report status is `OPEN`; it becomes `RETURNED` only when claimant and authorized finder each confirm an approved SafeReturn claim. The system does not claim that a possible match proves ownership.

## SmartMatch rules

The server compares a lost report with open found reports. It adds points for same category (3), up to three shared words longer than three characters in title/description (1 each), same nonempty color (2), same exact general-area text (1), and dates within 14 days (1). Scores of at least 3 are surfaced as possible matches. Reasons are returned with the score. These rules are a starting point and can produce false positives or miss matches; people must review them.

## Privacy boundary

Public reports contain title, category, public description, color, approximate date, general area, status, and creation date. They do not contain owner email or claim clues. Claims contain claimant email, private clues, and private reviewer notes. Only the claimant, the report owner, and allowlisted staff can receive the relevant claim record from `myRecovery`; server endpoints independently recheck permissions for every decision.
