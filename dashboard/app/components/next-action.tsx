import type { NextAction } from "@/lib/insights";
import { Panel } from "./panel";

export function NextActionPanel({ action }: { action: NextAction | null }) {
  if (!action) return null;
  return (
    <Panel eyebrow="Next best action">
      <p className="font-display text-lg font-medium leading-snug text-paper">
        <span className="mr-2 inline-block h-2 w-2 -translate-y-px rotate-45 bg-signal" />
        {action.headline}
      </p>
      {action.detail ? (
        <p className="mt-2.5 text-sm leading-relaxed text-paper-dim">
          {action.detail}
        </p>
      ) : null}
    </Panel>
  );
}
