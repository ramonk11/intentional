import { useMemo, useState } from "react";
import { DURATION_OPTIONS, INTENT_OPTIONS } from "../lib/constants";
import type { ActiveSession, IntentDraft } from "../types";

type FlowStep = "intent" | "duration";

type StartFlowProps = {
  defaultMinutes: number;
  onStartSession: (session: ActiveSession) => void;
};

const emptyDraft = (defaultMinutes: number): IntentDraft => ({
  intent: "",
  reason: "Niet gevraagd",
  minutes: defaultMinutes
});

export function StartFlow({ defaultMinutes, onStartSession }: StartFlowProps) {
  const [step, setStep] = useState<FlowStep>("intent");
  const [draft, setDraft] = useState<IntentDraft>(() => emptyDraft(defaultMinutes));
  const [customIntent, setCustomIntent] = useState("");
  const [customMinutes, setCustomMinutes] = useState("");

  const canContinue = useMemo(() => {
    if (step === "intent") return Boolean(draft.intent.trim() || customIntent.trim());
    if (step === "duration") return draft.minutes > 0;
    return true;
  }, [customIntent, draft, step]);

  const chooseIntent = (value: string) => {
    setDraft((current) => ({ ...current, intent: value }));
    setCustomIntent("");
  };

  const continueFromIntent = () => {
    const intent = customIntent.trim() || draft.intent;
    if (!intent) return;
    setDraft((current) => ({ ...current, intent }));
    setStep("duration");
  };

  const chooseDuration = (minutes: number) => {
    setDraft((current) => ({ ...current, minutes }));
    setCustomMinutes("");
  };

  const applyCustomMinutes = (value: string) => {
    setCustomMinutes(value);
    const parsed = Number(value);
    if (Number.isFinite(parsed) && parsed > 0) {
      setDraft((current) => ({ ...current, minutes: Math.round(parsed) }));
    }
  };

  const reset = () => {
    setDraft(emptyDraft(defaultMinutes));
    setCustomIntent("");
    setCustomMinutes("");
    setStep("intent");
  };

  const startSession = () => {
    const startedAt = Date.now();
    const intent = customIntent.trim() || draft.intent;
    if (!intent || draft.minutes <= 0) return;

    onStartSession({
      id: crypto.randomUUID(),
      startedAt,
      endsAt: startedAt + draft.minutes * 60_000,
      originalMinutes: draft.minutes,
      intent,
      reason: draft.reason,
      extensions: 0
    });
    reset();
  };

  return (
    <main className="screen start-screen">
      <FlowProgress step={step} />

      {step === "intent" && (
        <section className="flow-section compact-flow">
          <Header title="Wat wil je doen?" subtitle="Kies bewust voordat je verdergaat." />
          <div className="option-grid">
            {INTENT_OPTIONS.map((option) => (
              <button
                className={draft.intent === option ? "choice-card is-selected" : "choice-card"}
                key={option}
                type="button"
                onClick={() => chooseIntent(option)}
              >
                {option}
              </button>
            ))}
          </div>
          <label className="field-label" htmlFor="custom-intent">
            Eigen intentie
          </label>
          <input
            id="custom-intent"
            className="text-input"
            placeholder="Eigen intentie..."
            value={customIntent}
            onChange={(event) => {
              setCustomIntent(event.target.value);
              setDraft((current) => ({ ...current, intent: "" }));
            }}
          />
          <div className="sticky-action">
            <button className="primary-button" disabled={!canContinue} type="button" onClick={continueFromIntent}>
              Verder
            </button>
          </div>
        </section>
      )}

      {step === "duration" && (
        <section className="flow-section compact-flow">
          <Header title="Voor hoe lang?" subtitle="Kies een limiet die bij deze taak past." />
          <div className="duration-grid">
            {DURATION_OPTIONS.map((minutes) => (
              <button
                className={draft.minutes === minutes ? "choice-card is-selected" : "choice-card"}
                key={minutes}
                type="button"
                onClick={() => chooseDuration(minutes)}
              >
                {minutes} min
              </button>
            ))}
          </div>
          <label className="field-label" htmlFor="custom-minutes">
            Aantal minuten
          </label>
          <input
            id="custom-minutes"
            className="text-input"
            inputMode="numeric"
            min="1"
            placeholder="Bijvoorbeeld 12"
            type="number"
            value={customMinutes}
            onChange={(event) => applyCustomMinutes(event.target.value)}
          />
          <FlowActions
            onBack={() => setStep("intent")}
            onNext={startSession}
            nextDisabled={!canContinue}
            nextLabel="Start"
          />
        </section>
      )}
    </main>
  );
}

function Header({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <header className="screen-header">
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </header>
  );
}

function FlowProgress({ step }: { step: FlowStep }) {
  const steps: FlowStep[] = ["intent", "duration"];
  const activeIndex = steps.indexOf(step);

  return (
    <div className="progress-dots" aria-label={`Stap ${activeIndex + 1} van ${steps.length}`}>
      {steps.map((item, index) => (
        <span className={index <= activeIndex ? "is-active" : ""} key={item} />
      ))}
    </div>
  );
}

function FlowActions({
  onBack,
  onNext,
  nextDisabled,
  nextLabel = "Verder"
}: {
  onBack: () => void;
  onNext: () => void;
  nextDisabled: boolean;
  nextLabel?: string;
}) {
  return (
    <div className="flow-actions sticky-action">
      <button className="secondary-button" type="button" onClick={onBack}>
        Terug
      </button>
      <button className="primary-button" disabled={nextDisabled} type="button" onClick={onNext}>
        {nextLabel}
      </button>
    </div>
  );
}
