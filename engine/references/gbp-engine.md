# Google Business Profile Engine (Shared Engine)

For a local photographer, the Google Business Profile (GBP) — the listing that shows in the
map pack and on the right side of a branded search — books more sessions than the blog does.
It is the first thing a nearby buyer sees for "headshot photographer near me," and it is where
they tap **Call** or **Book**. The blog earns authority over months; the profile converts
intent today. This engine keeps that profile fresh, keyword-relevant, and unmistakably the
client's voice.

Read [voice-rules.md](voice-rules.md) and [voice-persona.md](voice-persona.md) first — every
GBP post, answer, and caption must sound like the photographer, not a listing bot. Read
[client-profile.md](../client-profile.md) for the city, pillars, markets, session model,
booking link, and the GBP inputs in **§9**.

> **Scope boundary.** This engine covers profile optimization, GBP posts, owner Q&A, photo
> captions, and the posting calendar. **Review *responses* are not here** — they belong to the
> review engine. Review *velocity* is one of the strongest local-ranking signals, so this file
> flags where a review nudge fits, but does not draft replies.

---

## Canonical values (single source of truth for GBP — the SKILL table governs the blog, this governs GBP)

| Output | Spec |
|---|---|
| Update post ("What's new") | Hook in the first ~90 characters (mobile truncates there); body 150–300 words; exactly **one** photo/video; **one** CTA button |
| Offer post | Requires start + end date; title ≤ 58 chars; include terms/how-to-claim; CTA usually **Book** |
| Event post | Requires title + start/end date (and time if applicable); CTA to book or learn more |
| Owner Q&A seeds | 5–8 questions per profile refresh; each answer 2–4 sentences, keyword-natural |
| Business description | ≤ 750 characters; city + primary service front-loaded in the first sentence |
| Posting cadence | **At least one post per week** — freshness is a ranking signal and only recent posts show prominently |
| Photo caption / file name | Same rules as the blog Image Brief (content-pack.md §4) |

**Hard platform rules — never violate (Google can reject the post or suspend the profile):**
- **No phone numbers in post body text.** Use the **Call** button instead.
- **CTA buttons are limited to Google's set:** Book, Order online, Buy, Learn more, Sign up, Call now. Never invent button text.
- **Truthful only.** No fake scarcity, no invented awards, no "#1 in [city]" unless verifiable.
- **No excessive caps, emoji walls, or symbol spam.** Reads as spam; hurts ranking.
- One photo per post — pick the single strongest frame, don't describe a gallery.

---

## The four modes

### Mode A — Repurpose (default, cheapest)
When a blog post is written, spin one GBP **Update** post from it (SKILL Step 4d). It is a
companion, not a summary: the blog's single sharpest idea, localized, ending in a CTA. This is
the lowest-effort way to keep the profile fresh on the same cadence as the blog.

### Mode B — Standalone batch
On request ("write my GBP posts for this week/month"), generate a batch of 4–8 posts spread
across the client's pillars (profile §5), leading with the growth-priority pillars, each
targeting a different city from the markets list (§2) in expansion order — the same footprint
logic the blog uses (pillar-strategy.md). Deliver with the posting calendar.

