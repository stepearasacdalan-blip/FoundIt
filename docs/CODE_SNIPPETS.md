# Code snippets and explanations

These excerpts are shortened from the current implementation. For complete logic, read the named functions in `backend/Code.gs`.

## SmartMatch score and reasons (`match_`)

```js
if (a.category && a.category === b.category) {
  score += 3;
  r.push("same category");
}
```

The matcher adds readable reasons while comparing category, shared title/description words, broad color family, general location, and approximate date. It returns a score and reasons; suggestions are clues for people to review and never prove ownership. The full weights and cutoff are documented in `PROJECT_OVERVIEW.md`.

## Verify Google identity on the backend (`auth_`)

```js
if (!token) throw Error("Sign in is required.");
var resp = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
if (resp.getResponseCode() !== 200)
  throw Error("Google sign-in could not be verified.");
```

The actual function sends the ID token to Google's token-info endpoint, then checks that the verified email exists and that the token audience equals the configured OAuth client ID. The backend repeats authorization checks for protected actions.

## SafeReturn requires two authorized confirmations (`confirmReturn_`)

```js
if (u.email === c.claimantEmail)
  update_("Claims", c.id, { claimantConfirmed: true });
else if (u.email === item.ownerEmail || isStaff_(u.email))
  update_("Claims", c.id, { finderConfirmed: true });
else
  throw Error("Only the claimant and authorized finder can confirm this handover.");
```

The complete function first requires an approved claim with a return reference. It marks the claim returned and updates the found report only after both the claimant and authorized finder/staff have confirmed.

Claim clues are stored with claim records and are not included in public report results. Do not put private clues or credentials in browser code, README examples, or public report descriptions.
