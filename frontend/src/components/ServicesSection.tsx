import { Activity, Sprout, LineChart, ShieldAlert, Sparkles, ShoppingBag } from "lucide-react";

interface ServicesSectionProps {
  onOpenAuth: (actionDesc: string) => void;
  isLoggedIn: boolean;
  t: (key: string) => string;
}

export function ServicesSection({ onOpenAuth, isLoggedIn, t: _t }: ServicesSectionProps) {
  const services = [
    {
      id: "srv-soil",
      title: "1. Soil Intelligence",
      desc: "Understand soil conditions using physical sensor probes and AI-driven spatial analysis.",
      icon: Activity,
      color: "var(--accent-terracotta)",
    },
    {
      id: "srv-crop",
      title: "2. Crop-Specific Analysis",
      desc: "Compare current soil conditions with the exact biochemical requirements of your selected crop.",
      icon: Sprout,
      color: "var(--accent-green)",
    },
    {
      id: "srv-monitor",
      title: "3. Soil Monitoring",
      desc: "Track how soil nutrients, moisture, and organic carbon evolve season-over-season.",
      icon: LineChart,
      color: "var(--accent-amber)",
    },
    {
      id: "srv-risk",
      title: "4. Contaminant Risk",
      desc: "Identify potential abnormal soil conditions and heavy metal alerts where supported by validated sensing.",
      icon: ShieldAlert,
      color: "var(--accent-terracotta)",
    },
    {
      id: "srv-ai",
      title: "5. AI Agricultural Assistant",
      desc: "Ask questions and understand your soil chemistry in simple, native local language.",
      icon: Sparkles,
      color: "var(--accent-amber)",
    },
    {
      id: "srv-inputs",
      title: "6. Input Discovery",
      desc: "Find certified seeds, bio-fertilizers, and soil amendments tailored to your land's deficits.",
      icon: ShoppingBag,
      color: "var(--accent-green)",
    },
  ];

  return (
    <section className="services-section" id="services-section">
      <div className="section-container">
        <div className="section-header-centered">
          <h2 className="section-heading">What AgriBridgeZero Provides</h2>
          <p className="section-subheading">A complete end-to-end intelligence suite from sensor to field decisions</p>
        </div>

        <div className="services-grid">
          {services.map((srv) => {
            const Icon = srv.icon;
            return (
              <div 
                key={srv.id} 
                className="service-card"
                onClick={() => {
                  if (srv.id === "srv-soil") {
                    document.getElementById("soil-section")?.scrollIntoView({ behavior: "smooth" });
                  } else if (srv.id === "srv-ai") {
                    document.getElementById("ai-section")?.scrollIntoView({ behavior: "smooth" });
                  } else if (srv.id === "srv-crop") {
                    document.getElementById("crops-section")?.scrollIntoView({ behavior: "smooth" });
                  } else if (srv.id === "srv-inputs") {
                    document.getElementById("marketplace-section")?.scrollIntoView({ behavior: "smooth" });
                  } else {
                    if (!isLoggedIn) onOpenAuth(srv.title);
                  }
                }}
                role="button"
                tabIndex={0}
              >
                <div className="service-icon-box" style={{ color: srv.color }}>
                  <Icon size={20} />
                </div>
                <h3 className="service-title">{srv.title}</h3>
                <p className="service-desc">{srv.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
