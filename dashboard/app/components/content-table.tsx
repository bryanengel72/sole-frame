import { formatDate, formatNumber } from "@/lib/format";
import type { Post, PostStatus } from "@/lib/types";
import { Panel } from "./panel";

const STATUS_TONE: Record<PostStatus, string> = {
  Published: "border-signal/50 text-signal",
  Draft: "border-warn/40 text-warn",
  Planned: "border-line-strong text-paper-dim",
};

function LinkOut({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-xs font-medium text-paper-dim transition-colors hover:text-signal"
    >
      {children}
      <svg
        aria-hidden
        viewBox="0 0 12 12"
        className="h-2.5 w-2.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
      >
        <path d="M3.5 8.5 8.5 3.5M4.5 3.5h4v4" />
      </svg>
    </a>
  );
}

export function ContentTable({ posts }: { posts: Post[] }) {
  const sorted = [...posts].sort((a, b) => {
    const da = a.dateWritten ?? "";
    const db = b.dateWritten ?? "";
    return db.localeCompare(da) || a.title.localeCompare(b.title);
  });

  return (
    <Panel
      eyebrow="Content list"
      title={`All posts (${posts.length})`}
      className="overflow-hidden"
    >
      {sorted.length === 0 ? (
        <p className="text-sm text-paper-dim">
          The tracker is empty. Posts will appear here as soon as they are
          added in Notion.
        </p>
      ) : (
        <div className="-mx-6 overflow-x-auto px-6 sm:-mx-7 sm:px-7">
          <table className="w-full min-w-[760px] border-collapse text-left">
            <thead>
              <tr className="border-b border-line-strong text-[10px] font-medium uppercase tracking-[0.18em] text-paper-faint">
                <th className="py-2.5 pr-4 font-medium">Post</th>
                <th className="py-2.5 pr-4 font-medium">Pillar</th>
                <th className="py-2.5 pr-4 font-medium">Role</th>
                <th className="py-2.5 pr-4 font-medium">Status</th>
                <th className="py-2.5 pr-4 text-right font-medium">Words</th>
                <th className="py-2.5 pr-4 font-medium">Date</th>
                <th className="py-2.5 font-medium">Links</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((post) => (
                <tr
                  key={post.id}
                  className="border-b border-line last:border-b-0 hover:bg-paper/[0.02]"
                >
                  <td className="max-w-[280px] py-3 pr-4">
                    <div className="truncate text-sm font-medium text-paper">
                      {post.title}
                    </div>
                    {post.topic ? (
                      <div className="mt-0.5 truncate text-xs text-paper-faint">
                        {post.topic}
                        {post.city ? ` · ${post.city}` : ""}
                      </div>
                    ) : post.city ? (
                      <div className="mt-0.5 text-xs text-paper-faint">
                        {post.city}
                      </div>
                    ) : null}
                  </td>
                  <td className="py-3 pr-4 text-sm text-paper-dim">
                    {post.pillar ?? (
                      <span className="text-paper-faint">Unassigned</span>
                    )}
                  </td>
                  <td className="py-3 pr-4 text-xs text-paper-dim">
                    {post.role}
                  </td>
                  <td className="py-3 pr-4">
                    <span
                      className={`inline-block rounded-full border px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.14em] ${STATUS_TONE[post.status]}`}
                    >
                      {post.status}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-right text-sm tabular-nums text-paper-dim">
                    {post.wordCount != null
                      ? formatNumber(post.wordCount)
                      : "·"}
                  </td>
                  <td className="py-3 pr-4 text-xs whitespace-nowrap text-paper-dim">
                    {formatDate(post.dateWritten) ?? (
                      <span className="text-paper-faint">Undated</span>
                    )}
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-4 whitespace-nowrap">
                      <LinkOut href={post.notionUrl}>Notion</LinkOut>
                      {post.publishedUrl ? (
                        <LinkOut href={post.publishedUrl}>Live post</LinkOut>
                      ) : (
                        <span className="text-xs text-paper-faint">
                          Not live yet
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Panel>
  );
}
