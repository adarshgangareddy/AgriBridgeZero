interface FooterProps {
  onNavigate: (sectionId: string) => void;
  onOpenAuth: (actionDesc: string) => void;
  isLoggedIn: boolean;
  t: (key: string) => string;
}

export function Footer({ onNavigate, onOpenAuth, isLoggedIn, t }: FooterProps) {
  return (
    <footer className="site-footer">
      <div className="section-container">
        <div className="footer-top-grid">
          {/* Brand Column */}
          <div className="footer-brand-col">
            <div className="footer-logo-row" onClick={() => onNavigate("hero-section")}>
              <img src="/agri-logo.png" alt="AgriBridgeZero" className="footer-logo-img" />
              <div className="brand-text-col">
                <span className="brand-name white">AgriBridgeZero</span>
                <span className="brand-sub light">Soil • Crop • Safe • Smart</span>
              </div>
            </div>
            <p className="footer-tagline-text">
              {t("tagline")}
            </p>
          </div>

          {/* Platform Column */}
          <div className="footer-nav-col">
            <h4 className="footer-col-title">Platform</h4>
            <ul className="footer-link-list">
              <li>
                <button onClick={() => onNavigate("soil-section")}>Soil Intelligence</button>
              </li>
              <li>
                <button onClick={() => onNavigate("ai-section")}>AI Advisor</button>
              </li>
              <li>
                <button onClick={() => {
                  if (!isLoggedIn) onOpenAuth("My Lands");
                  else onNavigate("map-section");
                }}>My Land</button>
              </li>
              <li>
                <button onClick={() => onNavigate("device-section")}>Devices</button>
              </li>
              <li>
                <button onClick={() => onNavigate("crops-section")}>Crops</button>
              </li>
              <li>
                <button onClick={() => onNavigate("marketplace-section")}>Marketplace</button>
              </li>
            </ul>
          </div>

          {/* Resources Column */}
          <div className="footer-nav-col">
            <h4 className="footer-col-title">Resources</h4>
            <ul className="footer-link-list">
              <li>
                <button onClick={() => onNavigate("how-it-works")}>How It Works</button>
              </li>
              <li>
                <button onClick={() => onNavigate("soil-section")}>Soil Knowledge</button>
              </li>
              <li>
                <button onClick={() => onNavigate("crops-section")}>Agricultural Insights</button>
              </li>
              <li>
                <button onClick={() => onNavigate("device-section")}>Device Guide</button>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div className="footer-nav-col">
            <h4 className="footer-col-title">Company</h4>
            <ul className="footer-link-list">
              <li><a href="#about">About AgriBridgeZero</a></li>
              <li><a href="#contact">Contact & Support</a></li>
              <li><a href="#privacy">Privacy Policy</a></li>
              <li><a href="#terms">Terms of Service</a></li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="footer-nav-col">
            <h4 className="footer-col-title">Follow Us</h4>
            <div className="footer-social-links">
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="social-pill-link">
                LinkedIn
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-pill-link">
                Instagram
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="social-pill-link">
                YouTube
              </a>
              <a href="https://github.com" target="_blank" rel="noreferrer" className="social-pill-link">
                GitHub
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom-bar">
          <p className="copyright-txt">
            &copy; 2026 AgriBridgeZero. Built for smarter, more informed agriculture.
          </p>
          <div className="footer-sub-links">
            <span>Soil Intelligence</span>
            <span>•</span>
            <span>Crop Safety</span>
            <span>•</span>
            <span>A Healthier Tomorrow</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
