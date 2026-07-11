/**
 * Per-client configuration. Everything client-specific lives here and is
 * driven by environment variables so a new client is a config change,
 * never a code change.
 */

export type ClientConfig = {
  /** Photographer / studio name shown in the header. */
  clientName: string;
  /** City or market label, shown under the client name. Optional. */
  clientCity: string | null;
  /** Accent color used across the UI. Any valid CSS color. */
  accentColor: string;
  /**
   * The client's five content pillars, in priority order. Used so pillars
   * with zero posts still show up as gaps. If unset, pillars are derived
   * from the Notion data and the denominator defaults to 5.
   */
  pillars: string[] | null;
  /** Notion database id for the blog tracker. */
  notionDatabaseId: string | null;
  /** Whether the server-side Notion token is present. Never the token itself. */
  hasNotionToken: boolean;
  /**
   * Serves built-in sample content instead of reading Notion. For sales demos
   * and client previews before a tracker is connected. Never reads or needs
   * NOTION_TOKEN when true.
   */
  demoMode: boolean;
};

export function getClientConfig(): ClientConfig {
  const pillarsRaw = process.env.CLIENT_PILLARS ?? "";
  const pillars = pillarsRaw
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);

  return {
    clientName: process.env.CLIENT_NAME?.trim() || "Sole Frame Client",
    clientCity: process.env.CLIENT_CITY?.trim() || null,
    accentColor: process.env.CLIENT_ACCENT?.trim() || "#00e5ff",
    pillars: pillars.length > 0 ? pillars : null,
    notionDatabaseId: process.env.NOTION_BLOG_DB_ID?.trim() || null,
    hasNotionToken: Boolean(process.env.NOTION_TOKEN?.trim()),
    demoMode: process.env.DASHBOARD_DEMO_MODE?.trim().toLowerCase() === "true",
  };
}

/** How many pillars the content engine plans around. */
export const PILLAR_TARGET = 5;

/** Clusters required before a pillar page should land. */
export const CLUSTERS_PER_PILLAR = 3;

/** GBP cadence thresholds, in days since the last posted GBP update. */
export const GBP_ON_TRACK_DAYS = 7;
export const GBP_SLIPPING_DAYS = 14;
