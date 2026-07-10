# Client Profile

This is the ONLY file you fill in per photographer. Everything the engine needs that is
specific to this client lives here. The SKILL and the reference files read from this file
instead of hardcoding names, cities, or pillars.

Fill every field marked `<< >>`. Delete the guidance notes once filled if you like.
When this file is complete, generate `voice-persona.md` and `topic-bank.md` from it
(see ONBOARDING.md, Step 4).

---

## 1. Identity

- **Photographer name:** << Lisa Wilson >>
- **Business name:** << Lisa Wilson Photography >>
- **Specialty:** << headshot and personal branding photography >>
- **Booking link / CTA target:** << https://... booking URL >>
- **Skill name (slug):** << lisa-wilson-kc-photo-blog >>  (pattern: firstname-lastname-city-photo-blog)

---

## 2. Geography

- **Home market / studio location:** << Olathe, KS >>
- **County:** << Johnson County >>
- **Metro:** << Kansas City metro >>
- **Metro shorthand used in copy:** << KC / KC metro >>

**Service-area cities** (the suburbs this client wants to rank in, in expansion priority order).
For each: one line of local texture the writer can use for authenticity — a landmark, major
employer, or the market's character. This replaces Lisa's "Garmin / College Blvd" notes.

1. << Olathe, KS >> — << home market, studio is here; Garmin HQ; tech + Johnson County pros >>
2. << Overland Park, KS >> — << largest suburb; College Blvd corridor; T-Mobile; finance + healthcare >>
3. << Leawood, KS >> — << upscale; Town Center Plaza; executives, attorneys, luxury services >>
4. << Shawnee, KS >> — << community feel; solo practitioners, small business >>
5. << Lenexa, KS >> — << growing business community; small business + entrepreneurs >>
6. << Kansas City, MO >> — << Crossroads, Country Club Plaza; attorneys, agencies, creatives >>

**Markets list (for the City select field in Notion — the canonical allowed values):**
<< Olathe, Overland Park, Leawood, Shawnee, Lenexa, Prairie Village, Kansas City MO, Lee's Summit, KC Metro (general) >>

---

## 3. Session model

Describe how this photographer actually shoots. This drives the hard "never write X" rules.

- **Session types offered:** << Studio (in the Olathe studio) AND On-location (at client offices) >>
- **Never depict:** << outdoor sessions — no parks, natural light, streetscapes >>
- **Premium / growth angle:** << on-location at law firms, corporate HQ, medical practices >>
- **On-location client contexts:** << attorney offices, corporate boardrooms, medical practices, law firm lobbies >>

---

## 4. Credential (optional — leave blank if the client has none)

- **Credential:** << The Headshot Crew, trained by Peter Hurley >>
- **What it actually signals to a client:** << trained by the person widely considered the best in the world at directing real people (not models) into photos that work >>
- **Usage rule:** Mention only in posts specifically about *why choose this photographer* or
  *what makes the session different*. Never name-drop to a non-photographer audience.
  Always translate into client value. (Engine enforces this — see voice-rules.md.)

---

## 5. The Five Pillars

The client's five core SEO topics. Each pillar owns a broad category keyword; cluster posts
live under it. Fill all five. If the client only has a strong four, note which is aspirational.

Mark the current **growth priority** pillars — the service lines they most want to expand.

### Pillar 1
- **Name:** << Studio Headshots [Metro] Area >>
- **Target keyword:** << studio headshots Kansas City area >>
- **Pillar post title:** << The Complete Guide to Professional Studio Headshots in the KC Area >>
- **Primary audience:** << individual professionals across the metro >>
- **Growth priority?** << no — this is the SEO anchor >>

### Pillar 2
- **Name:** << Personal Branding Photography [Metro] >>
- **Target keyword:** << personal branding photography Kansas City >>
- **Pillar post title:** << Personal Branding Photography in KC: What It Is and Whether You Need It >>
- **Primary audience:** << entrepreneurs, real estate, solo practitioners >>
- **Growth priority?** << no >>

### Pillar 3
- **Name:** << Corporate Team Headshots [Metro] >>
- **Target keyword:** << corporate team headshots Kansas City >>
- **Pillar post title:** << Corporate Team Headshots in KC: The Complete Guide for HR and Office Managers >>
- **Primary audience:** << HR, office managers, decision-makers >>
- **Growth priority?** << no >>

### Pillar 4
- **Name:** << On-Location Headshots for Law Offices, Small Businesses, Financial Institutions >>
- **Target keyword:** << on-location headshots Kansas City >>
- **Pillar post title:** << On-Location Headshots in KC: How It Works for Law Offices and Financial Firms >>
- **Primary audience:** << managing partners, office managers, practice managers >>
- **Growth priority?** << YES — priority growth >>

### Pillar 5
- **Name:** << Conference and Convention Headshots >>
- **Target keyword:** << conference headshots Kansas City >>
- **Pillar post title:** << Conference Headshots in KC: The Complete Guide for Event Organizers >>
- **Primary audience:** << event organizers, association directors, conference sponsors >>
- **Growth priority?** << YES — priority growth >>

**When no specific topic is requested, suggest the growth-priority pillars first:**
<< Pillars 4 and 5 >>

---

## 6. Audience clusters

The specific professional audiences this client targets (drives internal linking + topic ideas).
<< executives/corporate, attorneys/legal, real estate agents, healthcare, tech workers, entrepreneurs >>

---

## 7. Notion

- **Blog Tracker data source ID:** << paste the data source ID here — see ONBOARDING.md Step 3 >>
- **Database URL:** << https://notion.so/... >>
- **Property schema** (must match the real database exactly, or logging fails):

| Property | Type | Notes |
|---|---|---|
| Title | title | Post title |
| URL Slug | rich_text | |
| Date Written | date | |
| Topic / Keyword | rich_text | primary keyword incl. city |
| Target Audience | rich_text or select | |
| City | select | values must be from the markets list in §2 |
| Status | select | Draft / Published |
| Word Count | number | |
| Post Type | select | Pillar / Cluster |
| Parent Pillar | select | one of the five pillar names |
| Session Type | select | Studio / On-Location |
| Credential Mention | checkbox | |
| Published URL | url | filled when the post goes live — enables the tier-1 outcome loop |
| Outcome | rich_text | monthly note: ranked? traffic? inquiries/bookings? (fuels the mining pass) |

The last two fields power the self-healing outcome loop (see LEARNINGS.md). Without them the skill
can still anneal from corrections; with them it can also mine what actually books sessions.

---

## 8. Voice anchors (seed material for voice-persona.md)

Pull these from the intake interview. They are what make the generated voice sound like a
real person instead of a generic photographer. Capture the photographer's actual words.

- **Origin / why they shoot this:** << ... >>
- **A real thing they say to nervous clients:** << ... >>
- **A specific session story (composite ok):** << ... >>
- **An opinion they hold about the industry:** << ... >>
- **How they'd describe their tone:** << warm, direct, occasionally wry; respects the client's intelligence >>
