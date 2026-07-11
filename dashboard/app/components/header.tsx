import type { ClientConfig } from "@/lib/config";

export function Header({
  config,
  live,
  demo = false,
}: {
  config: ClientConfig;
  live: boolean;
  demo?: boolean;
}) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-6">
      <div>
        <div className="mb-2 flex items-center gap-2.5">
          <span className="relative block h-3 w-3 border border-signal">
            <span className="absolute -right-1 -bottom-1 h-3 w-3 border border-signal/40" />
          </span>
          <span className="text-[11px] font-medium uppercase tracking-[0.26em] text-paper-dim">
            Content Engine Performance
          </span>
          {demo ? (
            <span className="rounded-full border border-warn/40 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.14em] text-warn">
              Preview · sample data
            </span>
          ) : null}
        </div>
        <h1 className="font-display text-3xl font-medium tracking-tight text-paper sm:text-4xl">
          {config.clientName}
        </h1>
        {config.clientCity ? (
          <p className="mt-1 text-sm text-paper-faint">{config.clientCity}</p>
        ) : null}
      </div>
      {demo ? null : (
        <div className="flex items-center gap-2 pb-1 text-xs text-paper-dim">
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              live
                ? "bg-signal shadow-[0_0_6px_var(--signal)]"
                : "bg-paper-faint"
            }`}
          />
          {live ? "Live from Notion" : "Waiting for Notion"}
        </div>
      )}
    </header>
  );
}
