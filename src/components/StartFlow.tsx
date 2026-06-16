import { useMemo, useState } from "react";
import { DURATION_OPTIONS, INTENT_OPTIONS, REASON_OPTIONS } from "../lib/constants";
import type { ActiveSession, IntentDraft } from "../types";

type FlowStep = "intent" | "reason" | "duration" | "confirm";

type StartFlowProps = {
  defaultMinutes: number;
  onStartSession: (session: ActiveSession) => void;
};

const emptyDraft = (defaultMinutes: number): IntentDraft => ({
  intent: "",
  reason: "",
  minutes: defaultMinutes
});

export function StartFlow({ defaultMinutes, onStartSession }: StartFlowProps) {
  const [step, setStep] = useState<FlowStep>("intent");
  const [draft, setDraft] = useState<IntentDraft>(() => emptyDraft(defaultMinutes));
  const [customIntent, setCustomIntent] = useState("");
  const [customMinutes, setCustomMinutes] = useState("");

  const canContinue = useMemo(() => {
    if (step === "intent") return Boolean(draft.intent.trim() || customIntent.trim());
    if (step === "reason") return Boolean(draft.reason.trim());
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
    setStep("reason");
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
    onStartSession({
      id: crypto.randomUUID(),
      startedAt,
      endsAt: startedAt + draft.minutes * 60_000,
      originalMinutes: draft.minutes,
      intent: draft.intent,
      reason: draft.reason,
      extensions: 0
    });
    reset();
  };

  return (
    <main className="screen">
      <FlowProgress step={step} />

      {step === "intent" && (
        <section className="flow-section">
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
          <button className="primary-button" disabled={!canContinue} type="button" onClick={continueFromIntent}>
            Verder
          </button>
        </section>
      )}

      {step === "reason" && (
        <section className="flow-section">
          <Header title="Waarom pak je je telefoon?" subtitle="Een korte check is genoeg." />
          <div className="option-grid">
            {REASON_OPTIONS.map((option) => (
              <button
                className={draft.reason === option ? "choice-card is-selected" : "choice-card"}
                key={option}
                type="button"
                onClick={() => setDraft((current) => ({ ...current, reason: option }))}
              >
                {option}
              </button>
            ))}
          </div>
          <FlowActions
            onBack={() => setStep("intent")}
            onNext={() => setStep("duration")}
            nextDisabled={!canContinue}
          />
        </section>
      )}

      {step === "duration" && (
        <section className="flow-section">
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
            onBack={() => setStep("reason")}
            onNext={() => setStep("confirm")}
            nextDisabled={!canContinue}
          />
        </section>
      )}

      {step === "confirm" && (
        <section className="flow-section">
          <Header title="Check je intentie" subtitle="Als dit klopt, kun je door." />
          <div className="summary-panel">
            <SummaryRow label="Intentie" value={draft.intent} />
            <SummaryRow label="Reden" value={draft.reason} />
            <SummaryRow label="Tijdsduur" value={`${draft.minutes} min`} />
          </div>
          <button className="primary-button" type="button" onClick={startSession}>
            Start bewust gebruik
          </button>
          <button className="quiet-button" type="button" onClick={reset}>
            Annuleer
          </button>
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
  const steps: FlowStep[] = ["intent", "reason", "duration", "confirm"];
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
  nextDisabled
}: {
  onBack: () => void;
  onNext: () => void;
  nextDisabled: boolean;
}) {
  return (
    <div className="flow-actions">
      <button className="secondary-button" type="button" onClick={onBack}>
        Terug
      </button>
      <button className="primary-button" disabled={nextDisabled} type="button" onClick={onNext}>
        Verder
      </button>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="summary-row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
