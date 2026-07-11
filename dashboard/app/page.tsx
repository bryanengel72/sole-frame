import { getClientConfig } from "@/lib/config";
import {
  computeGbpState,
  computeTotals,
  nextBestAction,
  resolvePillarNames,
  summarizePillars,
} from "@/lib/insights";
import { fetchTracker } from "@/lib/notion/tracker";
import type { Post } from "@/lib/types";
import { ContentTable } from "./components/content-table";
import { GbpPanel } from "./components/gbp-panel";
import { Header } from "./components/header";
import { NextActionPanel } from "./components/next-action";
import { PillarExposure } from "./components/pillar-exposure";
import { SetupState, ErrorState } from "./components/setup-state";
import { StatStrip } from "./components/stat-strip";

// Always read Notion fresh. The tracker is the single source of truth and
// the dashboard must reflect it on every load.
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const config = getClientConfig();

  const configured = config.hasNotionToken && Boolean(config.notionDatabaseId);
  const result = configured ? await fetchTracker() : null;

  return (
    <div className="mx-auto w-full max-w-6xl flex-1 px-5 py-10 sm:px-8">
      <Header config={config} live={Boolean(result?.ok)} />

      <main className="mt-8 space-y-6">
        {!configured ? (
          <SetupState
            hasToken={config.hasNotionToken}
            hasDatabaseId={Boolean(config.notionDatabaseId)}
          />
        ) : !result || !result.ok ? (
          <ErrorState message={result?.error ?? "Unknown error."} />
        ) : (
          <Dashboard
            posts={result.data.posts}
            hasGbpField={result.data.hasGbpField}
            configuredPillars={config.pillars}
          />
        )}
      </main>

      <footer className="mt-14 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-5 text-[11px] text-paper-faint">
        <span>
          Reads live from the Notion blog tracker. This dashboard never edits
          content.
        </span>
        <span>A Signal Over Noise AI product</span>
      </footer>
    </div>
  );
}

function Dashboard({
  posts,
  hasGbpField,
  configuredPillars,
}: {
  posts: Post[];
  hasGbpField: boolean;
  configuredPillars: string[] | null;
}) {
  const pillarNames = resolvePillarNames(posts, configuredPillars);
  const totals = computeTotals(posts, pillarNames);
  const pillars = summarizePillars(posts, pillarNames);
  const action = nextBestAction(pillars);
  const gbp = computeGbpState(posts, hasGbpField, new Date());

  return (
    <>
      <StatStrip totals={totals} />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <PillarExposure pillars={pillars} />
        </div>
        <div className="space-y-6">
          <NextActionPanel action={action} />
          <GbpPanel state={gbp} />
        </div>
      </div>
      <ContentTable posts={posts} />
    </>
  );
}
