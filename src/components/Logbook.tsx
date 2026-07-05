import { formatDateTime, isToday, minutesLabel, mostChosen } from "../lib/sessionStats";
import type { SessionRecord } from "../types";

type LogbookProps = {
  sessions: SessionRecord[];
};

export function Logbook({ sessions }: LogbookProps) {
  const today = sessions.filter((session) => isToday(session.startedAt));
  const totalToday = today.reduce((sum, session) => sum + session.actualMinutes, 0);
  const extensions = today.reduce((sum, session) => sum + session.extensions, 0);
  const reasonSessions = today.filter((session) => session.reason !== "Niet gevraagd");
  const recent = sessions.slice(0, 10);

  return (
    <main className="screen">
      <header className="screen-header">
        <h1>Logboek</h1>
        <p>Kijk kort terug. Meer hoeft niet.</p>
      </header>

      <section className="stats-grid" aria-label="Dashboard">
        <StatCard label="Sessies vandaag" value={String(today.length)} />
        <StatCard label="Minuten vandaag" value={minutesLabel(totalToday)} />
        <StatCard label="Meest gekozen intentie" value={mostChosen(today, "intent")} />
        <StatCard label="Meest gekozen reden" value={reasonSessions.length ? mostChosen(reasonSessions, "reason") : "Niet gevraagd"} />
        <StatCard label="Verlengingen" value={String(extensions)} />
      </section>

      <section className="list-section">
        <h2>Laatste 10 sessies</h2>
        {recent.length === 0 ? (
          <p className="empty-state">Nog geen sessies. Je eerste log verschijnt hier.</p>
        ) : (
          <div className="session-list">
            {recent.map((session) => (
              <article className="session-item" key={session.id}>
                <div>
                  <h3>{session.intent}</h3>
                  <p>
                    {session.reason !== "Niet gevraagd" ? `${session.reason} - ` : ""}
                    {formatDateTime(session.startedAt)}
                  </p>
                </div>
                <div className="session-meta">
                  <strong>{minutesLabel(session.actualMinutes)}</strong>
                  <span>{session.completed ? "Afgerond" : "Gestopt"}</span>
                  {session.extended && <span>+{session.extensions * 5} min</span>}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <article className="stat-card">
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}
