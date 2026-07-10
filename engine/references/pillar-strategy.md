# Pillar Page Strategy (Shared Engine)

A pillar page is a long-form, comprehensive post covering a broad topic in depth. Shorter,
specific posts — cluster posts — live under it and link back. Google rewards this because it
signals a site owns a topic, not just a post.

For a local photographer, this means ranking not only for a long-tail keyword like "attorney
headshots [suburb]" but for the category keyword like "headshots [metro]" broadly.

**The client's five specific pillars are defined in [client-profile.md](../client-profile.md) §5.**
This file covers the mechanics — how the model works, how to identify a pillar vs. a cluster,
pillar format rules, and the map format — which are the same for every client.

---

## How the Model Works

```
PILLAR PAGE (broad keyword, 1,500-2,500 words)
    |-- Cluster post (specific audience + city)
    |-- Cluster post (specific audience + city)
    |-- Cluster post (specific angle or location)
    |-- Cluster post (seasonal or event)
```

- The pillar links OUT to every cluster under it; every cluster links BACK to its pillar.
- Clusters cross-link to each other when relevant.
- The pillar is updated as new clusters are added.

When Google sees many specific posts pointing to one central page, it treats that page as an
authority on the topic.

---

## Identifying Post Type at Intake

### A post is a PILLAR if:
- The topic is broad enough that 6–10 specific posts could live under it
- It targets a category keyword, not a long-tail keyword
- It should be the "complete guide" for that topic
- It benefits from a table of contents and 6–8 H2 sections
- It will be updated over time as clusters are added

### A post is a CLUSTER if:
- It targets a specific audience + specific city + specific angle
- It is 600–1,000 words on one focused idea
- It clearly belongs under one of the five pillars
- It is not a comprehensive guide

**Default is cluster.** Most posts are clusters. Pillars are written deliberately.

---

## Pillar Post Format Rules

- **Length:** 1,500–2,500 words. Comprehensive, not padded.
- **Table of contents:** a simple linked TOC below the intro.
- **Sections:** 6–8 H2s, each answering a distinct sub-question, phrased as natural-language
  questions or clear statements.
- **FAQ:** a longer "## Common Questions" block — 5–7 questions (per the canonical table in SKILL.md).
- **Internal links to clusters:** the pillar must link to every published cluster under it, and
  gets updated as new clusters are added. This is the most important maintenance task.
- **Meta description:** broader and more category-level than a cluster's.
- **Update cadence:** review every 3–6 months; refresh when clusters, services, cities, or
  seasonal CTAs change.

---

## Pillar Map Delivery Format

When a new post is written, include a map showing where it fits. When the client asks for topic
ideas, deliver the full map with current status. Pull the five pillar names from client-profile.md §5.

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PILLAR MAP UPDATE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

THIS POST: [title]
TYPE: [Cluster / Pillar]
PARENT PILLAR: [Pillar name from profile §5] ([Published / Not yet written])

ACTION: This post should link back to the [Pillar name] page.
[If pillar not yet written]: The parent pillar has not been written yet.
Recommended: write [pillar title] as the next priority post under this topic.

---
FULL PILLAR STATUS:

Pillar 1: [name]  — Status: [Published/Draft/Not yet written] — Clusters published: [n] — Next: [title]
Pillar 2: [name]  — Status: [...] — Clusters published: [n] — Next: [title]
Pillar 3: [name]  — Status: [...] — Clusters published: [n] — Next: [title]
Pillar 4: [name]  — Status: [...] — Clusters published: [n] — Next: [title]
Pillar 5: [name]  — Status: [...] — Clusters published: [n] — Next: [title]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Content Priority Logic

Use when the client asks what to write next:

1. **Write the pillar first if no clusters exist for that topic.** A cluster with no pillar to
   link back to is a stranded post.
2. **Once a pillar is live, write 3–4 clusters under it before starting a new pillar.**
3. **Lead with the growth-priority pillars** flagged in client-profile.md §5 when no topic is requested.
4. **City expansion across pillars is the SEO priority.** Every new post should target a
   different city from profile §2, in the expansion order listed there, to build the footprint outward.
5. **The home-market pillar anchors everything.** It's the ranking base; reinforce, don't cannibalize.
6. **The highest-booking-value pillar** (usually corporate/team work) produces clusters most
   likely to be forwarded to decision-makers — weight toward it when growth is the goal.

---

## Notion Integration

Track per post in the client's Blog Tracker (data source ID in profile §7): Post Type
(Pillar/Cluster), Parent Pillar (select from the five names), Pillar Status. This lets the
linking and pillar map be generated from the database.
