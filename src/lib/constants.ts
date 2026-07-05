import type { AppSettings } from "../types";

export const INTENT_OPTIONS = [
  "Bericht sturen",
  "Iets opzoeken",
  "Navigatie",
  "Muziek",
  "Werk",
  "Social media",
  "Datingapp",
  "Scrollen",
  "Anders"
];

export const DURATION_OPTIONS = [
  { label: "20 sec", seconds: 20 },
  { label: "2 min", seconds: 2 * 60 },
  { label: "5 min", seconds: 5 * 60 },
  { label: "10 min", seconds: 10 * 60 },
  { label: "20 min", seconds: 20 * 60 },
  { label: "30 min", seconds: 30 * 60 },
  { label: "60 min", seconds: 60 * 60 }
];

export const DEFAULT_SETTINGS: AppSettings = {
  defaultMinutes: 10,
  theme: "dark",
  onboardingDone: false,
  notificationsEnabled: false
};
