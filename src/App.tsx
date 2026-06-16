import { useEffect, useState } from "react";
import { BottomNav, type TabId } from "./components/BottomNav";
import { Logbook } from "./components/Logbook";
import { Onboarding } from "./components/Onboarding";
import { Settings } from "./components/Settings";
import { StartFlow } from "./components/StartFlow";
import { TimerScreen } from "./components/TimerScreen";
import { addSession, importData, loadSessions, loadSettings, resetAllData, saveSettings } from "./lib/storage";
import type { ActiveSession, AppSettings, SessionRecord } from "./types";

function App() {
  const [settings, setSettings] = useState<AppSettings>(() => loadSettings());
  const [sessions, setSessions] = useState<SessionRecord[]>(() => loadSessions());
  const [activeTab, setActiveTab] = useState<TabId>("start");
  const [activeSession, setActiveSession] = useState<ActiveSession | null>(null);

  useEffect(() => {
    document.documentElement.dataset.theme = settings.theme;
    saveSettings(settings);
  }, [settings]);

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

  return (
    <div className="app-shell">
      {activeSession ? (
        <TimerScreen
          session={activeSession}
          onExtend={extendSession}
          onFinish={finishSession}
          onNewIntent={(record) => {
            setSessions(addSession(record));
            setActiveSession(null);
            setActiveTab("start");
          }}
        />
      ) : (
        <>
          {activeTab === "start" && (
            <StartFlow defaultMinutes={settings.defaultMinutes} onStartSession={setActiveSession} />
          )}
          {activeTab === "logboek" && <Logbook sessions={sessions} />}
          {activeTab === "instellingen" && (
            <Settings
              settings={settings}
              sessions={sessions}
              onSettingsChange={setSettings}
              onReset={resetData}
              onImport={importJson}
            />
          )}
        </>
      )}

      {!activeSession && <BottomNav activeTab={activeTab} onChange={setActiveTab} />}
    </div>
  );
}

export default App;
