import { useState } from "react";
import { Search, Globe, ChevronDown, LogOut, MapPin, Radio, Shield } from "lucide-react";
import { supportedLanguages, type LanguageCode } from "../data/i18n";
import type { UserSession } from "./AuthModal";

interface HeaderProps {
  currentLang: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  user: UserSession | null;
  onOpenAuth: (actionDesc?: string) => void;
  onSignOut: () => void;
  onOpenSearch: () => void;
  onNavigate: (sectionId: string) => void;
  t: (key: string) => string;
}

export function Header({
  currentLang,
  onLanguageChange,
  user,
  onOpenAuth,
  onSignOut,
  onOpenSearch,
  onNavigate,
  t,
}: HeaderProps) {
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const currentLangObj = supportedLanguages.find((l) => l.code === currentLang) || supportedLanguages[0];

  return (
    <header className="site-header">
      <div className="header-container">
        {/* Left: Official Logo */}
        <div className="header-left" onClick={() => onNavigate("hero-section")}>
          <div className="brand-logo-wrap">
            <img src="/agri-logo.png" alt="AgriBridgeZero" className="site-logo-img" />
            <div className="brand-text-col">
              <span className="brand-name">AgriBridgeZero</span>
              <span className="brand-sub">Soil • Crop • Safe • Smart</span>
            </div>
          </div>
        </div>

        {/* Center: Desktop Navigation */}
        <nav className="desktop-nav" aria-label="Main Navigation">
          <button className="nav-link active" onClick={() => onNavigate("hero-section")}>
            Home
          </button>
          <button className="nav-link" onClick={() => onNavigate("soil-section")}>
            Soil Intelligence
          </button>
          <button className="nav-link" onClick={() => onNavigate("device-section")}>
            Devices
          </button>
          <button className="nav-link" onClick={() => onNavigate("crops-section")}>
            Crops
          </button>
          <button className="nav-link" onClick={() => onNavigate("marketplace-section")}>
            Marketplace
          </button>
          <button className="nav-link" onClick={() => onNavigate("services-section")}>
            Services
          </button>
          <button className="nav-link" onClick={() => onNavigate("how-it-works")}>
            How It Works
          </button>
        </nav>

        {/* Right: Actions */}
        <div className="header-right">
          {/* Search trigger */}
          <button 
            className="icon-action-btn search-trigger-btn"
            onClick={onOpenSearch}
            title="Search crops, device, soil..."
            aria-label="Search"
          >
            <Search size={17} />
          </button>

          {/* Multilanguage selector */}
          <div className="lang-picker-dropdown">
            <button
              className="lang-select-btn"
              onClick={() => {
                setLangMenuOpen(!langMenuOpen);
                setUserMenuOpen(false);
              }}
              title="Change Language"
            >
              <Globe size={15} />
              <span className="lang-code-text">{currentLangObj.nativeLabel}</span>
              <ChevronDown size={13} className={`chevron ${langMenuOpen ? "rotated" : ""}`} />
            </button>

            {langMenuOpen && (
              <div className="lang-dropdown-menu">
                {supportedLanguages.map((lang) => (
                  <button
                    key={lang.code}
                    className={`lang-option-item ${currentLang === lang.code ? "selected" : ""}`}
                    onClick={() => {
                      onLanguageChange(lang.code);
                      setLangMenuOpen(false);
                    }}
                  >
                    <span className="lang-flag">{lang.flag}</span>
                    <span className="lang-native">{lang.nativeLabel}</span>
                    <span className="lang-en-label">({lang.label})</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Auth State Button */}
          {user && user.isLoggedIn ? (
            <div className="user-profile-menu-wrap">
              <button
                className="user-profile-btn"
                onClick={() => {
                  setUserMenuOpen(!userMenuOpen);
                  setLangMenuOpen(false);
                }}
              >
                <div className="user-avatar-badge">
                  {user.name.charAt(0)}
                </div>
                <span className="user-name-text">{user.name}</span>
                <span className="online-dot" />
                <ChevronDown size={13} />
              </button>

              {userMenuOpen && (
                <div className="user-dropdown-card">
                  <div className="user-card-head">
                    <strong>{user.name}</strong>
                    <small>{user.phone || user.email}</small>
                    <span className="verified-badge">
                      <Shield size={11} /> Verified Farmer
                    </span>
                  </div>
                  <div className="dropdown-divider" />
                  <button 
                    className="user-menu-item"
                    onClick={() => { onNavigate("map-section"); setUserMenuOpen(false); }}
                  >
                    <MapPin size={15} /> My Lands (1 Parcel)
                  </button>
                  <button 
                    className="user-menu-item"
                    onClick={() => { onNavigate("device-section"); setUserMenuOpen(false); }}
                  >
                    <Radio size={15} /> ABZ-001 Connected
                  </button>
                  <div className="dropdown-divider" />
                  <button 
                    className="user-menu-item sign-out-item"
                    onClick={() => { onSignOut(); setUserMenuOpen(false); }}
                  >
                    <LogOut size={15} /> {t("signOut")}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-action-group">
              <button
                className="sign-in-text-btn"
                onClick={() => onOpenAuth(t("signIn"))}
              >
                {t("signIn")}
              </button>
              <button
                className="get-started-btn"
                onClick={() => onOpenAuth(t("getStarted"))}
              >
                {t("getStarted")}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
