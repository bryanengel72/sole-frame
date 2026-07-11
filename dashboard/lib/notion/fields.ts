/**
 * The single place field names are mapped. Client trackers vary slightly in
 * property naming, so every logical field lists the names it may appear
 * under, checked in order. Add aliases here, never in the reading code.
 */

export type LogicalField =
  | "title"
  | "slug"
  | "dateWritten"
  | "topic"
  | "city"
  | "pillar"
  | "role"
  | "status"
  | "wordCount"
  | "publishedUrl"
  | "lastRefreshed"
  | "gbpPostedDate";

export const FIELD_ALIASES: Record<LogicalField, string[]> = {
  title: ["Title", "Name", "Post Title"],
  slug: ["URL Slug", "Slug"],
  dateWritten: ["Date Written", "Date", "Written On"],
  topic: ["Topic / Keyword", "Topic/Keyword", "Topic", "Keyword"],
  city: ["City / Market", "City/Market", "City", "Market"],
  pillar: ["Pillar", "Content Pillar", "Parent Pillar"],
  role: ["Post Role", "Post Type", "Role"],
  status: ["Status"],
  wordCount: ["Word Count", "Words"],
  publishedUrl: ["Published URL", "Live URL", "Post URL"],
  lastRefreshed: ["Last Refreshed", "Refreshed"],
  gbpPostedDate: ["GBP Posted Date", "GBP Posted", "GBP Post Date"],
};

/** Case-insensitive lookup of a logical field inside a Notion properties bag. */
export function findProperty<T>(
  properties: Record<string, T>,
  field: LogicalField
): T | null {
  const keysByLower = new Map(
    Object.keys(properties).map((k) => [k.toLowerCase(), k])
  );
  for (const alias of FIELD_ALIASES[field]) {
    const actual = keysByLower.get(alias.toLowerCase());
    if (actual !== undefined) return properties[actual];
  }
  return null;
}
