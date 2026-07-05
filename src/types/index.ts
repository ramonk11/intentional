export type ThemeMode = "dark" | "light";

export type AppSettings = {
  defaultMinutes: number;
  theme: ThemeMode;
  onboardingDone: boolean;
  notificationsEnabled: boolean;
  shortcutReturnEnabled: boolean;
  shortcutName: string;
};

export type SessionRecord = {
  id: string;
  startedAt: string;
  endedAt: string;
  intent: string;
  reason: string;
  plannedMinutes: number;
  plannedSeconds?: number;
  actualMinutes: number;
  actualSeconds?: number;
  completed: boolean;
  extended: boolean;
  extensions: number;
};

export type ActiveSession = {
  id: string;
  startedAt: number;
  endsAt: number;
  originalMinutes: number;
  originalSeconds: number;
  intent: string;
  reason: string;
  extensions: number;
  notifiedAt?: number;
};

export type IntentDraft = {
  intent: string;
  reason: string;
  minutes: number;
  durationSeconds: number;
};

export type ExportData = {
  exportedAt: string;
  settings: AppSettings;
  sessions: SessionRecord[];
};
