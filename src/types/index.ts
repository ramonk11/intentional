export type ThemeMode = "dark" | "light";

export type AppSettings = {
  defaultMinutes: number;
  theme: ThemeMode;
  onboardingDone: boolean;
};

export type SessionRecord = {
  id: string;
  startedAt: string;
  endedAt: string;
  intent: string;
  reason: string;
  plannedMinutes: number;
  actualMinutes: number;
  completed: boolean;
  extended: boolean;
  extensions: number;
};

export type ActiveSession = {
  id: string;
  startedAt: number;
  endsAt: number;
  originalMinutes: number;
  intent: string;
  reason: string;
  extensions: number;
};

export type IntentDraft = {
  intent: string;
  reason: string;
  minutes: number;
};

export type ExportData = {
  exportedAt: string;
  settings: AppSettings;
  sessions: SessionRecord[];
};
