import "server-only";
import { Client } from "@notionhq/client";
import { findProperty } from "./fields";
import type { Post, PostRole, PostStatus, TrackerResult } from "../types";

/**
 * Read-only adapter over the client's Notion blog tracker. The Notion token
 * never leaves the server: this module is server-only and nothing in it is
 * ever serialized to the browser except the normalized Post rows.
 */

// Notion property values arrive loosely typed; each extractor tolerates
// missing properties, wrong types, and empty values.
type AnyProp = { type?: string; [key: string]: unknown } | null | undefined;

function plainText(prop: AnyProp): string | null {
  if (!prop) return null;
  const parts =
    (prop.type === "title" && prop.title) ||
    (prop.type === "rich_text" && prop.rich_text);
  if (!Array.isArray(parts)) return null;
  const text = parts.map((p) => p?.plain_text ?? "").join("").trim();
  return text || null;
}

function selectName(prop: AnyProp): string | null {
  if (!prop) return null;
  if (prop.type === "select") {
    const sel = prop.select as { name?: string } | null;
    return sel?.name?.trim() || null;
  }
  if (prop.type === "status") {
    const st = prop.status as { name?: string } | null;
    return st?.name?.trim() || null;
  }
  return plainText(prop);
}

function dateStart(prop: AnyProp): string | null {
  if (!prop) return null;
  if (prop.type === "date") {
    const d = prop.date as { start?: string } | null;
    return d?.start || null;
  }
  return null;
}

function numberValue(prop: AnyProp): number | null {
  if (!prop) return null;
  if (prop.type === "number" && typeof prop.number === "number") {
    return prop.number;
  }
  return null;
}

function urlValue(prop: AnyProp): string | null {
  if (!prop) return null;
  if (prop.type === "url" && typeof prop.url === "string" && prop.url.trim()) {
    return prop.url.trim();
  }
  return plainText(prop);
}

function normalizeStatus(raw: string | null): PostStatus {
  const v = (raw ?? "").toLowerCase();
  if (["published", "live", "done"].some((s) => v.includes(s))) {
    return "Published";
  }
  if (["draft", "writing", "in progress", "review", "editing"].some((s) => v.includes(s))) {
    return "Draft";
  }
  return "Planned";
}

function normalizeRole(raw: string | null): PostRole {
  const v = (raw ?? "").toLowerCase();
  if (v.includes("pillar")) return "Pillar Page";
  if (v.includes("cluster")) return "Cluster Post";
  return "Standalone";
}

type NotionPage = {
  object?: string;
  id: string;
  url?: string;
  properties?: Record<string, AnyProp>;
};

function toPost(page: NotionPage): Post {
  const props = page.properties ?? {};
  return {
    id: page.id,
    title: plainText(findProperty(props, "title")) ?? "Untitled post",
    slug: plainText(findProperty(props, "slug")),
    dateWritten: dateStart(findProperty(props, "dateWritten")),
    topic: plainText(findProperty(props, "topic")),
    city: selectName(findProperty(props, "city")),
    pillar: selectName(findProperty(props, "pillar")),
    role: normalizeRole(selectName(findProperty(props, "role"))),
    status: normalizeStatus(selectName(findProperty(props, "status"))),
    wordCount: numberValue(findProperty(props, "wordCount")),
    publishedUrl: urlValue(findProperty(props, "publishedUrl")),
    lastRefreshed: dateStart(findProperty(props, "lastRefreshed")),
    gbpPostedDate: dateStart(findProperty(props, "gbpPostedDate")),
    notionUrl: page.url ?? `https://notion.so/${page.id.replace(/-/g, "")}`,
  };
}

/**
 * The env var may hold a database id (which owns one or more data sources)
 * or a data source id directly. Resolve to a queryable data source id.
 */
async function resolveDataSourceId(
  notion: Client,
  configuredId: string
): Promise<string> {
  try {
    const db = (await notion.databases.retrieve({
      database_id: configuredId,
    })) as { data_sources?: Array<{ id: string }> };
    const first = db.data_sources?.[0]?.id;
    if (first) return first;
  } catch {
    // Not a database id. Fall through and try it as a data source id.
  }
  return configuredId;
}

export async function fetchTracker(): Promise<TrackerResult> {
  const token = process.env.NOTION_TOKEN?.trim();
  const databaseId = process.env.NOTION_BLOG_DB_ID?.trim();
  if (!token || !databaseId) {
    return {
      ok: false,
      error: "Notion connection is not configured yet.",
    };
  }

  // NOTION_API_BASE_URL is a test seam: local runs can point the client at
  // a mock Notion API. Unset in real deployments.
  const notion = new Client({
    auth: token,
    ...(process.env.NOTION_API_BASE_URL
      ? { baseUrl: process.env.NOTION_API_BASE_URL }
      : {}),
  });

  try {
    const dataSourceId = await resolveDataSourceId(notion, databaseId);

    const pages: NotionPage[] = [];
    let cursor: string | undefined = undefined;
    do {
      const res = (await notion.dataSources.query({
        data_source_id: dataSourceId,
        start_cursor: cursor,
        page_size: 100,
      })) as {
        results: NotionPage[];
        has_more: boolean;
        next_cursor: string | null;
      };
      pages.push(...res.results.filter((r) => r.object === "page"));
      cursor = res.has_more && res.next_cursor ? res.next_cursor : undefined;
    } while (cursor);

    // The GBP panel needs to know whether the schema has the field at all,
    // not just whether any row filled it in. Ask the data source for its
    // schema; if that call is unavailable, fall back to checking pages,
    // which carry every schema property even when empty.
    let hasGbpField = false;
    try {
      const ds = (await notion.dataSources.retrieve({
        data_source_id: dataSourceId,
      })) as { properties?: Record<string, AnyProp> };
      hasGbpField = findProperty(ds.properties ?? {}, "gbpPostedDate") !== null;
    } catch {
      hasGbpField = pages.some(
        (p) => findProperty(p.properties ?? {}, "gbpPostedDate") !== null
      );
    }

    return { ok: true, data: { posts: pages.map(toPost), hasGbpField } };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unknown error talking to Notion.";
    return { ok: false, error: message };
  }
}
