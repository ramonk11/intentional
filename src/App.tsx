import { useEffect, useState } from "react";
import { BottomNav, type TabId } from "./components/BottomNav";
import { Logbook } from "./components/Logbook";
import { Onboarding } from "./components/Onboarding";
import { Settings } from "./components/Settings";
import { StartFlow } from "./components/StartFlow";
import { TimerScreen } from "./components/TimerScreen";
import { requestNotificationPermission } from "./lib/notifications";
import { runReturnShortcut } from "./lib/shortcuts";
import {
  addSession,
  importData,
  loadActiveSession,
  loadSessions,
  loadSettings,
  resetAllData,
  saveActiveSession,
  saveSettings
} from "./lib/storage";
import type { ActiveSession, AppSettings, SessionRecord } from "./types";

function App() {
  const [settings, setSettings] = useState<AppSettings>(() => loadSettings());
  const [sessions, setSessions] = useState<SessionRecord[]>(() => loadSessions());
  const [activeTab, setActiveTab] = useState<TabId>("start");
  const [activeSession, setActiveSession] = useState<ActiveSession | null>(() => loadActiveSession());

  useEffect(() => {
    document.documentElement.dataset.theme = settings.theme;
    saveSettings(settings);
  }, [settings]);

  useEffect(() => {
    saveActiveSession(activeSession);
  }, [activeSession]);

  useEffect(() => {
    if (activeSession) return;

    const params = new URLSearchParams(window.location.search);
    if (params.get("autostart") !== "1") return;

    const seconds = Number(params.get("seconds"));
    const minutes = Number(params.get("minutes"));
    const durationSeconds = Number.isFinite(seconds) && seconds > 0 ? seconds : minutes * 60;
    if (!Number.isFinite(durationSeconds) || durationSeconds <= 0) return;

    const startedAt = Date.now();
    setActiveSession({
      id: crypto.randomUUID(),
      startedAt,
      endsAt: startedAt + durationSeconds * 1000,
      originalMinutes: durationSeconds / 60,
      originalSeconds: durationSeconds,
      intent: params.get("intent") || "Bewust gebruik",
      reason: "Shortcut",
      extensions: 0
    });

    window.history.replaceState({}, "", window.location.pathname || "./");
  }, [activeSession]);

  const finishOnboarding = () => {
    setSettings((current) => ({ ...current, onboardingDone: true }));
  };

  const finishSession = (record: SessionRecord) => {
    setSessions(addSession(record));
    setActiveSession(null);
    setActiveTab("logboek");
  };

  const extendSession = () => {
    setActiveSession((current) => {
      if (!current) return current;
      return {
        ...current,
        endsAt: Math.max(Date.now(), current.endsAt) + 5 * 60_000,
        extensions: current.extensions + 1
      };
    });
  };

  const resetData = () => {
    if (!window.confirm("Alle sessies en instellingen wissen?")) return;
    resetAllData();
    setSettings(loadSettings());
    setSessions([]);
    setActiveSession(null);
    setActiveTab("start");
  };

  const enableNotifications = async () => {
    const permission = await requestNotificationPermission();
    setSettings((current) => ({
      ...current,
      notificationsEnabled: permission === "granted"
    }));
  };

  const importJson = async (file: File) => {
    try {
      const data = JSON.parse(await file.text());
      importData(data);
      setSettings(loadSettings());
      setSessions(loadSessions());
    } catch {
      window.alert("Importeren lukte niet. Kies een geldig Intentie JSON-bestand.");
    }
  };

  if (!settings.onboardingDone) {
    return <Onboarding onDone={finishOnboarding} />;
  }

  const startSession = (session: ActiveSession) => {
    saveActiveSession(session);
    setActiveSession(session);

    if (settings.shortcutReturnEnabled) {
      runReturnShortcut(session, settings.shortcutName);
    }
  };

  return (
    <div className="app-shell">
      {activeSession ? (
        <TimerScreen
          session={activeSession}
          notificationsEnabled={settings.notificationsEnabled}
          onExtend={extendSession}
          onFinish={finishSession}
          onMarkNotified={() => {
            setActiveSession((current) => (current ? { ...current, notifiedAt: Date.now() } : current));
          }}
          onNewIntent={(record) => {
            setSessions(addSession(record));
            setActiveSession(null);
            setActiveTab("start");
          }}
        />
      ) : (
        <>
          {activeTab === "start" && (
            <StartFlow defaultMinutes={settings.defaultMinutes} onStartSession={startSession} />
          )}
          {activeTab === "logboek" && <Logbook sessions={sessions} />}
          {activeTab === "instellingen" && (
            <Settings
              settings={settings}
              sessions={sessions}
              onSettingsChange={setSettings}
              onReset={resetData}
              onImport={importJson}
              onEnableNotifications={enableNotifications}
            />
          )}
        </>
      )}

      {!activeSession && <BottomNav activeTab={activeTab} onChange={setActiveTab} />}
    </div>
  );
}

export default App;
