# Lisa Wilson — Worked Example

This folder is a client instance of the engine, demonstrating the split. It contains only the
per-client files:

- `client-profile.md` — filled from Lisa's intake (the one file you edit per signup)
- `references/voice-persona.md` — generated from the profile (makes output sound like Lisa)
- `references/topic-bank.md` — generated from the profile (localized topics + calendar)

## To make this a runnable skill

Copy the engine files in verbatim, so the assembled skill folder is:

```
lisa-wilson-kc-photo-blog/
  SKILL.md                          ← from engine/, frontmatter filled from profile §1
  client-profile.md                 ← this folder
  references/
    voice-rules.md                  ← from engine/references (shared)
    blog-writing.md                 ← from engine/references (shared)
    pillar-strategy.md              ← from engine/references (shared)
    ab-titles.md                    ← from engine/references (shared)
    content-pack.md                 ← from engine/references (shared)
    internal-linking.md             ← from engine/references (shared)
    voice-persona.md                ← this folder (generated)
    topic-bank.md                   ← this folder (generated)
```

Before shipping: create Lisa's Notion Blog Tracker and paste the data source ID into
`client-profile.md` §7 (still a placeholder here).

> Lisa's original live skill is left untouched. This is the reference build proving the template
> reproduces it — and the pattern every future signup follows.
