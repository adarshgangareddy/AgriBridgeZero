import { Activity, Sparkles, Radio, MapPin, ShoppingBag, BookOpen, ArrowRight } from "lucide-react";

interface QuickAccessProps {
  onNavigate: (sectionId: string) => void;
  onOpenAuth: (actionDesc: string) => void;
  isLoggedIn: boolean;
  t: (key: string) => string;
}

export function QuickAccess({ onNavigate, onOpenAuth, isLoggedIn, t }: QuickAccessProps) {
  const quickCards = [
    {
      id: "soil-section",
      title: t("soilIntelligence"),
      desc: t("soilIntelligenceDesc"),
      icon: Activity,
      color: "var(--accent-terracotta)",
      bgColor: "rgba(183, 101, 67, 0.08)",
      action: () => onNavigate("soil-section"),
    },
    {
      id: "ai-section",
      title: t("aiAdvisor"),
      desc: t("aiAdvisorDesc"),
      icon: Sparkles,
      color: "var(--accent-amber)",
      bgColor: "rgba(198, 154, 69, 0.1)",
      action: () => onNavigate("ai-section"),
    },
    {
      id: "device-section",
      title: t("ourDevice"),
      desc: t("ourDeviceDesc"),
      icon: Radio,
      color: "var(--text-graphite)",
      bgColor: "rgba(36, 37, 34, 0.07)",
      action: () => onNavigate("device-section"),
    },
    {
      id: "map-section",
      title: t("myLand"),
      desc: t("myLandDesc"),
      icon: MapPin,
      color: "var(--accent-green)",
      bgColor: "rgba(100, 123, 74, 0.1)",
      action: () => {
        if (!isLoggedIn) {
          onOpenAuth("My Lands");
        } else {
          onNavigate("map-section");
        }
      },
    },
    {
      id: "marketplace-section",
      title: t("marketplace"),
      desc: t("marketplaceDesc"),
      icon: ShoppingBag,
      color: "var(--accent-terracotta)",
      bgColor: "rgba(183, 101, 67, 0.08)",
      action: () => onNavigate("marketplace-section"),
    },
    {
      id: "crops-section",
      title: t("cropLibrary"),
      desc: t("cropLibraryDesc"),
      icon: BookOpen,
      color: "var(--accent-green)",
      bgColor: "rgba(100, 123, 74, 0.1)",
      action: () => onNavigate("crops-section"),
    },
  ];

  return (
    <section className="quick-access-section" id="quick-access">
      <div className="section-container">
        <div className="section-header-row">
          <div>
            <h2 className="section-heading">{t("exploreTitle")}</h2>
            <p className="section-subheading">{t("exploreSubtitle")}</p>
          </div>
          <button 
            className="view-all-link"
            onClick={() => onNavigate("services-section")}
          >
            <span>{t("viewAll")}</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="quick-cards-grid">
          {quickCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                className="quick-card"
                onClick={card.action}
                role="button"
                tabIndex={0}
              >
                <div 
                  className="quick-card-icon-wrap"
                  style={{ backgroundColor: card.bgColor, color: card.color }}
                >
                  <Icon size={18} />
                </div>
                <div className="quick-card-content">
                  <h3 className="quick-card-title">{card.title}</h3>
                  <p className="quick-card-desc">{card.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
