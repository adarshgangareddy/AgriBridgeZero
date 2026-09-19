import { MapPin, Radio, Sparkles, CheckCircle2 } from "lucide-react";

interface HowItWorksProps {
  t: (key: string) => string;
}

export function HowItWorks({ t }: HowItWorksProps) {
  const steps = [
    {
      num: "01",
      title: t("step1Title"),
      desc: t("step1Desc"),
      icon: MapPin,
    },
    {
      num: "02",
      title: t("step2Title"),
      desc: t("step2Desc"),
      icon: Radio,
    },
    {
      num: "03",
      title: t("step3Title"),
      desc: t("step3Desc"),
      icon: Sparkles,
    },
    {
      num: "04",
      title: t("step4Title"),
      desc: t("step4Desc"),
      icon: CheckCircle2,
    },
  ];

  return (
    <section className="how-it-works-section" id="how-it-works">
      <div className="section-container">
        <div className="section-header-centered">
          <h2 className="section-heading">{t("howItWorksTitle")}</h2>
          <p className="section-subheading">{t("howItWorksSubtitle")}</p>
        </div>

        <div className="steps-flow-wrap">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={step.num} className="step-item">
                <div className="step-badge-row">
                  <span className="step-number">{step.num}</span>
                  {idx < steps.length - 1 && <div className="step-connector-line" />}
                </div>

                <div className="step-card">
                  <div className="step-icon-bubble">
                    <Icon size={18} />
                  </div>
                  <h3 className="step-title">{step.title}</h3>
                  <p className="step-desc">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
