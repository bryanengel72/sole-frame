const DATE_FORMAT = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

/** Format an ISO date string like "Mar 4, 2026". Returns null when absent. */
export function formatDate(iso: string | null): string | null {
  if (!iso) return null;
  const date = new Date(iso.length === 10 ? `${iso}T00:00:00Z` : iso);
  if (Number.isNaN(date.getTime())) return null;
  return DATE_FORMAT.format(date);
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat("en-US").format(n);
}
