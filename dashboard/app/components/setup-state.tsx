import { Panel } from "./panel";

export function SetupState({
  hasToken,
  hasDatabaseId,
}: {
  hasToken: boolean;
  hasDatabaseId: boolean;
}) {
  return (
    <Panel eyebrow="Setup required" title="Connect the Notion tracker">
      <p className="text-sm leading-relaxed text-paper-dim">
        This dashboard reads live from the client&apos;s Notion blog tracker.
        Two environment variables are needed before it can load:
      </p>
      <ul className="mt-4 space-y-3">
        <li className="flex items-start gap-3">
          <StatusDot ok={hasToken} />
          <div>
            <code className="rounded-sm border border-line bg-ink-2 px-1.5 py-0.5 font-mono text-xs text-paper">
              NOTION_TOKEN
            </code>
            <p className="mt-1 text-xs leading-relaxed text-paper-faint">
              The internal integration token. Server side only, never shipped
              to the browser.
            </p>
          </div>
        </li>
        <li className="flex items-start gap-3">
          <StatusDot ok={hasDatabaseId} />
          <div>
            <code className="rounded-sm border border-line bg-ink-2 px-1.5 py-0.5 font-mono text-xs text-paper">
              NOTION_BLOG_DB_ID
            </code>
            <p className="mt-1 text-xs leading-relaxed text-paper-faint">
              The id of the client&apos;s blog tracker database. Remember to
              share the database with the integration inside Notion.
            </p>
          </div>
        </li>
      </ul>
      <p className="mt-5 border-t border-line pt-4 text-xs text-paper-faint">
        Copy .env.example to .env.local, fill in both values, and restart the
        server.
      </p>
    </Panel>
  );
}

export function ErrorState({ message }: { message: string }) {
  return (
    <Panel eyebrow="Connection problem" title="Could not read the tracker">
      <p className="text-sm leading-relaxed text-paper-dim">
        The Notion API returned an error while loading the blog tracker:
      </p>
      <p className="mt-3 rounded-sm border border-alert/30 bg-alert/5 px-4 py-3 font-mono text-xs leading-relaxed text-alert">
        {message}
      </p>
      <ul className="mt-4 list-disc space-y-1.5 pl-5 text-xs leading-relaxed text-paper-faint">
        <li>Check that NOTION_TOKEN is valid and not expired.</li>
        <li>
          Check that the tracker database is shared with the integration in
          Notion (Connections menu on the database page).
        </li>
        <li>Check that NOTION_BLOG_DB_ID matches the tracker database.</li>
      </ul>
    </Panel>
  );
}

function StatusDot({ ok }: { ok: boolean }) {
  return (
    <span
      className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
        ok ? "bg-good" : "bg-alert"
      }`}
      title={ok ? "Configured" : "Missing"}
    />
  );
}
