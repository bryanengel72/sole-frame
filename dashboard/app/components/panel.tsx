import type { ReactNode } from "react";

export function Panel({
  eyebrow,
  title,
  children,
  className = "",
}: {
  eyebrow?: string;
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`relative rounded-sm border border-line bg-panel p-6 sm:p-7 ${className}`}
    >
      <span
        aria-hidden
        className="absolute -top-px -left-px h-3.5 w-3.5 border-t border-l border-signal/60"
      />
      <span
        aria-hidden
        className="absolute -bottom-px -right-px h-3.5 w-3.5 border-b border-r border-signal/60"
      />
      {eyebrow ? (
        <div className="mb-1 flex items-center gap-2.5">
          <span className="h-px w-6 bg-signal/60" />
          <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-paper-dim">
            {eyebrow}
          </span>
        </div>
      ) : null}
      {title ? (
        <h2 className="font-display text-xl font-medium tracking-tight text-paper">
          {title}
        </h2>
      ) : null}
      <div className={eyebrow || title ? "mt-5" : ""}>{children}</div>
    </section>
  );
}
