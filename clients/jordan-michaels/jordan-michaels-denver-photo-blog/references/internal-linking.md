# Internal Linking (Shared Engine)

Every new post gets internal linking suggestions. The goal: build topical authority and keep
readers on the site longer by connecting related content. This is Step 4b — after the content
pack, before Notion logging.

Audience and geography clusters are drawn from client-profile.md §6 (audiences) and §2 (cities).

---

## Why It Matters

Google uses internal links to understand page relationships and importance. A page receiving
many internal links from related posts signals authority. For a local photography blog it also
keeps a reader who found one audience post exploring others, connects suburb posts back to the
home-market page, and reduces bounce (a ranking signal).

---

## Link Cluster Taxonomy

### Topic clusters
| Cluster | What belongs |
|---|---|
| Direction & technique | Session process, what happens in-studio, expression direction, camera anxiety |
| LinkedIn & personal brand | Profile photos, online presence, trust building, branding sessions |
| Team & corporate | Group sessions, HR posts, on-location at office, photo policies |
| Why a specialist | Credential posts, generic vs. specialist, what makes a headshot different |
| Session prep | What to wear, how to prepare, what to expect, timeline |
| Business outcomes | ROI, career results, referrals, client trust |
| Seasonal | Spring/fall booking, Q4 updates, conference season |

### Audience clusters
From client-profile.md §6 — the client's target professional audiences (e.g. attorneys,
executives, real estate, healthcare, tech workers, entrepreneurs, actors — whatever §6 lists).

### Geography clusters
From client-profile.md §2 — home market (anchor) plus each service-area suburb, and a
"metro-wide" bucket for posts without a specific city focus.

---

## Linking Logic

### Outbound (new post → existing posts): suggest 2–3
Priority order:
1. Same audience cluster + different city (strongest — cross-city authority)
2. Same topic cluster + complementary angle (reader goes deeper)
3. Same geography cluster + different audience (broadens reach in the market)
4. Home-market post (always valid — reinforces the anchor)

Do not: link a post to itself; create A↔B loops in one edit; link the same destination twice
from one post; link off-topic just to make a link.

### Inbound (existing posts → new post): suggest 1–3
Priority: same audience cluster, then same topic cluster, then any pillar or high-traffic post
in a related cluster. These require editing existing posts — batch them, ~once a quarter. Don't
suggest updating every existing post for every new one.

---

## Anchor Text Rules

- Descriptive of the target's content; contains the target's keyword naturally; reads as a real
  sentence fragment; 3–8 words.
- Bad: "click here," "read more," "this post," "learn more," or exact-match keyword stuffing.

---

## Notion Integration

Query the client's Blog Tracker (data source ID in profile §7) with `notion-query-data-sources`,
filtering by Target Audience, Topic/Keyword, and City. Only suggest links to posts with
Status = Published.

If the blog is new / few posts exist: track posts written in the current session and suggest
cross-links between them for when published; or ask the client for titles of existing live posts.
If none are known, deliver a "future link targets" block to revisit as the blog grows.

---

## Delivery Format

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
INTERNAL LINKING SUGGESTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

LINKS TO ADD IN THIS POST (before publishing)
Link 1 — [cluster]
  Link to: [post title] ([slug])
  Anchor text: "[suggested]"
  Place in: [section]
  Why: [one sentence]
[up to 3]

EXISTING POSTS TO UPDATE (add a link back to this new post)
Update 1 — [cluster]
  Post to update: [title] ([slug])
  Anchor text: "[suggested]"
  Where: [section]
  Why: [one sentence]
[up to 3]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

When no existing posts are known, output a "FUTURE LINK TARGETS" block instead and tell the
client to revisit it when the next related post is written.

---

## Growing Link Map

Once Notion has history, keep a running log of which posts link to which. Flag orphan posts
(no inbound links) quarterly and give each at least one inbound link — Google struggles to rank
orphans. Once 10+ posts are live, run a link audit as part of the quarterly review.
