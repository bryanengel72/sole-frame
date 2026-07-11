import { CLUSTERS_PER_PILLAR, PILLAR_TARGET } from "./config";
import type { GbpState, Post } from "./types";

export type Totals = {
  total: number;
  planned: number;
  draft: number;
  published: number;
  avgWordCount: number | null;
  pillarsTouched: number;
  pillarTarget: number;
};

export type PillarState =
  | "built"
  | "ready-for-pillar-page"
  | "needs-clusters"
  | "building"
  | "untouched";

export type PillarSummary = {
  name: string;
  clusterCount: number;
  publishedClusterCount: number;
  hasPillarPage: boolean;
  pillarPagePublished: boolean;
  totalPosts: number;
  state: PillarState;
  flag: string | null;
  isThinnest: boolean;
};

export function computeTotals(posts: Post[], pillarNames: string[]): Totals {
  const counted = posts.filter((p) => p.wordCount != null && p.wordCount > 0);
  const avg =
    counted.length > 0
      ? Math.round(
          counted.reduce((sum, p) => sum + (p.wordCount ?? 0), 0) /
            counted.length
        )
      : null;

  const touched = new Set(
    posts.map((p) => p.pillar).filter((p): p is string => Boolean(p))
  );

  return {
    total: posts.length,
    planned: posts.filter((p) => p.status === "Planned").length,
    draft: posts.filter((p) => p.status === "Draft").length,
    published: posts.filter((p) => p.status === "Published").length,
    avgWordCount: avg,
    pillarsTouched: touched.size,
    pillarTarget: Math.max(pillarNames.length, touched.size, PILLAR_TARGET),
  };
}

/**
 * The pillar list to display: configured pillars first (so zero-post pillars
 * still show as gaps), then any pillar found in the data that config missed.
 */
export function resolvePillarNames(
  posts: Post[],
  configured: string[] | null
): string[] {
  const names = [...(configured ?? [])];
  const seen = new Set(names.map((n) => n.toLowerCase()));
  for (const post of posts) {
    if (post.pillar && !seen.has(post.pillar.toLowerCase())) {
      names.push(post.pillar);
      seen.add(post.pillar.toLowerCase());
    }
  }
  return names;
}

export function summarizePillars(
  posts: Post[],
  pillarNames: string[]
): PillarSummary[] {
  const summaries = pillarNames.map((name) => {
    const mine = posts.filter(
      (p) => p.pillar?.toLowerCase() === name.toLowerCase()
    );
    const clusters = mine.filter((p) => p.role === "Cluster Post");
    const pillarPages = mine.filter((p) => p.role === "Pillar Page");
    const clusterCount = clusters.length;
    const hasPillarPage = pillarPages.length > 0;
    const pillarPagePublished = pillarPages.some(
      (p) => p.status === "Published"
    );

    let state: PillarState;
    let flag: string | null = null;
    if (mine.length === 0) {
      state = "untouched";
    } else if (pillarPagePublished && clusterCount >= CLUSTERS_PER_PILLAR) {
      state = "built";
    } else if (clusterCount >= CLUSTERS_PER_PILLAR && !hasPillarPage) {
      state = "ready-for-pillar-page";
      flag = "Ready for its pillar page";
    } else if (hasPillarPage && clusterCount < CLUSTERS_PER_PILLAR) {
      state = "needs-clusters";
      flag = "Needs more clusters";
    } else {
      state = "building";
    }

    return {
      name,
      clusterCount,
      publishedClusterCount: clusters.filter((p) => p.status === "Published")
        .length,
      hasPillarPage,
      pillarPagePublished,
      totalPosts: mine.length,
      state,
      flag,
      isThinnest: false,
    };
  });

  // Highlight the thinnest pillar: fewest total posts, ties broken by
  // fewest clusters. The next-move copy notes this is a signal, not an
  // order, since priority is a business call.
  const candidates = [...summaries].sort(
    (a, b) => a.totalPosts - b.totalPosts || a.clusterCount - b.clusterCount
  );
  const thinnest = candidates[0];
  if (thinnest && summaries.length > 1) {
    thinnest.isThinnest = true;
  }

  return summaries;
}

