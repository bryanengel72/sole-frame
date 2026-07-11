import { GBP_ON_TRACK_DAYS, GBP_SLIPPING_DAYS } from "@/lib/config";
import { formatDate } from "@/lib/format";
import type { GbpState } from "@/lib/types";
import { Panel } from "./panel";

export function GbpPanel({ state }: { state: GbpState }) {
  if (state.kind === "missing-field") {
    return (
      <Panel eyebrow="Google Business Profile">
        <p className="text-sm leading-relaxed text-paper-dim">
          GBP cadence tracking is not set up yet. Add a date field named
          <span className="mx-1 rounded-sm border border-line bg-ink-2 px-1.5 py-0.5 font-mono text-xs text-paper">
            GBP Posted Date
          </span>
          to the Notion tracker and log the date each GBP post goes live. This
          panel will pick it up automatically.
        </p>
      </Panel>
    );
  }

  if (state.kind === "never-posted") {
    return (
      <Panel eyebrow="Google Business Profile">
        <p className="font-display text-lg font-medium text-paper">
          No GBP posts logged yet
        </p>
        <p className="mt-2 text-sm leading-relaxed text-paper-dim">
          The tracker has a GBP Posted Date field but no dates in it. Google
          rewards weekly posting, so log the first one when it goes live.
        </p>
      </Panel>
    );
  }

  const { daysSince, lastPosted } = state;
  const tone =
    daysSince <= GBP_ON_TRACK_DAYS
      ? { color: "text-good", dot: "bg-good", label: "On cadence" }
      : daysSince <= GBP_SLIPPING_DAYS
        ? { color: "text-warn", dot: "bg-warn", label: "Slipping" }
        : { color: "text-alert", dot: "bg-alert", label: "Overdue" };

  return (
    <Panel eyebrow="Google Business Profile">
      <div className="flex items-baseline gap-3">
        <span className={`font-display text-4xl font-medium ${tone.color}`}>
          {daysSince}
        </span>
        <span className="text-sm text-paper-dim">
          day{daysSince === 1 ? "" : "s"} since the last GBP post
        </span>
      </div>
      <div className="mt-3 flex items-center gap-2 text-xs text-paper-dim">
        <span className={`h-1.5 w-1.5 rounded-full ${tone.dot}`} />
        <span className={`font-medium uppercase tracking-[0.14em] ${tone.color}`}>
          {tone.label}
        </span>
        <span>· last posted {formatDate(lastPosted)}</span>
      </div>
      <p className="mt-3 text-xs leading-relaxed text-paper-faint">
        Google rewards weekly consistency. Aim to post within every{" "}
        {GBP_ON_TRACK_DAYS} days.
      </p>
    </Panel>
  );
}
