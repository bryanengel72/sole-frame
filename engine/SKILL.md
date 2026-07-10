---
name: CLIENT-SLUG-photo-blog
description: >
  Write SEO and AEO optimized blog posts for {{BUSINESS NAME}}, a {{SPECIALTY}} photographer in
  {{HOME MARKET}}. Sessions are {{SESSION MODEL}} -- never outdoors. Use this skill whenever the
  client asks to write a blog post, generate photography content, draft an article, or check for
  duplicate topics. Trigger on: "write a blog post", "generate a blog", "write about headshots",
  "check for dupes", "{{CITY}} headshot blog", "{{PHOTOGRAPHER NAME}} blog", {{2-3 SERVICE TRIGGER
  PHRASES FROM THIS CLIENT'S PILLARS §5}}, "city expansion blog", or any time the client
  wants to publish to their website or track a post. Always use this skill -- do not freeform it.
compatibility: "Requires Notion MCP"
---

<!--
ASSEMBLY NOTE (delete this comment in the shipped skill):
The frontmatter `description` above is GENERATED PER CLIENT, not copied verbatim. When assembling
a client's skill, fill every {{...}} from client-profile.md AND replace the service trigger phrases
with 2-3 drawn from THIS client's pillars (§5) and specialty. Do not carry another client's service
words. Examples: Lisa (on-location + conference) -> "on-location headshots", "conference headshots",
"corporate team headshots". Jordan (studio-only, actors, tech) -> "actor headshots", "LinkedIn
headshots", "studio team headshots". Wrong trigger words make the skill fire on services the client
doesn't offer and miss the ones they do.
-->


# {{BUSINESS NAME}} Blog Skill

Write location-specific, audience-specific, SEO and AEO optimized blog posts for
{{BUSINESS NAME}}. Every post targets a specific metro audience and geography.
Generic photography content is not allowed.

> **Read [client-profile.md](client-profile.md) FIRST, every time.** It holds every
> client-specific value: name, city, service-area cities, the five pillars, session model,
> credential, Notion data source ID, and the markets list. This SKILL file and the reference
> files are the shared engine — they never change per client. The profile is the client.
>
> **Also read [LEARNINGS.md](LEARNINGS.md) FIRST, every time.** It holds the rules the skill has
> healed into over past runs (§2 firm, §3 provisional) plus the winning patterns to prefer (§1).
> Apply them to the draft. This is what makes the skill get better with use instead of repeating
> old mistakes. Both the client ledger and the engine-level ledger apply.

---

## Critical Rules Before You Write Anything

1. **Sessions are exactly what the profile's Session Model says — never anything else.**
   See client-profile.md §3. If a topic implies a session type the client doesn't offer
   (e.g. outdoor), pivot to a type they do.

2. **Location-specific and audience-specific always beats generic.** See Content Framing Rules.

3. **Check for duplicates first.** See Step 2. Never skip it.

4. **Lead with the growth-priority pillars** (client-profile.md §5) when no topic is requested.

5. **Credential: use sparingly and always translate it** (client-profile.md §4). Most posts
   should not mention it. Only in posts about why to choose this photographer. See voice-rules.md.

6. **Every post must answer a question someone would ask an AI tool.** The "Common Questions"
   block at the bottom of every post is mandatory — it's what surfaces the content in ChatGPT,
   Perplexity, and Google SGE.

---

## Canonical values (single source of truth — do not contradict these elsewhere)

| Value | Cluster post | Pillar post |
|---|---|---|
| Word count | 600–1,000 | 1,500–2,500 |
| "Common Questions" FAQ count | 4–6 | 5–7 |
| Image brief count | 2–3 | 3–5 |

If any reference file states a different number, THIS TABLE WINS.

---

## Quick Start

0. Load client-profile.md AND LEARNINGS.md (client + engine). Apply active rules to everything below.
1. Collect topic, keyword, audience/city; determine pillar vs. cluster (Step 1)
2. Check for duplicate topics (Step 2)
3. Write the post — pillar or cluster format (Step 3)
4. Deliver post with metadata block + 5 A/B title variants (Step 4)
5. Generate the Content Pack — social, email, FAQ, image brief (Step 4a)
6. Generate Internal Linking suggestions (Step 4b)
7. Deliver Pillar Map update (Step 4c)
8. Log to Notion or deliver copyable metadata (Step 5)
9. Capture feedback and heal (Step 6)

---

## Step 1: Gather Inputs

Check the conversation first before asking. Collect:

| Input | Required | Notes |
|---|---|---|
| Blog topic or idea | Yes | |
| Primary keyword | Yes | MUST include a city from the profile's markets list. Ask if missing. |
| Target audience | Yes | From the audience clusters in client-profile.md §6 |
| Target city / suburb | Yes | From the service-area cities in client-profile.md §2 |
| Post type | No | Pillar or Cluster. Default: Cluster. |
| Status | No | Default: Draft |

Read [references/pillar-strategy.md](references/pillar-strategy.md) and map the post to one of
the client's five pillars (client-profile.md §5). Then set post type:
- **Cluster (default):** specific audience + city + one angle. 600–1,000 words. Links to its pillar.
- **Pillar (deliberate):** broad guide, 1,500–2,500 words, TOC, 6–8 H2s, links to all clusters.

---

## Step 2: Duplicate Detection

**Always run before writing.**

Query the client's Blog Tracker using the Notion MCP `notion-query-data-sources` tool against
the **data source ID in client-profile.md §7** (do NOT use workspace-wide `notion-search` —
it isn't scoped to the database and returns noise). Run two filtered queries:
1. Filter/scan Title for the proposed title or its key words
2. Filter/scan Topic / Keyword for the primary keyword

A post is a duplicate if EITHER matches an existing entry:
1. Identical title (case-insensitive)
2. Same topic + same target audience + same city

NOT duplicates: same topic + different city; same topic + different audience; same city + a
genuinely different angle.

**If a duplicate is found**, present the existing entry and offer: different suburb, different
audience, different angle (suggest 2–3), proceed with overlap flagged, or cancel. Wait for choice.

If the Notion query fails, proceed with writing, flag the skip, and tell the client to check manually.

---

## Step 3: Write the Blog Post

Read [references/voice-rules.md](references/voice-rules.md) and
[references/voice-persona.md](references/voice-persona.md) first, then
[references/blog-writing.md](references/blog-writing.md) for SEO structure.

### Content Framing Rules

**Every post must be location-specific AND audience-specific.** Reframe generic topics:

| Generic (do not write) | Specific (write this) |
|---|---|
| "What to Wear for a Headshot" | "What {{CITY}} Executives Should Wear — Studio vs. On-Location" |
| "Benefits of Conference Headshots" | "Why {{CITY}} Conference Attendees Love Professional Headshot Booths" |
| "Personal Branding Tips" | "How {{CITY}} Entrepreneurs Use Personal Branding Photos to Build Trust" |

Every post answers: **Who is this for? Where are they? What specific value for that person in that place?**

### Session accuracy
Follow client-profile.md §3 exactly. Never describe a session type the client doesn't offer.

### Credential
Follow client-profile.md §4 and voice-rules.md. Most posts: omit entirely.

### Quick writing rules
- Voice: per voice-persona.md. No generic AI phrases (banned list in voice-rules.md).
- Open with a scenario, opinion, or surprising fact — never a definition or rhetorical question.
- Primary keyword (with city) in: title, first 100 words, one H2, meta description.
- End with a CTA referencing the home market or metro service area (booking link from profile §1).
- AEO: intro and headers should each answer a direct voice-search query.

---

## Step 4: Deliver the Post

Read [references/ab-titles.md](references/ab-titles.md) before generating titles.
Output in this format:

```
---
TITLE: [Main SEO-optimized title]

A/B TITLE VARIANTS:
1. [Curiosity] "[title]" -- best for: LinkedIn, email
2. [Contrarian] "[title]" -- best for: social sharing, thought leadership
3. [Benefit-led] "[title]" -- best for: search, high-intent readers
4. [Story hook] "[title]" -- best for: email subject line, social caption
5. [Authority] "[title]" -- best for: search, readers comparing providers

URL SLUG: [lowercase-hyphenated-city-under-75-chars]
META DESCRIPTION: [150-160 chars, primary keyword + city]
PRIMARY KEYWORD: [keyword including city]
TARGET AUDIENCE: [audience]
TARGET CITY: [city]
POST TYPE: [Pillar / Cluster]
PARENT PILLAR: [one of the five pillars]
WORD COUNT: ~[number]
DATE: [today's date — confirm it]
STATUS: Draft
CREDENTIAL MENTION: [Yes / No]
---

[Full blog post body]

---
CTA NOTE: [one line describing the CTA used]
```

---

## Step 4a: Generate the Content Pack

Not optional — runs on every post. Read [references/content-pack.md](references/content-pack.md).
Produces: LinkedIn post, Instagram post (+ hashtags + image), Facebook post, email newsletter
(3 subject lines), FAQ block (4–6 clusters / 5–7 pillars), image brief (2–3 / 3–5).

## Step 4b: Internal Linking Suggestions

Read [references/internal-linking.md](references/internal-linking.md). Two outputs: 2–3 links
to add in this post, 1–3 existing posts to update. Query the profile's data source for related
published posts only.

## Step 4c: Pillar Map Update

Read [references/pillar-strategy.md](references/pillar-strategy.md). Show this post's pillar,
whether that pillar is live/drafted/unwritten, and the status of all five pillars.

---

## Step 5: Log the Post

Use `notion-create-pages` against the data source ID in client-profile.md §7, mapping to the
property schema in §7. If the schema in §7 doesn't match the live database, logging will fail —
in that case deliver all property values in a copyable block and tell the client to paste manually.

Confirm on success:
```
Logged to Notion: "[Title]"
City: [city] | Audience: [audience] | Keyword: [keyword] | Status: Draft
```

---

## Step 6: Capture Feedback and Heal

This is what makes the skill improve with use. Read [LEARNINGS.md](LEARNINGS.md) for the full
loop, trust tiers, and thresholds. Per run:

- **If the photographer corrected anything** (tier-2), append it to the LEARNINGS **Inbox (§4)**
  as a raw note — don't stop to organize. If the same correction has now appeared twice, it's a
  defect: DIAGNOSE the root cause, REPAIR at the right scope (client ledger here / engine ledger +
  reference file if it's a generic hole), VERIFY the fix doesn't break known-good posts, then
  PROMOTE it to §2. Small local fixes may apply immediately; engine-level changes wait for sign-off.
- **If a self-check fired** (tier-3 — a self-audit failure you had to fix, or two files
  disagreeing), note it in the Inbox too. Repeated self-checks point at a rule with a hole.
- **Outcome data (tier-1)** is handled in the monthly Anneal + Mining pass in LEARNINGS.md, not
  per run — but if the client mentions a real result ("that post booked two sessions"), drop it in
  the Inbox so the next pass can mine it.

Never invent a rule from a single one-off or from the model's own opinion. Only durable,
recurring, or outcome-backed signals become rules.

---

## Error Handling

| Error | Response |
|---|---|
| Notion query fails | Proceed with writing. Flag the skip. Client checks manually. |
| Notion create fails | Deliver the post + all property values in copyable format. |
| Topic implies an unsupported session type | Pivot to a supported type. Explain the adjustment. |
| City not in the markets list | Use the closest market and note the actual city. |

---

## Reference Files

| File | Per-client? | When to read |
|---|---|---|
| [client-profile.md](client-profile.md) | **YES — the client** | First, every time. |
| [LEARNINGS.md](LEARNINGS.md) | **YES — heals per client** (+ engine copy) | First, every time (apply rules) and last (capture). |
| [references/voice-rules.md](references/voice-rules.md) | Shared engine | Read first before writing. Anti-AI rules, banned words, self-audit. |
| [references/voice-persona.md](references/voice-persona.md) | **Generated per client** | With voice-rules. This client's persona and example openers. |
| [references/blog-writing.md](references/blog-writing.md) | Shared engine | SEO/AEO structure, post templates. |
| [references/pillar-strategy.md](references/pillar-strategy.md) | Shared engine | Pillar vs. cluster, pillar format, map format. |
| [references/ab-titles.md](references/ab-titles.md) | Shared engine | Before Step 4. |
| [references/content-pack.md](references/content-pack.md) | Shared engine | Before Step 4a. |
| [references/internal-linking.md](references/internal-linking.md) | Shared engine | Before Step 4b. |
| [references/topic-bank.md](references/topic-bank.md) | **Generated per client** | When suggesting topics or a calendar. |
