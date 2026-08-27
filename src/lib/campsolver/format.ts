export function formatDate(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatHours(hours?: number | null) {
  if (hours === undefined || hours === null || Number.isNaN(hours)) return "—";
  if (hours < 24) return `${Math.round(hours)}h`;
  const days = hours / 24;
  return `${days.toFixed(days < 10 ? 1 : 0)} days`;
}

export function formatNumber(value?: number | null) {
  if (value === undefined || value === null || Number.isNaN(value)) return "—";
  return value.toLocaleString();
}
