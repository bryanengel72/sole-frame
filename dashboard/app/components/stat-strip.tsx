import type { Totals } from "@/lib/insights";
import { formatNumber } from "@/lib/format";

function Stat({
  label,
  value,
  sub,
  accent = false,
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-sm border border-line bg-panel px-5 py-4">
      <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-paper-faint">
        {label}
      </div>
      <div
        className={`mt-1.5 font-display text-[28px] font-medium leading-none tracking-tight ${
          accent ? "text-signal" : "text-paper"
        }`}
      >
        {value}
      </div>
      {sub ? <div className="mt-1.5 text-xs text-paper-dim">{sub}</div> : null}
    </div>
  );
}

export function StatStrip({ totals }: { totals: Totals }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      <Stat label="Total posts" value={formatNumber(totals.total)} />
      <Stat
        label="Published"
        value={formatNumber(totals.published)}
        accent
      />
      <Stat label="Drafts" value={formatNumber(totals.draft)} />
      <Stat label="Planned" value={formatNumber(totals.planned)} />
      <Stat
        label="Avg word count"
        value={
          totals.avgWordCount != null
            ? formatNumber(totals.avgWordCount)
            : "n/a"
        }
        sub={totals.avgWordCount == null ? "No word counts logged" : undefined}
      />
      <Stat
        label="Pillars touched"
        value={`${totals.pillarsTouched} of ${totals.pillarTarget}`}
      />
    </div>
  );
}
