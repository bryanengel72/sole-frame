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

## Step 1 — Intake (three ways to collect it)

There are now three ways a client's answers land in their intake row. All three write to the
same **Sole Frame — Client Intake** Notion database, matched by email, so they can be mixed —
someone can submit the short form, then the deep form, and it's one row, not three.

**1. Short form (`intake.html`, public, pre-payment):** lightweight lead capture — name,
business, email, specialty, home market, booking link. This is what's linked from the main site.
Gets a row into the pipeline at **New**. Does not collect pillars, voice, or GBP.

**2. Deep form (`onboarding.html`, private, post-payment) — send this once a client is Paid:**
self-serve replacement for the live interview. Covers everything the interview does — market
detail, session model, credential, all five pillars, voice anchors, and GBP (§9) — in one
sitting, 15–20 minutes. `POST /api/onboarding` finds the existing row by email and **updates it
in place** (never overwrites a filled field with a blank one, and never regresses Onboarding
Status backward if the client is already further along). If no matching row exists, it creates
one. On success it advances the row to **Profile Built**. Link to send: `/onboarding.html`, or
`/onboarding.html?email=jane@...` to pre-fill.
- Pro: scales without your time; client answers in their own words, no transcription step.
- Con: no live coaching — if their pillar or voice answers come back thin, you won't catch it in
  the moment the way you would on a call. Skim the row after submission; follow up by email or a
  short call if anything's too generic (especially the voice-anchor fields — thin answers there
  produce generic-sounding posts).

**3. Interview (fallback, or when depth needs live coaching):** ask the questions live (see
intake-questionnaire.md), fill the row yourself. Same fields as the deep form.

**GBP (§9) note:** the deep form and the underlying database both have all 6 GBP columns (GBP
Listing URL, GBP Primary Category, GBP Services, GBP Standing Offers, GBP Photo Categories, GBP
Attributes). The short-form's Notion **Form view** does not have them toggled on — that's fine,
since §9 is meant to come from the deep form or interview, not the pre-payment lead form.

- Intake database: https://app.notion.com/p/11b5d869da1448eeabbd69570c4f52c7
- Intake data source ID (read rows from here): `3f371f59-fc1c-4b96-9c0a-5937a5679015`
- **Reading submissions:** use `notion-fetch` (by row ID/URL) or `notion-search` (scoped to the
  data source). The SQL `notion-query-data-sources` tool needs a Notion Business+AI plan and is
  NOT available on the current plan — don't rely on it for dup-detection or the monthly mining pass.

Whichever path(s) a client's row came through, you need:
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

**Operator step — must run under the operator's (Sole Frame's) own Notion, not the client's.**
The tracker is created in *your* workspace so ownership, the compounding library, and the ability
to revoke access stay with you. The client gets the tracker as a **guest** invited to their DB
only — they can log and read their posts, but they never own it and can't see any other client's.
Do **not** let a client-run onboarding session create this DB under the client's own Notion
connection; if onboarding is running in the client's context, hand this step back to the operator.
(Exception: an existing friend-of-the-house client who keeps their own Notion — leave theirs as-is.)

Create a database for this client with the property schema in client-profile.md §7
(Title, Format [select], URL Slug, Date Written, Topic/Keyword, Target Audience, City [select],
Status [select], Word Count, Post Type [select], Parent Pillar [select], Session Type [select],
Credential Mention). The **Format** select (Blog Post / GBP Update / GBP Offer / GBP Event /
GBP Q&A) lets GBP entries share this tracker — see references/gbp-engine.md.
Set the City select options to the client's markets list. Paste the **data source ID** and URL
back into profile §7. (Use `notion-create-database`; get the data source ID from the response.)

Then **share the DB with the client as a guest with edit access** (edit so they can log posts;
guest so they see only their own tracker). Never add a client as a workspace member.

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
