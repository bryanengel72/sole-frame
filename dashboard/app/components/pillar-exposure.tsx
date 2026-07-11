import { CLUSTERS_PER_PILLAR } from "@/lib/config";
import type { PillarSummary } from "@/lib/insights";
import { Panel } from "./panel";

const STATE_LABEL: Record<PillarSummary["state"], string> = {
  built: "Built",
  "ready-for-pillar-page": "Ready for its pillar page",
  "needs-clusters": "Needs more clusters",
  building: "Building",
  untouched: "Not started",
};

const STATE_TONE: Record<PillarSummary["state"], string> = {
  built: "border-good/40 text-good",
  "ready-for-pillar-page": "border-signal/50 text-signal",
  "needs-clusters": "border-warn/40 text-warn",
  building: "border-line-strong text-paper-dim",
  untouched: "border-line text-paper-faint",
};

function ClusterBar({ pillar }: { pillar: PillarSummary }) {
  const slots = Math.max(CLUSTERS_PER_PILLAR, pillar.clusterCount);
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex flex-1 gap-1">
        {Array.from({ length: slots }, (_, i) => {
          const filled = i < pillar.clusterCount;
          const published = i < pillar.publishedClusterCount;
          return (
            <div
              key={i}
              className={`h-2 flex-1 rounded-[1px] ${
                published
                  ? "bg-signal"
                  : filled
                    ? "bg-signal/35"
                    : "bg-paper/[0.06]"
              }`}
            />
          );
        })}
      </div>
      <div
        title={
          pillar.pillarPagePublished
            ? "Pillar page published"
            : pillar.hasPillarPage
              ? "Pillar page drafted, not published"
              : "No pillar page yet"
        }
        className={`h-3 w-3 rotate-45 rounded-[1px] border ${
          pillar.pillarPagePublished
            ? "border-signal bg-signal"
            : pillar.hasPillarPage
              ? "border-signal/70 bg-signal/20"
              : "border-paper/20 bg-transparent"
        }`}
      />
    </div>
  );
}

export function PillarExposure({ pillars }: { pillars: PillarSummary[] }) {
  return (
    <Panel eyebrow="Exposure by pillar" title="Where the content stands">
      {pillars.length === 0 ? (
        <p className="text-sm text-paper-dim">
          No pillars found yet. Set CLIENT_PILLARS in config or add a Pillar
          value to posts in the tracker.
        </p>
      ) : (
        <ul className="space-y-5">
          {pillars.map((pillar) => (
            <li key={pillar.name}>
              <div className="mb-2 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <div className="flex items-baseline gap-2.5">
                  <span className="font-display text-[15px] font-medium text-paper">
                    {pillar.name}
                  </span>
                  {pillar.isThinnest ? (
                    <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-warn">
                      Thinnest
                    </span>
                  ) : null}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-paper-dim">
                    {pillar.clusterCount} cluster
                    {pillar.clusterCount === 1 ? "" : "s"}
                    {" · "}
                    {pillar.pillarPagePublished
                      ? "pillar page live"
                      : pillar.hasPillarPage
                        ? "pillar page drafted"
                        : "no pillar page"}
                  </span>
                  <span
                    className={`rounded-full border px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.14em] ${STATE_TONE[pillar.state]}`}
                  >
                    {STATE_LABEL[pillar.state]}
                  </span>
                </div>
              </div>
              <ClusterBar pillar={pillar} />
            </li>
          ))}
        </ul>
      )}
      <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-1.5 border-t border-line pt-4 text-[11px] text-paper-faint">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-4 rounded-[1px] bg-signal" /> Published
          cluster
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-4 rounded-[1px] bg-signal/35" /> Cluster in
          progress
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rotate-45 rounded-[1px] border border-signal bg-signal" />{" "}
          Pillar page live
        </span>
        <span>
          A pillar is built at {CLUSTERS_PER_PILLAR}+ clusters plus a published
          pillar page. The thinnest pillar is flagged, but the next move
          depends on business priority, not just the lowest count.
        </span>
      </div>
    </Panel>
  );
}