export type NextAction = {
  headline: string;
  detail: string | null;
};

/**
 * Publishing strategy: clusters land first, then the pillar page on top.
 * Build one pillar to depth before spreading across all five.
 */
export function nextBestAction(summaries: PillarSummary[]): NextAction | null {
  const touched = summaries.filter((s) => s.state !== "untouched");
  if (touched.length === 0) {
    return {
      headline: "Plan the first cluster post.",
      detail:
        "Nothing is in the tracker yet. Pick the highest priority pillar and plan its first cluster.",
    };
  }

  // 1. A pillar with enough clusters and no pillar page is the clearest win.
  const ready = touched
    .filter((s) => s.state === "ready-for-pillar-page")
    .sort((a, b) => b.clusterCount - a.clusterCount)[0];
  if (ready) {
    return {
      headline: `${ready.name} has ${ready.clusterCount} cluster${
        ready.clusterCount === 1 ? "" : "s"
      } and no pillar page. Write the pillar page next.`,
      detail:
        "Clusters are in place. The pillar page lands on top of them and ties the topic together.",
    };
  }

  // 2. A pillar page waiting on clusters needs support before anything new.
  const needsClusters = touched
    .filter((s) => s.state === "needs-clusters")
    .sort((a, b) => b.clusterCount - a.clusterCount)[0];
  if (needsClusters) {
    const gap = Math.max(CLUSTERS_PER_PILLAR - needsClusters.clusterCount, 1);
    return {
      headline: `${needsClusters.name} has a pillar page but only ${
        needsClusters.clusterCount
      } cluster${
        needsClusters.clusterCount === 1 ? "" : "s"
      }. Write ${gap} more cluster${gap === 1 ? "" : "s"} to support it.`,
      detail:
        "A pillar page without clusters underneath it has nothing to rank with. Backfill the clusters first.",
    };
  }

  // 3. Deepen the in-progress pillar closest to the cluster threshold.
  const building = touched
    .filter((s) => s.state === "building")
    .sort((a, b) => b.clusterCount - a.clusterCount)[0];
  if (building) {
    const gap = CLUSTERS_PER_PILLAR - building.clusterCount;
    return {
      headline: `${building.name} has ${building.clusterCount} cluster${
        building.clusterCount === 1 ? "" : "s"
      }. Build it out before starting a new pillar.`,
      detail: `${gap} more cluster${
        gap === 1 ? "" : "s"
      } and it is ready for its pillar page. Depth beats breadth.`,
    };
  }

  // 4. A built pillar whose page is still unpublished just needs the button.
  const unpublished = touched.find(
    (s) =>
      s.hasPillarPage &&
      !s.pillarPagePublished &&
      s.clusterCount >= CLUSTERS_PER_PILLAR
  );
  if (unpublished) {
    return {
      headline: `${unpublished.name} is fully drafted. Publish its pillar page.`,
      detail: "The clusters are there and the page is written. Ship it.",
    };
  }

  // 5. Everything touched is built. Open the next pillar.
  const untouched = summaries.find((s) => s.state === "untouched");
  if (untouched) {
    return {
      headline: `Every active pillar is built. Start ${untouched.name} next.`,
      detail:
        "Which pillar to open is a business priority call. This is the first untouched one in your configured order.",
    };
  }

  return {
    headline: "All five pillars are built. Shift to refreshing older posts.",
    detail:
      "Check the Last Refreshed column and update the oldest published posts first.",
  };
}

export function computeGbpState(
  posts: Post[],
  hasGbpField: boolean,
  now: Date
): GbpState {
  if (!hasGbpField) return { kind: "missing-field" };

  const dates = posts
    .map((p) => p.gbpPostedDate)
    .filter((d): d is string => Boolean(d))
    .map((d) => new Date(d))
    .filter((d) => !Number.isNaN(d.getTime()));

  if (dates.length === 0) return { kind: "never-posted" };

  const last = dates.reduce((a, b) => (a > b ? a : b));
  const daysSince = Math.max(
    0,
    Math.floor((now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24))
  );
  return {
    kind: "posted",
    lastPosted: last.toISOString().slice(0, 10),
    daysSince,
  };
}
