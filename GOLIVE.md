# SORTS website · go live

Same flow as inklinenews.com. Domain: sortsgame.com (already registered at SiteGround).

## Stage 1 · GitHub
1. Open GitHub Desktop → File → New repository → name it `sortsgame`, local path anywhere.
2. Unzip sortsgame-site.zip and copy EVERYTHING inside it straight into the repository
   folder, so the repo root shows `wrangler.jsonc`, `GOLIVE.md` and `public/` side by
   side. THE CHECK THAT MATTERS: if the repo root shows a single `sortsgame` folder
   instead, you are one level too deep. Move its contents up and delete the empty folder.
   (Cloudflare runs the deploy from the repo root, and wrangler.jsonc must be there or
   the build fails with "Could not detect a directory containing static files".)
3. Commit to main → Publish repository (private is fine).

## Stage 2 · Cloudflare
1. Cloudflare dashboard → Workers & Pages → Create → import the `sortsgame` repo.
2. Cloudflare reads `wrangler.jsonc` automatically (static assets from `public/`,
   404 handled by `404.html`). No build command, no framework preset needed.
   If the form asks: Build command = (leave empty), Deploy command = `npx wrangler deploy`.
   If a build ever fails with "Could not detect a directory containing static files",
   the repo layout is nested one level too deep: see the check in Stage 1 step 2.
   (Alternative fix without moving files: in the Worker's build settings, set
   Root directory to the subfolder that contains wrangler.jsonc.)
3. Deploy. Check the temporary `*.workers.dev` preview on your phone.

## Stage 3 · Domain
1. In the Worker → Settings → Domains & Routes → add `sortsgame.com` and `www.sortsgame.com`.
2. At SiteGround, point the domain's nameservers to Cloudflare (Cloudflare shows the
   pair to use when you add the site), or add the site to Cloudflare first if it isn't there.
3. Wait for DNS, then check https://sortsgame.com on your phone.

## Stage 4 · Email
1. Cloudflare dashboard → your sortsgame.com zone → Email → Email Routing → enable it
   (Cloudflare adds the MX records for you).
2. Create the address `hello@sortsgame.com` and set its destination to your Gmail.
3. Verify the destination from the email Cloudflare sends, then send yourself a test.
   The whole site already uses hello@sortsgame.com, so nothing else to change.
4. Before the app ships, put hello@sortsgame.com in App Store Connect as the support
   contact, and make sure the in-app report/support links use it too.

## Stage 5 · When the app goes live
1. Search the repo for `#APPSTORE` (the two App Store badge links in
   `public/index.html`) and replace with the real App Store URL from App Store Connect.
2. Optional but recommended: swap `public/assets/appstore-badge.svg` for Apple's
   official badge artwork from https://developer.apple.com/app-store/marketing/guidelines/
   (same filename, nothing else to change). The current file is a faithful recreation
   so the site works today; Apple prefers their official asset once you link for real.
3. Change the two "Coming soon to iPhone & iPad" lines to "For iPhone & iPad" (also in
   `public/index.html`).
4. In App Store Connect, set the app's Support URL to https://sortsgame.com/support/
   and the Privacy Policy URL to https://sortsgame.com/privacy/ (the app's
   AppLinks.privacyPolicy should match).
5. Commit and push; Cloudflare redeploys automatically.

## Notes
- The gameplay video lives at `public/media/sorts-preview.mp4` (2.1 MB, muted, loops,
  plays only while on screen). To update it, re-encode any portrait MP4 to 540px wide.
- Screenshots live in `public/screens/` as 720w WebP. To update, export new PNGs and
  re-run any image tool at 720 wide, quality ~82.
- Support email across the site is hello@sortsgame.com (Cloudflare Email Routing,
  Stage 4). Until routing is enabled, mail to that address will bounce.
- The hero performance: tap anywhere during the intro to skip it. Reduce Motion users
  get the finished headline and a live board immediately.
- Privacy effective date is 12 July 2026 (from your policy). Update the date in
  `public/privacy/index.html` whenever the policy changes.
