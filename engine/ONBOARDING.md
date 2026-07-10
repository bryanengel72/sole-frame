# Onboarding a New Photographer

This turns a signup into a working, client-branded blog skill in about 30 minutes.
The engine (SKILL.md + the 5 shared reference files) is copied verbatim. Only the profile
gets filled, and two files get generated from it.

---

## The three kinds of file (why this is fast)

- **Engine (copy, never edit):** blog-writing.md, pillar-strategy.md, ab-titles.md,
  content-pack.md, internal-linking.md, voice-rules.md, and SKILL.md.
- **Profile (fill once per client):** client-profile.md.
- **Generated (write once per client, from the profile):** voice-persona.md, topic-bank.md.

---

## The pipeline (Onboarding Status)

`New → Contacted → Invoice Sent → Paid → Profile Built → Skill Shipped → Live`

**Sales are manual by design — no online checkout.** A form submission is a lead, not a paid
order. Move a row through the first four stages yourself, outside this system, in whatever order
your process needs:
1. **New** — the row just landed (form submission or manual interview note).
2. **Contacted** — you've reached out / had the call.
3. **Invoice Sent** — you've billed them (Stripe invoice, QuickBooks, PayPal, whatever you use).
   This system doesn't send or track invoices; that's on your own tools.
4. **Paid** — invoice is settled.

**Steps 2–5 below (fill profile → build skill) only start once a row is marked Paid.** Don't build
a client's skill off an unpaid "New" row just because the form was submitted — the intake form is
the *lead capture*, not a commitment. If you want to start prepping the profile earlier (e.g. to
save time once payment lands), fine, but treat that as speculative work until Paid is set.

---

## Step 1 — Intake (form or interview)

**Form (preferred, stored):** send the photographer the **Sole Frame — Client Intake** Notion
form. Their submission becomes one row in the intake database — that row is the single source of
truth for this client. To build, read the row via Notion and proceed to Step 2.
- Intake database: https://app.notion.com/p/11b5d869da1448eeabbd69570c4f52c7
- Intake data source ID (read submissions from here): `3f371f59-fc1c-4b96-9c0a-5937a5679015`
- Form fields map 1:1 to the profile; the DB also has internal pipeline fields (Onboarding
  Status, Skill Slug, Blog Tracker Data Source ID) that the form hides.
  **The GBP (§9) columns exist on the database** (GBP Listing URL, GBP Primary Category,
  GBP Services, GBP Standing Offers, GBP Photo Categories, GBP Attributes) — but Notion Form
  views don't auto-add new columns. Open the form in Notion and toggle these 6 fields on before
  relying on self-serve intake to capture §9; until then, fall back to the interview.
- **Reading submissions:** use `notion-fetch` (by row ID/URL) or `notion-search` (scoped to the
  data source). The SQL `notion-query-data-sources` tool needs a Notion Business+AI plan and is
  NOT available on the current plan — don't rely on it for dup-detection or the monthly mining pass.

**Interview (fallback):** ask the questions live (see intake-questionnaire.md). Same fields.

Either way you need:
- Name, business name, specialty, booking link
- Home market + county + metro, and the 5–6 suburbs they want to rank in (with a landmark each)
- Session types they offer and any they never do
- Credential, if any, and what it actually signals
- Their five topic pillars (help them shape these — most give you 3 strong ones and need coaching)
- Which service lines they most want to grow
- Voice anchors: origin story, a real line they say to nervous clients, one session story,
  one industry opinion, how they'd describe their tone
- Google Business Profile: existing listing link (if any), primary category, services to list,
  standing offers, available photo categories, true attributes (→ profile §9, powers gbp-engine.md)

## Step 2 — Fill the profile

Copy `client-profile.md` into the new client's folder and replace every `<< >>`.
This is the whole per-client configuration.

## Step 3 — Create the Notion Blog Tracker

Create a database for this client with the property schema in client-profile.md §7
(Title, URL Slug, Date Written, Topic/Keyword, Target Audience, City [select], Status [select],
Word Count, Post Type [select], Parent Pillar [select], Session Type [select], Credential Mention).
Set the City select options to the client's markets list. Paste the **data source ID** and URL
back into profile §7. (Use `notion-create-database`; get the data source ID from the response.)

## Step 4 — Generate the two client files from the profile

- **voice-persona.md:** using voice-rules.md as the rulebook and the §8 voice anchors as raw
  material, write this client's persona: who they are, their voice characteristics, 4–5 example
  openers in their voice, and their originality angles. This is the file that makes output sound
  like *them*. Have the photographer read it and correct anything that isn't how they'd say it.
- **topic-bank.md:** using pillar-strategy.md + the client's pillars, cities, and audiences,
  generate 60–70 localized topic ideas organized by category (original angles, location+audience,
  credential, seasonal, conference, city expansion) plus a per-quarter content calendar.

## Step 5 — Assemble and name the skill

Folder = engine files (verbatim) + filled client-profile.md + generated voice-persona.md +
topic-bank.md + a fresh copy of LEARNINGS.md (starts near-empty; heals as the client uses it).
Then set the SKILL.md frontmatter:
- `name`: the slug from profile §1 (pattern: `firstname-lastname-city-photo-blog`)
- `description`: fill every `{{...}}` from the profile AND **replace the service trigger phrases
  with 2–3 drawn from THIS client's pillars (§5)**. Do not carry another client's service words —
  a studio-only actor photographer must trigger on "actor headshots," not "on-location headshots."
- Delete the ASSEMBLY NOTE comment block from the shipped SKILL.md.

Ship it.

---

## What to re-verify per client (the things that broke in v1)

- [ ] Notion **data source ID is pasted** in profile §7 (not left as a name to search for)
- [ ] Notion property schema in §7 **matches the database you actually created**
- [ ] City select options match the markets list exactly
- [ ] The canonical numbers table in SKILL.md is the only source for word/FAQ/image counts
- [ ] voice-persona.md was read and approved by the photographer
- [ ] Session model rules match how they really shoot (esp. the "never depict" line)
- [ ] Profile §9 has at least a primary category and services list — without these, gbp-engine.md
      Mode D (profile optimization) can't run

---

## Monthly — run the self-healing pass

Once a client is live, once a month (or every ~10 posts) run the **Anneal + Mining pass** in
LEARNINGS.md for that client:
- **Anneal:** consolidate the Inbox, promote confirmed corrections, graft long-stable rules up
  into the reference files, resolve contradictions (newest confirmed wins), clear the Inbox.
- **Mine:** pull published posts + outcomes from Notion, rank by result, write what wins as
  positive rules and what loses as deprioritize rules, update the trackers.
- Route generic defects (a rule with a hole, a missing audit check) to the **engine** LEARNINGS +
  the relevant reference file, so every client benefits — but human-approve engine changes first.

This is the loop that makes each client's engine sharper over time. Ten minutes a month per client.

## Scaling note

The engine is the product. When you improve a method (a better AEO rule, a tighter content-pack
format), you edit the engine once and it applies to every client on their next run — as long as
no client copy forked the engine files. Keep engine files pristine per client; put everything
bespoke in the profile and the two generated files.
