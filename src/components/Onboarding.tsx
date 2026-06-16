const steps = [
  {
    title: "Kies je intentie",
    copy: "Begin met wat je echt kwam doen."
  },
  {
    title: "Zet een tijdslimiet",
    copy: "Maak de sessie klein en duidelijk."
  },
  {
    title: "Gebruik bewuster",
    copy: "Ga verder zonder extra oordeel."
  }
];

type OnboardingProps = {
  onDone: () => void;
};

export function Onboarding({ onDone }: OnboardingProps) {
  return (
    <main className="screen onboarding-screen">
      <section className="hero-block">
        <p className="eyebrow">Intentie</p>
        <h1>Een rustige pauze voor je opent.</h1>
        <p>Drie korte vragen voordat je verdergaat. Praktisch, direct en zonder preek.</p>
      </section>

      <div className="onboarding-steps">
        {steps.map((step, index) => (
          <article className="step-card" key={step.title}>
            <span>{index + 1}</span>
            <div>
              <h2>{step.title}</h2>
              <p>{step.copy}</p>
            </div>
          </article>
        ))}
      </div>

      <button className="primary-button" type="button" onClick={onDone}>
        Begin
      </button>
    </main>
  );
}
