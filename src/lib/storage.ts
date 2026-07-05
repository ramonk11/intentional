import { DEFAULT_SETTINGS } from "./constants";
import type { ActiveSession, AppSettings, ExportData, SessionRecord } from "../types";

const SETTINGS_KEY = "intentie.settings";
const SESSIONS_KEY = "intentie.sessions";
const ACTIVE_SESSION_KEY = "intentie.activeSession";

function safeParse<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function loadSettings(): AppSettings {
  const stored = safeParse<Partial<AppSettings>>(localStorage.getItem(SETTINGS_KEY), {});
  return {
    ...DEFAULT_SETTINGS,
    ...stored
  };
}

export function saveSettings(settings: AppSettings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function loadSessions(): SessionRecord[] {
  const sessions = safeParse<SessionRecord[]>(localStorage.getItem(SESSIONS_KEY), []);
  return Array.isArray(sessions) ? sessions : [];
}

export function saveSessions(sessions: SessionRecord[]) {
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
}

export function addSession(session: SessionRecord): SessionRecord[] {
  const next = [session, ...loadSessions()];
  saveSessions(next);
  return next;
}

export function loadActiveSession(): ActiveSession | null {
  const session = safeParse<ActiveSession | null>(localStorage.getItem(ACTIVE_SESSION_KEY), null);
  if (!session || typeof session.endsAt !== "number") return null;
  return session;
}

export function saveActiveSession(session: ActiveSession | null) {
  if (!session) {
    localStorage.removeItem(ACTIVE_SESSION_KEY);
    return;
  }

  localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify(session));
}

export function resetAllData() {
  localStorage.removeItem(SESSIONS_KEY);
  localStorage.removeItem(ACTIVE_SESSION_KEY);
  saveSettings(DEFAULT_SETTINGS);
}

export function createExportData(settings: AppSettings, sessions: SessionRecord[]): ExportData {
  return {
    exportedAt: new Date().toISOString(),
    settings,
    sessions
  };
}

export function importData(data: Partial<ExportData>) {
  if (data.settings) {
    saveSettings({
      ...DEFAULT_SETTINGS,
      ...data.settings
    });
  }

  if (Array.isArray(data.sessions)) {
    saveSessions(data.sessions);
  }
}
