# LEARNINGS — Self-Healing Ledger

This file is how the skill gets better with use instead of staying static. It is **read at the
start of every run** (rules here are applied to the draft) and **appended at the end of any run
where feedback or an outcome appears**. On a monthly cadence it is **consolidated** (the anneal +
mining pass below). One of these lives per client; a second one lives at the engine level for
defects that affect every client.

> A skill can't rewrite itself with a background process. "Self-healing" here means: this file
> tells the agent to sense its own defects, patch them at the right scope, VERIFY the patch
> didn't break anything, and only then keep it. The loop is invocation-driven, with a human
> gate on high-blast-radius changes.

---

## The loop

```
SENSE  →  DIAGNOSE  →  REPAIR  →  VERIFY  →  PROMOTE
                                    ↑__________|  (reject/rollback if worse)
```

### Trust tiers (a weaker signal never overrules a stronger one)

| Tier | Signal | Where it comes from |
|---|---|---|
| 1 — ground truth | Did the post publish, rank, drive traffic/inquiries? | Notion outcome fields (profile §7) |
| 2 — human correction | The photographer says "that's wrong / I'd never say that" | captured below |
| 3 — self-check | self-audit failures, file-to-file contradictions, stale-fact flags | generated on every run |

Tier 1 outcomes drive **what wins** (the climbing half). Tiers 2–3 drive **defects to zero**
(the annealing half). Never let a tier-3 self-opinion override a tier-1 outcome or a tier-2 correction.

### Thresholds
- One miss is noise. **The same miss twice** becomes a rule.
- A tier-1 pattern needs **4+ posts** to become a firm rule; 2–3 posts = **provisional**.
- **VERIFY gate:** before promoting any rule, re-run the failing case (must now pass) AND a small
  holdout of known-good posts (must still pass). If the holdout regresses, narrow or reject the rule.
- **Scope routing:** client-specific facts/taste → this file. Generic defects (a rule with a hole,
  a missing audit check) → the **engine** LEARNINGS + the relevant reference file.
- **Human gate:** engine-level and strategy-shifting promotions wait for sign-off. Small
  client-local fixes may auto-apply.

---

## 1. Trackers  (update during the monthly pass)

- **Corrections per post (trend):** << e.g. 1.4 → 0.6 → 0.2 >>
- **Last anneal / mining pass:** << YYYY-MM >>
- **Top winning patterns (tier-1):** << e.g. story-hook actor posts convert; on-location law-firm posts get shared >>
- **Known losers (deprioritize):** << e.g. generic "what to wear" location posts >>

## 2. Active rules  (firm — apply to every draft)

<< none yet — populated as corrections and outcomes are confirmed >>

Example of a promoted entry:
```
### studio-lighting-only  (firm, 2026-07, seen 2x)
Trigger: any post describing how a session is lit
Rule:    this client shoots studio strobe only; never imply natural/window/outdoor light
Audit:   "lighting/session type not offered? (check profile §3)"
```

## 3. Provisional  (needs confirmation before it becomes firm)

<< thin-evidence rules live here; confirm or drop at the next mining pass >>

Example:
```
### actor-story-angle-converts  (provisional — 2 posts, 2026-07)
Signal:  tier-1 outcome (booking inquiries)
Action:  prioritize story-driven actor posts; deprioritize generic what-to-wear
Guard:   keep 1 SEO-coverage post/quarter so rankings don't starve
Confirm: promote at 4+ posts; drop if it stops correlating
```

## 4. Inbox  (raw, un-consolidated — cleared by the next anneal pass)

<< append corrections and outcome notes here the moment they happen; don't stop to organize >>

## 5. Archived / superseded  (kept for rollback, with the reason)

<< retired rules and the newer rule that replaced them >>

---

## The Anneal + Mining Pass  (run monthly, or every ~10 posts)

**Anneal (heal defects — tiers 2–3):**
1. Read the Inbox. Cluster repeats; drop true one-offs.
2. For each surviving item: DIAGNOSE the root cause (which file/rule has the hole).
3. REPAIR at the right scope (client here / engine there). Phrase every rule as an auditable check.
4. VERIFY: failing case now passes; holdout of known-good posts still passes. Regression → narrow or reject.
5. PROMOTE survivors to §2 (firm) or §3 (provisional). Resolve contradictions: **newest confirmed
   correction wins**; move the loser to §5 with a note. Clear the Inbox.
6. When a firm rule has held for a few passes, **graft it up into the actual reference file**
   (voice-rules / blog-writing / the profile) and mark it promoted here — that's the file getting
   permanently stronger, not just the ledger growing.

**Mine (climb toward what wins — tier 1):**
1. Pull published posts with outcome data from Notion (profile §7).
2. Rank by outcome. Extract what the **winners** share: angle, title type, pillar, audience, city, length.
3. Write winners as **positive** rules; write consistent losers as deprioritize rules.
4. Apply the overfitting guard (4+ posts = firm) and the metric-basket guard (watch traffic AND
   booking quality, not one number). Feed winners into topic-bank priority and A/B-title weighting.
5. Update the Trackers in §1.

**Guardrails (why this improves instead of rotting):**
- Ground the climb in real outcomes, not the model's own grade of its work.
- Verify before promote; keep the prior state so a bad heal can roll back.
- Recurrence threshold beats overfitting to one viral post.
- A basket of metrics beats gaming a single number.
- Human sign-off on engine and strategy changes; auto-apply only small local fixes.

---

## Entry format (use for every ledger item)

```
### <short-kebab-name>  (<firm|provisional>, <YYYY-MM>, <signal + count>)
Scope:   client | engine (+ which reference file, if promoted)
Trigger: the situation that surfaces it
Was:     what the skill did wrong (omit for tier-1 positive rules)
Now:     the durable rule, phrased as an auditable check
Status:  active | promoted-to-<file> | superseded-by-<name>
```
