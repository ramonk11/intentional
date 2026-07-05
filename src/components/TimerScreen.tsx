import { useEffect, useRef } from "react";
import { useTicker } from "../hooks/useTicker";
import { showTimerFinishedNotification } from "../lib/notifications";
import type { ActiveSession, SessionRecord } from "../types";

type TimerScreenProps = {
  session: ActiveSession;
  notificationsEnabled: boolean;
  onExtend: () => void;
  onFinish: (record: SessionRecord) => void;
  onMarkNotified: () => void;
  onNewIntent: (record: SessionRecord) => void;
};

export function TimerScreen({
  session,
  notificationsEnabled,
  onExtend,
  onFinish,
  onMarkNotified,
  onNewIntent
}: TimerScreenProps) {
  const notifiedRef = useRef<string | null>(session.notifiedAt ? session.id : null);
  const now = useTicker();
  const remainingMs = Math.max(0, session.endsAt - now);
  const isExpired = remainingMs <= 0;
  const progress = Math.min(1, (now - session.startedAt) / Math.max(1, session.endsAt - session.startedAt));

  useEffect(() => {
    if (!isExpired || session.notifiedAt || notifiedRef.current === session.id) return;

    notifiedRef.current = session.id;
    onMarkNotified();
    if (notificationsEnabled) {
      showTimerFinishedNotification(session.intent).catch(() => {
        // Notificaties zijn best-effort; de timer zelf blijft de bron van waarheid.
      });
    }
  }, [isExpired, notificationsEnabled, onMarkNotified, session.intent, session.notifiedAt]);

  const createRecord = (completed: boolean): SessionRecord => {
    const endedAt = Date.now();
    return {
      id: session.id,
      startedAt: new Date(session.startedAt).toISOString(),
      endedAt: new Date(endedAt).toISOString(),
      intent: session.intent,
      reason: session.reason,
      plannedMinutes: session.originalMinutes,
      actualMinutes: Math.max(1, Math.round((endedAt - session.startedAt) / 60_000)),
      completed,
      extended: session.extensions > 0,
      extensions: session.extensions
    };
  };

  const complete = (completed: boolean) => {
    onFinish(createRecord(completed));
  };

  if (isExpired) {
    return (
      <main className="screen timer-screen">
        <section className="timer-card">
          <p className="eyebrow">{session.intent}</p>
          <h1>Tijd is voorbij. Ben je klaar?</h1>
          <div className="timer-actions">
            <button className="primary-button" type="button" onClick={() => complete(true)}>
              Ja, klaar
            </button>
            <button className="secondary-button" type="button" onClick={onExtend}>
              Nog 5 minuten
            </button>
            <button className="quiet-button" type="button" onClick={() => onNewIntent(createRecord(false))}>
              Nieuwe intentie kiezen
            </button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="screen timer-screen">
      <section className="timer-card">
        <p className="eyebrow">{session.intent}</p>
        <TimerValue milliseconds={remainingMs} />
        <div className="progress-track" aria-hidden="true">
          <span style={{ transform: `scaleX(${progress})` }} />
        </div>
        <p className="timer-copy">Gebruik je telefoon alleen waarvoor je kwam.</p>
        <div className="timer-actions">
          <button className="primary-button" type="button" onClick={() => complete(true)}>
            Klaar
          </button>
          <button className="secondary-button" type="button" onClick={() => complete(false)}>
            Stop sessie
          </button>
          <button className="quiet-button" type="button" onClick={onExtend}>
            +5 minuten
          </button>
        </div>
      </section>
    </main>
  );
}

function TimerValue({ milliseconds }: { milliseconds: number }) {
  const totalSeconds = Math.ceil(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return (
    <div className="timer-value" aria-live="polite">
      {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
    </div>
  );
}
