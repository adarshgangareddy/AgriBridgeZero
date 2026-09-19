import { supportedLanguages, type LanguageCode } from "../data/i18n";
import { Globe, Check } from "lucide-react";

interface LanguageSectionProps {
  currentLang: LanguageCode;
  onSelectLanguage: (lang: LanguageCode) => void;
  t: (key: string) => string;
}

const sampleTranslations: Record<LanguageCode, { original: string; trans: string }> = {
  en: {
    original: "Phosphorus is below the recommended range for your crop.",
    trans: "Apply single superphosphate (SSP) before the flowering stage.",
  },
  kn: {
    original: "ನಿಮ್ಮ ಮಣ್ಣಿನಲ್ಲಿ ರಂಜಕದ ಮಟ್ಟ ಕಡಿಮೆಯಾಗಿದೆ.",
    trans: "ಹೂವು ಬಿಡುವ ಮುನ್ನ ಸಿಂಗಲ್ ಸೂಪರ್ ಫಾಸ್ಫೇಟ್ (SSP) ರಸಗೊಬ್ಬರವನ್ನು ಅನ್ವಯಿಸಿ.",
  },
  te: {
    original: "మీ నేలలో భాస్వరం స్థాయి సిఫార్సు చేసిన దానికంటే తక్కువగా ఉంది.",
    trans: "పూత దశకు ముందు సింగిల్ సూపర్ ఫాస్ఫేట్ (SSP) ఎరువును వేయండి.",
  },
  hi: {
    original: "आपकी मिट्टी में फास्फोरस का स्तर अनुशंसित मात्रा से कम है।",
    trans: "फूल आने से पहले सिंगल सुपर फॉस्फेट (SSP) खाद का प्रयोग करें।",
  },
  ja: {
    original: "土壌中のリン酸濃度が作物の推奨値を下回っています。",
    trans: "開花期を迎える前に、過リン酸石灰を適量施用してください。",
  },
};

export function LanguageSection({ currentLang, onSelectLanguage, t }: LanguageSectionProps) {
  const currentSample = sampleTranslations[currentLang] || sampleTranslations.en;

  return (
    <section className="language-section" id="language-section">
      <div className="section-container">
        <div className="section-header-centered">
          <div className="section-badge-pill">
            <Globe size={13} />
            <span>Multilingual Soil Advisory</span>
          </div>
          <h2 className="section-heading">{t("techFarmersUnderstand")}</h2>
          <p className="section-subheading">{t("techFarmersSubtitle")}</p>
        </div>

        {/* Language Selection Chips */}
        <div className="lang-chips-row">
          {supportedLanguages.map((lang) => (
            <button
              key={lang.code}
              className={`lang-chip-btn ${currentLang === lang.code ? "selected" : ""}`}
              onClick={() => onSelectLanguage(lang.code)}
            >
              <span className="chip-flag">{lang.flag}</span>
              <span className="chip-native">{lang.nativeLabel}</span>
              <span className="chip-en">({lang.label})</span>
              {currentLang === lang.code && <Check size={14} className="chip-check" />}
            </button>
          ))}
        </div>

        {/* Live Translation Demo Box */}
        <div className="lang-demo-comparison">
          <div className="lang-box english-box">
            <div className="lang-box-header">
              <span className="lang-tag">English (System Standard)</span>
            </div>
            <p className="lang-sample-text">
              "{sampleTranslations.en.original}"
            </p>
            <p className="lang-sub-text">
              "{sampleTranslations.en.trans}"
            </p>
          </div>

          <div className="lang-box native-box">
            <div className="lang-box-header">
              <span className="lang-tag highlight">
                {supportedLanguages.find((l) => l.code === currentLang)?.nativeLabel} (Farmer Output)
              </span>
            </div>
            <p className="lang-sample-text native-font">
              "{currentSample.original}"
            </p>
            <p className="lang-sub-text native-font">
              "{currentSample.trans}"
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