### Mode C — Owner Q&A seeding
On request, generate 5–8 question/answer pairs the owner posts and answers on their own
profile. Seed the questions real buyers ask ("Do you do on-location headshots for law firms in
[city]?"), answer in 2–4 keyword-natural sentences, and mark which answer the owner should
upvote so it surfaces first. Never seed a question that implies a session type the client
doesn't offer (profile §3).

### Mode D — Profile optimization pass (one-time, then quarterly)
Audit and rewrite the static profile from the profile inputs: business description, primary +
secondary categories, services list, and attributes. The **primary category** is a heavy
ranking lever — recommend the most specific accurate one (e.g. "Portrait studio" or
"Photographer") and list secondaries. Flag any gap in profile §9 that blocks the pass.

---

## Content Framing Rules (same discipline as the blog)

Every GBP post is **location-specific and audience-specific**. A generic "Book your headshots
today!" is banned exactly as it is on the blog.

| Generic (do not post) | Specific (post this) |
|---|---|
| "Professional headshots available!" | "On-location headshot day for a Leawood law firm — what a 20-minute partner session looks like" |
| "Book your session now" | "[City] conference this fall? Here's how a headshot booth pays for itself by lunch" |
| "We do team photos" | "Refreshing a 30-person Overland Park team's headshots without shutting down the office" |

Each post answers: **who is this for, where are they, and what specific reason to tap the button now?**

- Front-load the hook — the first line is all most people see before "Read more."
- Primary keyword with city in the first sentence, naturally.
- Session accuracy per profile §3 — never depict a session type the client doesn't offer.
- Credential: omit (profile §4). GBP posts are read by buyers, not photographers.
- End with the button that matches intent: **Book** for ready buyers, **Learn more** to send to the matching blog post or service page, **Call** for high-touch corporate/on-location.

---

## Duplicate detection

Run before generating a batch, same as the blog (SKILL Step 2). Query the client's tracker
(profile §7 data source ID) filtered to **Format = GBP** so posts don't repeat a city + pillar
+ angle already posted. A GBP post reusing a blog's idea for a *different* city is not a
duplicate; the same offer to the same city twice in a month is.

---

## GBP Post Delivery Format

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GOOGLE BUSINESS PROFILE — [Update / Offer / Event]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

POST TYPE: [Update / Offer / Event]
PARENT PILLAR: [one of the five, profile §5]
TARGET CITY: [from markets list, profile §2]
[Offer/Event only] DATES: [start – end]

POST BODY:
[hook line — first ~90 chars carry the message]
[150–300 word body, photographer's voice, localized]

CTA BUTTON: [Book / Learn more / Call now / Sign up]
BUTTON TARGET: [booking link from profile §1, or the matching blog/service URL]

PHOTO TO ATTACH: [one frame — what to use]
  Alt/file name: [lowercase-hyphenated-city-keyword-01.jpg]

[Offer only] TERMS: [how to claim, any limits — truthful]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Owner Q&A Delivery Format

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GBP OWNER Q&A SEEDS  (post as the owner, then upvote your own answer)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Q1: [question phrased the way a real buyer types it, city included where natural]
A1: [2–4 sentences, keyword-natural, session-accurate]  ★ upvote this
[continue to 5–8]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Profile Optimization Delivery Format (Mode D)

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GBP PROFILE OPTIMIZATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRIMARY CATEGORY: [most specific accurate — ranking lever]
SECONDARY CATEGORIES: [list]
BUSINESS DESCRIPTION (≤750 chars): [city + primary service in sentence one]
SERVICES: [service : one-line description — one per pillar/service line]
ATTRIBUTES TO SET: [e.g. by appointment, on-site services, LGBTQ+ friendly if true]
GAPS BLOCKING THIS PASS: [any missing profile §9 input]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Posting Calendar

When delivering a batch (Mode B), append a simple calendar so the client knows what to post when.
Weekly cadence, rotating pillars and cities, weighted toward growth-priority pillars (profile §5)
and seasonal booking pushes (topic-bank.md if present).

```
GBP POSTING CALENDAR — [month]
Week 1: [pillar] · [city] · [Update/Offer/Event] — [one-line angle]
Week 2: [pillar] · [city] · [type] — [angle]
Week 3: [pillar] · [city] · [type] — [angle]
Week 4: [pillar] · [city] · [type] — [angle]
Note: post at least weekly; if a review comes in, that week's priority is replying (review engine).
```

---

## Notion Tracking

GBP entries live in the **same Blog Tracker** as posts, separated by a **Format** field
(profile §7). Log each generated post so duplicate detection and the pillar map stay accurate.

- **Format:** GBP Update / GBP Offer / GBP Event / GBP Q&A (Blog Post is the default for posts)
- **City, Parent Pillar, Status, Date Written:** filled as normal (a GBP post still supports a pillar)
- **Post Type, Session Type, Word Count:** may be blank for GBP — that's expected
- If the tracker has no Format field yet, deliver the post plus a copyable metadata block and
  tell the client to add the field (graceful fallback, same as the blog logging rule)

---

## GBP Voice + Compliance Audit

Run every GBP post through this before delivering.

- [ ] Hook lands in the first ~90 characters — the message survives truncation
- [ ] Location-specific and audience-specific — not a generic "book now"
- [ ] Primary keyword with city in the first sentence, naturally
- [ ] Session type is one the client actually offers (profile §3)
- [ ] Credential omitted (buyers read this, not photographers)
- [ ] No phone number in the body; CTA uses an allowed Google button
- [ ] No banned words from voice-rules.md; sounds like the photographer
- [ ] One photo specified, with alt/file name
- [ ] Offer/Event has real dates and truthful terms
- [ ] Logged to the tracker (Format set) or delivered as a copyable block

If all pass: deliver. Capture any client correction into LEARNINGS.md the same way the blog does
(SKILL Step 6) — the GBP engine heals on the same loop.
