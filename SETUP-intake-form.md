# Setup — Web Intake Form → Notion

The intake form (`intake.html`) posts to a serverless function (`api/intake.js`) that writes a
row into your **Sole Frame — Client Intake** Notion database. Two things you must do once, then
deploy.

## 1. Create a Notion integration token

Notion renamed "integrations" to "connections" and moved management into a developer portal —
the old `notion.so/my-integrations` link no longer works. Current path:

1. Go to https://app.notion.com/developers/connections (or: open Notion → workspace **Settings**
   → **Connections** → **Develop or manage integrations**).
2. Under **Build → Internal connections**, click **Create a new connection** (formerly "New integration").
3. Name it e.g. "Sole Frame Intake", pick your workspace, and create it.
4. Open the **Configuration** tab and copy the token (starts with `ntn_` or `secret_`) — this is
   your `NOTION_TOKEN`. Never commit it or share it.
5. Open the intake database in Notion → **•••** (top-right) → **Connections** → add "Sole Frame Intake".
   (Without this share step the function gets a 403/404 — the token can only see pages/DBs it's
   explicitly connected to.)

## 2. Create a Resend API key (for the "new submission" email)

Optional but recommended — without it, submissions still save to Notion, they just don't notify anyone.

1. Sign up free at https://resend.com (no domain needed to start).
2. **API Keys** → **Create API Key** → copy it. This is your `RESEND_API_KEY`.
3. **Test-mode limitation:** until you verify a sending domain (Resend → Domains), the default
   sender `onboarding@resend.dev` can only deliver to the email address your Resend account was
   signed up with. To notify any address, verify a domain in Resend and set `RESEND_FROM` to an
   address on it (e.g. `Sole Frame <notify@yourdomain.com>`).

## 3. Deploy to Vercel
From this folder:
```
npm i -g vercel      # if not installed
vercel                # first run links/creates the project
```
Then set the environment variables (Vercel dashboard → Project → Settings → Environment Variables,
or `vercel env add`):
- `NOTION_TOKEN` = the connection secret from step 1  (**required**)
- `NOTION_INTAKE_DB_ID` = `11b5d869da1448eeabbd69570c4f52c7`  (optional — this is the default baked in)
- `RESEND_API_KEY` = the key from step 2  (optional — email is skipped if unset)
- `NOTIFY_EMAIL` = where the notification should go  (optional — defaults to `mbe2011@gmail.com`)
- `RESEND_FROM` = optional custom sender once a domain is verified

Redeploy after adding env vars: `vercel --prod`.

## 4. Use it
- Landing page: `https://your-domain/` (index.html)
- Intake form: `https://your-domain/intake`  (cleanUrls maps `/intake` → intake.html)
- A submission creates a row in the intake DB with **Onboarding Status = New** and today's date,
  and (if Resend is configured) emails a notification with a link straight to the Notion row.
- Then: read the row (notion-fetch) → generate the profile + skill (see engine/ONBOARDING.md).

## Notes
- `.vercelignore` keeps `engine/`, `clients/`, and docs OUT of the public deploy — only the landing
  page, the form, and the function ship. Client business data stays private.
- Spam: the form has a hidden honeypot field; the function silently drops bot submissions. Add
  Vercel BotID or a rate limit later if needed.
- To store somewhere other than Notion (e.g. Vercel Postgres/Neon), swap the `fetch(...)` block in
  `api/intake.js` for a DB insert — the form and field mapping stay the same.
- Local note: the form UI runs under any static server, but `/api/intake` only works on Vercel
  (or `vercel dev`), so submissions won't save until deployed.
