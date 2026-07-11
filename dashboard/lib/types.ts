export type PostStatus = "Planned" | "Draft" | "Published";

export type PostRole = "Pillar Page" | "Cluster Post" | "Standalone";

export type Post = {
  id: string;
  title: string;
  slug: string | null;
  dateWritten: string | null;
  topic: string | null;
  city: string | null;
  pillar: string | null;
  role: PostRole;
  status: PostStatus;
  wordCount: number | null;
  publishedUrl: string | null;
  lastRefreshed: string | null;
  gbpPostedDate: string | null;
  /** Link to the row in Notion. Always present. */
  notionUrl: string;
};

export type GbpState =
  | { kind: "missing-field" }
  | { kind: "never-posted" }
  | { kind: "posted"; lastPosted: string; daysSince: number };

export type TrackerData = {
  posts: Post[];
  /** True when the tracker schema has a GBP Posted Date property. */
  hasGbpField: boolean;
};

export type TrackerResult =
  | { ok: true; data: TrackerData }
  | { ok: false; error: string };
