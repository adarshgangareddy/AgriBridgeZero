import { useState } from "react";
import { Search, User, Home, MapPin, Scan, Sparkles, Globe } from "lucide-react";
import { supportedLanguages, type LanguageCode } from "../data/i18n";
import type { UserSession } from "./AuthModal";

interface MobileNavProps {
  currentLang: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  user: UserSession | null;
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  onOpenAuth: (actionDesc?: string) => void;
  onOpenSearch: () => void;
  t: (key: string) => string;
}

export function MobileNav({
  currentLang,
  onLanguageChange,
  user,
  activeSection,
  onNavigate,
  onOpenAuth,
  onOpenSearch,
  t,
}: MobileNavProps) {
  const [langSheetOpen, setLangSheetOpen] = useState(false);

  const categories = [
    { id: "hero-section", label: "Home" },
    { id: "soil-section", label: "Soil" },
    { id: "ai-section", label: "AI Advisor" },
    { id: "device-section", label: "Devices" },
    { id: "crops-section", label: "Crops" },
    { id: "marketplace-section", label: "Marketplace" },
    { id: "services-section", label: "Services" },
    { id: "how-it-works", label: "How It Works" },
  ];

  return (
    <>
      {/* Mobile Top Header */}
      <div className="mobile-top-header">
        <div className="mobile-header-inner">
          <div className="mobile-logo-wrap" onClick={() => onNavigate("hero-section")}>
            <img src="/agri-logo.png" alt="AgriBridgeZero" className="mobile-logo-img" />
            <div className="mobile-title-col">
              <span className="mobile-brand-title">AgriBridgeZero</span>
              <span className="mobile-brand-subtitle">Soil • Crop • Safe • Smart</span>
            </div>
          </div>

          <div className="mobile-header-actions">
            <button 
              className="mobile-icon-btn" 
              onClick={() => setLangSheetOpen(true)}
              aria-label="Change Language"
            >
              <Globe size={18} />
            </button>
            <button 
              className="mobile-icon-btn" 
              onClick={onOpenSearch}
              aria-label="Search"
            >
              <Search size={18} />
            </button>
            <button 
              className="mobile-icon-btn profile-trigger"
              onClick={() => {
                if (user && user.isLoggedIn) {
                  onNavigate("map-section");
                } else {
                  onOpenAuth(t("signIn"));
                }
              }}
              aria-label="Profile"
            >
              {user && user.isLoggedIn ? (
                <div className="mobile-avatar-badge">{user.name.charAt(0)}</div>
              ) : (
                <User size={18} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar Pill */}
        <div className="mobile-search-bar-wrap" onClick={onOpenSearch}>
          <div className="mobile-search-pill">
            <Search size={15} className="search-pill-icon" />
            <span className="search-pill-text">Search crops, services, devices...</span>
          </div>
        </div>

        {/* Mobile Horizontal Category Pills */}
        <div className="mobile-category-scroll">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`category-chip ${activeSection === cat.id ? "active" : ""}`}
              onClick={() => onNavigate(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Language Bottom Sheet for Mobile */}
      {langSheetOpen && (
        <div className="mobile-lang-sheet-backdrop" onClick={() => setLangSheetOpen(false)}>
          <div className="mobile-lang-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-sheet-handle" />
            <h3 className="mobile-sheet-title">Select Language</h3>
            <div className="mobile-lang-grid">
              {supportedLanguages.map((lang) => (
                <button
                  key={lang.code}
                  className={`mobile-lang-choice ${currentLang === lang.code ? "active" : ""}`}
                  onClick={() => {
                    onLanguageChange(lang.code);
                    setLangSheetOpen(false);
                  }}
                >
                  <span className="choice-flag">{lang.flag}</span>
                  <div className="choice-meta">
                    <span className="choice-native">{lang.nativeLabel}</span>
                    <span className="choice-en">{lang.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Sticky Bottom Navigation Bar (Home, My Lands, Scan, AI, Account) */}
      <nav className="mobile-bottom-nav" aria-label="Mobile Bottom Navigation">
        <button
          className={`bottom-nav-item ${activeSection === "hero-section" ? "active" : ""}`}
          onClick={() => onNavigate("hero-section")}
        >
          <Home size={20} />
          <span>Home</span>
        </button>

        <button
          className={`bottom-nav-item ${activeSection === "map-section" ? "active" : ""}`}
          onClick={() => {
            if (user && user.isLoggedIn) {
              onNavigate("map-section");
            } else {
              onOpenAuth("My Lands");
            }
          }}
        >
          <MapPin size={20} />
          <span>My Lands</span>
        </button>

        <button
          className="bottom-nav-item scan-center-item"
          onClick={() => {
            if (user && user.isLoggedIn) {
              onNavigate("device-section");
            } else {
              onOpenAuth("Soil Scan");
            }
          }}
          aria-label="Start Soil Scan"
        >
          <div className="scan-circle-btn">
            <Scan size={22} />
          </div>
          <span>Scan</span>
        </button>

        <button
          className={`bottom-nav-item ${activeSection === "ai-section" ? "active" : ""}`}
          onClick={() => onNavigate("ai-section")}
        >
          <Sparkles size={20} />
          <span>AI</span>
        </button>

        <button
          className="bottom-nav-item"
          onClick={() => {
            if (user && user.isLoggedIn) {
              onNavigate("map-section");
            } else {
              onOpenAuth(t("signIn"));
            }
          }}
        >
          <User size={20} />
          <span>Account</span>
        </button>
      </nav>
    </>
  );
}
