import type { SessionRecord } from "../types";

export function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("nl-NL", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

export function isToday(value: string) {
  const date = new Date(value);
  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}

export function mostChosen(sessions: SessionRecord[], key: "intent" | "reason") {
  if (!sessions.length) return "Nog geen data";

  const counts = sessions.reduce<Record<string, number>>((acc, session) => {
    acc[session[key]] = (acc[session[key]] ?? 0) + 1;
    return acc;
  }, {});

  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "Nog geen data";
}

export function minutesLabel(minutes: number) {
  return `${Math.round(minutes)} min`;
}
