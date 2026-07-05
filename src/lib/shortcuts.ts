import type { ActiveSession } from "../types";

export function buildShortcutPayload(session: ActiveSession) {
  const returnUrl = new URL(window.location.href);
  returnUrl.search = "";
  returnUrl.hash = "";

  return {
    seconds: Math.max(1, Math.round((session.endsAt - session.startedAt) / 1000)),
    intent: session.intent,
    returnUrl: returnUrl.toString()
  };
}

export function runReturnShortcut(session: ActiveSession, shortcutName: string) {
  const payload = JSON.stringify(buildShortcutPayload(session));
  const shortcutUrl = new URL("shortcuts://run-shortcut");
  shortcutUrl.searchParams.set("name", shortcutName.trim() || "Intentie Timer");
  shortcutUrl.searchParams.set("input", "text");
  shortcutUrl.searchParams.set("text", payload);

  window.location.href = shortcutUrl.toString();
}
