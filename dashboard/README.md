# Content Engine Performance Dashboard

A read-only web dashboard that connects to a photographer's Notion blog
tracker and shows the state of their content operation at a glance: what
exists, what is in draft, where the pillar gaps are, and what to do next.

Sold as an optional add-on to the Sole Frame content engine. Notion is the
single source of truth; this app stores nothing and never writes to Notion.

## Stack

- Next.js (App Router) + TypeScript, deployed on Vercel
- Tailwind CSS
- `@notionhq/client` for the Notion API
- No database of its own

## Setup

1. Create an internal Notion integration at
   https://www.notion.so/my-integrations and copy the token.
2. In Notion, open the client's blog tracker database and share it with the
   integration (three-dot menu, Connections).
3. Copy the env template and fill it in:

   ```bash
   cp .env.example .env.local
   ```

4. Install and run:

   ```bash
   npm install
   npm run dev
   ```

## Multi-client model

One codebase, one deploy per client. Everything client-specific comes from
environment variables (see `.env.example`): the Notion database id, the
client name, the market label, the accent color, and the pillar list. Adding
a client is a new Vercel project (or environment) with different env values.
There are no hardcoded client values in the code.

## Tracker fields

Field names vary slightly per client, so all mapping lives in one file:
[lib/notion/fields.ts](lib/notion/fields.ts). Each logical field lists the
Notion property names it may appear under. Add aliases there, never in
component code.

The dashboard reads: Title, URL Slug, Date Written, Topic / Keyword,
City / Market, Pillar, Post Role, Status, Word Count, Published URL,
Last Refreshed, and GBP Posted Date. Missing or empty fields degrade
gracefully.

The GBP cadence panel needs a date property named `GBP Posted Date` in the
tracker. Without it, the panel renders a setup notice instead of data.

## Security

- `NOTION_TOKEN` is server-side only. Notion is called exclusively from
  server components ([lib/notion/tracker.ts](lib/notion/tracker.ts) imports
  `server-only`). Nothing under `NEXT_PUBLIC_` is used.
- The dashboard is read-only. It never edits or creates Notion content.

## Out of scope

- Traffic and engagement analytics (that data lives in WordPress and Google
  Analytics, not Notion). Nothing here is fabricated or stubbed.
- Auth. One deploy serves one client.
