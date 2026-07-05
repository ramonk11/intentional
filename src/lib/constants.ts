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

export const DURATION_OPTIONS = [2, 5, 10, 20, 30, 60];

export const DEFAULT_SETTINGS: AppSettings = {
  defaultMinutes: 10,
  theme: "dark",
  onboardingDone: false,
  notificationsEnabled: false
};
