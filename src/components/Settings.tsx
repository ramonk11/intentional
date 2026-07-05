import { useRef } from "react";
import { createExportData } from "../lib/storage";
import { getNotificationStatus } from "../lib/notifications";
import type { AppSettings, SessionRecord, ThemeMode } from "../types";

type SettingsProps = {
  settings: AppSettings;
  sessions: SessionRecord[];
  onSettingsChange: (settings: AppSettings) => void;
  onReset: () => void;
  onImport: (file: File) => void;
  onEnableNotifications: () => void;
};

export function Settings({
  settings,
  sessions,
  onSettingsChange,
  onReset,
  onImport,
  onEnableNotifications
}: SettingsProps) {
  const fileInput = useRef<HTMLInputElement>(null);
  const notificationStatus = getNotificationStatus();
  const notificationsActive = notificationStatus === "granted" && settings.notificationsEnabled;

  const updateTheme = (theme: ThemeMode) => {
    onSettingsChange({ ...settings, theme });
  };

  const exportJson = () => {
    const data = createExportData(settings, sessions);
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `intentie-export-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="screen">
      <header className="screen-header">
        <h1>Instellingen</h1>
        <p>Maak de app passend voor je eigen gebruik.</p>
      </header>

      <section className="settings-group">
        <label className="field-label" htmlFor="default-duration">
          Standaard tijdsduur
        </label>
        <div className="inline-control">
          <input
            id="default-duration"
            className="text-input"
            inputMode="numeric"
            min="1"
            type="number"
            value={settings.defaultMinutes}
            onChange={(event) =>
              onSettingsChange({
                ...settings,
                defaultMinutes: Math.max(1, Number(event.target.value) || 1)
              })
            }
          />
          <span>min</span>
        </div>
      </section>

      <section className="settings-group">
        <h2>Weergave</h2>
        <div className="segmented-control" role="group" aria-label="Kleurmodus">
          <button
            className={settings.theme === "dark" ? "is-active" : ""}
            type="button"
            onClick={() => updateTheme("dark")}
          >
            Donker
          </button>
          <button
            className={settings.theme === "light" ? "is-active" : ""}
            type="button"
            onClick={() => updateTheme("light")}
          >
            Licht
          </button>
        </div>
      </section>

      <section className="settings-group instructions">
        <h2>Timer-notificatie</h2>
        <p>
          Stuur een melding wanneer de timer voorbij is. Tik op de melding om Intentie weer te openen.
        </p>
        <button
          className="secondary-button"
          disabled={notificationStatus === "unsupported" || notificationStatus === "denied"}
          type="button"
          onClick={() => {
            if (notificationsActive) {
              onSettingsChange({ ...settings, notificationsEnabled: false });
              return;
            }
            onEnableNotifications();
          }}
        >
          {notificationsActive
            ? "Notificaties uitzetten"
            : notificationStatus === "denied"
              ? "Geblokkeerd in systeeminstellingen"
              : notificationStatus === "unsupported"
                ? "Niet ondersteund"
                : "Notificaties aanzetten"}
        </button>
      </section>

      <section className="settings-group">
        <h2>Data</h2>
        <div className="button-stack">
          <button className="secondary-button" type="button" onClick={exportJson}>
            Export JSON
          </button>
          <button className="secondary-button" type="button" onClick={() => fileInput.current?.click()}>
            Import JSON
          </button>
          <button className="danger-button" type="button" onClick={onReset}>
            Data resetten
          </button>
        </div>
        <input
          ref={fileInput}
          hidden
          accept="application/json"
          type="file"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) onImport(file);
            event.target.value = "";
          }}
        />
      </section>

      <section className="settings-group instructions">
        <h2>Installeren op iPhone</h2>
        <p>Open de app in Safari, tik op Delen en kies Zet op beginscherm.</p>
      </section>

      <section className="settings-group instructions">
        <h2>Installeren op MacBook</h2>
        <p>Open de app in Safari of Chrome en kies Voeg toe aan Dock of Installeer Intentie.</p>
      </section>

      <section className="settings-group instructions">
        <h2>iOS Shortcuts</h2>
        <p>
          Open Opdrachten &gt; Automatisering &gt; App &gt; kies apps &gt; Wordt geopend &gt; Open URL &gt; plak je
          app-url.
        </p>
        <p>
          iOS kan een PWA niet vanzelf na je timer naar voren halen. Een Shortcut kan Intentie wel openen wanneer jij
          een gekozen app opent.
        </p>
      </section>
    </main>
  );
}
