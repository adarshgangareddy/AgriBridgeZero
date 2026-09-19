import { Shield, Sparkles, MapPin, Repeat, HeartHandshake, Layers } from "lucide-react";
import { whyAgriBridgeItems } from "../data/demo";

interface WhyAgriBridgeProps {
  t: (key: string) => string;
}

export function WhyAgriBridge({ t }: WhyAgriBridgeProps) {
  const icons = [Layers, Sparkles, Shield, MapPin, Repeat, HeartHandshake];

  return (
    <section className="why-abz-section" id="why-section">
      <div className="section-container">
        <div className="section-header-centered">
          <h2 className="section-heading">{t("whyTitle")}</h2>
          <p className="section-subheading">
            Engineered specifically to solve precision soil intelligence from the ground up.
          </p>
        </div>

        <div className="why-grid">
          {whyAgriBridgeItems.map((item, index) => {
            const Icon = icons[index % icons.length];
            return (
              <div key={item.title} className="why-card">
                <div className="why-icon-bubble">
                  <Icon size={18} />
                </div>
                <h3 className="why-item-title">{item.title}</h3>
                <p className="why-item-desc">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
