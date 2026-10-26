# Deployment

## Static site

Host the repository root with GitHub Pages (Settings → Pages → deploy from the `main` branch root, or use the GitHub Actions static-pages flow). Since this site uses relative paths, the assets work from a repository subpath. Use HTTPS for production and register the exact Pages origin in the Google OAuth client.

## Apps Script API

Deploy `backend/Code.gs` separately as a Web App after setting Script Properties and initializing the private spreadsheet. Keep the spreadsheet private. Copy the live `/exec` URL into the app's configuration dialog; no API secret is embedded in source.

## Uploading source

If you create an empty repository named `foundit-campus-lost-and-found`, from this directory run:

```sh
git init
git add .
git commit -m "Build FoundIt recovery system starter"
git branch -M main
git remote add origin https://github.com/YOUR_ACCOUNT/foundit-campus-lost-and-found.git
git push -u origin main
```

Then enable Pages in repository settings. Confirm the actual deployment URL and test it before describing it as live. These commands have not been run from this workspace.
