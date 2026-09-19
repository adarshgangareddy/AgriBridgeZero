import { ArrowRight, Sparkles, Shield, Activity, Sprout, MapPin } from "lucide-react";

interface HeroProps {
  onExplorePlatform: () => void;
  onExploreDevice: () => void;
  t: (key: string) => string;
}

export function Hero({ onExplorePlatform, onExploreDevice, t }: HeroProps) {
  return (
    <section className="hero-section" id="hero-section">
      <div className="hero-container">
        {/* Left Column: Text & CTAs */}
        <div className="hero-content-col">
          <div className="hero-badge">
            <Sparkles size={14} className="hero-badge-icon" />
            <span>{t("heroBadge")}</span>
          </div>

          <h1 className="hero-title">
            Understand Your Soil. <br />
            <span className="hero-title-highlight">Grow With Confidence.</span>
          </h1>

          <p className="hero-description">
            {t("heroDesc")}
          </p>

          <div className="hero-action-buttons">
            <button className="hero-btn-primary" onClick={onExplorePlatform}>
              <span>{t("explorePlatform")}</span>
              <ArrowRight size={16} />
            </button>
            <button className="hero-btn-secondary" onClick={onExploreDevice}>
              <span>{t("exploreDevice")}</span>
            </button>
          </div>

          {/* 4 Feature Badges */}
          <div className="hero-feature-tags">
            <div className="feature-tag">
              <Activity size={14} className="tag-icon" />
              <span>{t("realSoilData")}</span>
            </div>
            <div className="feature-tag">
              <Sparkles size={14} className="tag-icon" />
              <span>{t("aiAnalysis")}</span>
            </div>
            <div className="feature-tag">
              <Sprout size={14} className="tag-icon" />
              <span>{t("cropInsights")}</span>
            </div>
            <div className="feature-tag">
              <Shield size={14} className="tag-icon" />
              <span>{t("farmerFirst")}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Hardware in Real Soil with Floating Badges */}
        <div className="hero-visual-col">
          <div className="hero-image-wrapper">
            <img
              src="/hero-device.jpg"
              alt="AgriBridgeZero Intelligent Soil Analyzer in farm soil"
              className="hero-main-img"
              loading="eager"
            />
            <div className="hero-img-gradient-overlay" />

            {/* Top Motto Badge */}
            <div className="hero-floating-top-banner">
              <span className="banner-sparkle">🌾</span>
              <span>Healthy Soil, Brighter Tomorrow</span>
            </div>

            {/* Floating Information Labels matching design mockup */}
            <div className="floating-badge badge-soil">
              <Activity size={13} />
              <span>Soil Analysis</span>
            </div>

            <div className="floating-badge badge-nutrient">
              <Sprout size={13} />
              <span>Nutrient Detection</span>
            </div>

            <div className="floating-badge badge-risk">
              <Shield size={13} />
              <span>Contaminant Risk</span>
            </div>

            <div className="floating-badge badge-cadastre">
              <MapPin size={13} />
              <span>Cadastre Mapping</span>
            </div>

            <div className="floating-badge badge-realtime">
              <div className="pulse-dot" />
              <span>Real-time Insights</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
