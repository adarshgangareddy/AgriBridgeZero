import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { MobileNav } from "./components/MobileNav";
import { Hero } from "./components/Hero";
import { QuickAccess } from "./components/QuickAccess";
import { HowItWorks } from "./components/HowItWorks";
import { ParcelMap } from "./features/parcels/ParcelMap";
import { SoilSnapshot } from "./components/SoilSnapshot";
import { DeviceSection } from "./components/DeviceSection";
import { CropIntelligence } from "./components/CropIntelligence";
import { MarketplaceSection } from "./components/MarketplaceSection";
import { ServicesSection } from "./components/ServicesSection";
import { AIAssistantSection } from "./components/AIAssistantSection";
import { LanguageSection } from "./components/LanguageSection";
import { WhyAgriBridge } from "./components/WhyAgriBridge";
import { FarmerBanner } from "./components/FarmerBanner";
import { Footer } from "./components/Footer";
import { AuthModal, type UserSession } from "./components/AuthModal";
import { SearchModal } from "./components/SearchModal";
import { AddLandModal } from "./components/AddLandModal";
import { DevicePairingModal } from "./components/DevicePairingModal";
import { demoParcels, cropLibrary, type CadastralParcel, type CropInfo } from "./data/demo";
import { translations, type LanguageCode } from "./data/i18n";
import { fetchUserLands } from "./features/parcels/parcelApi";
import "leaflet/dist/leaflet.css";
import "./App.css";

export function App() {
  const [currentLang, setCurrentLang] = useState<LanguageCode>("en");
  const [user, setUser] = useState<UserSession | null>(() => {
    try {
      const saved = localStorage.getItem("agribridgezero-user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [parcelsList, setParcelsList] = useState<CadastralParcel[]>(() => {
    try {
      const saved = localStorage.getItem("agribridgezero-parcels");
      return saved ? JSON.parse(saved) : demoParcels;
    } catch {
      return demoParcels;
    }
  });

  const [selectedParcel, setSelectedParcel] = useState<CadastralParcel>(parcelsList[0] || demoParcels[0]);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authTargetAction, setAuthTargetAction] = useState<string | undefined>();
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("hero-section");

  // Land & Device Modals
  const [addLandModalOpen, setAddLandModalOpen] = useState(false);
  const [devicePairingModalOpen, setDevicePairingModalOpen] = useState(false);
  const [activePairingCode, setActivePairingCode] = useState("ABZ-8492-7103-5629");
  const [activeCropForPairing, setActiveCropForPairing] = useState<CropInfo>(cropLibrary[0]);

  // Load registered lands from FastAPI backend on mount
  useEffect(() => {
    let isMounted = true;
    fetchUserLands()
      .then((lands) => {
        if (!isMounted || !lands || lands.length === 0) return;
        const mapped: CadastralParcel[] = lands.map((l) => {
          const coords: [number, number][] =
            l.geometry?.type === "Polygon" && l.geometry.coordinates?.[0]
              ? (l.geometry.coordinates[0] as [number, number][]).map(([lng, lat]) => [lat, lng])
              : [[13.0698, 77.7982], [13.0722, 77.8001], [13.0682, 77.8005], [13.0679, 77.7969]];

          const parcelObj: CadastralParcel = {
            id: l.id,
            name: l.name,
            surveyNumber: l.survey_number || "Sy. No. Pending",
            areaAcres: l.area_acres,
            location: l.location,
            soilType: l.soil_type,
            crop: l.crop,
            status: (l.status === "Attention required" || l.status === "Needs review") ? l.status : "Healthy",
            lastScan: l.last_scan || "Just now",
            image: l.image_url || "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=600&auto=format&fit=crop&q=80",
            coordinates: coords,
            snapshot: {
              ph: { value: 6.5, status: "Suitable" },
              nitrogen: { value: "Medium", status: "Good" },
              phosphorus: { value: "Low", status: "Attention" },
              potassium: { value: "Good", status: "Good" },
              moisture: { value: 32, status: "Moderate" },
              ec: { value: 0.68, status: "Normal" },
            },
            weather: { temp: 28, condition: "Sunny", humidity: 56, wind: 12, rainfall: 0 },
          };
          (parcelObj as any).boundarySource = l.boundary_source;
          return parcelObj;
        });

        setParcelsList(mapped);
        setSelectedParcel(mapped[0]);
      })
      .catch((err) => {
        console.warn("Backend lands API unreachable, retaining demo fallback:", err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Multilanguage translation helper
  const t = (key: string): string => {
    return translations[currentLang]?.[key] || translations.en[key] || key;
  };

  const handleOpenAuth = (actionDesc?: string) => {
    setAuthTargetAction(actionDesc);
    setAuthModalOpen(true);
  };

  const handleSignOut = () => {
    localStorage.removeItem("agribridgezero-user");
    setUser(null);
  };

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleLandAdded = (newParcel: CadastralParcel, pairingCode: string, selectedCrop: CropInfo) => {
    const updated = [newParcel, ...parcelsList];
    setParcelsList(updated);
    setSelectedParcel(newParcel);
    setActivePairingCode(pairingCode);
    setActiveCropForPairing(selectedCrop);
    try {
      localStorage.setItem("agribridgezero-parcels", JSON.stringify(updated));
    } catch (err) {
      console.warn("Storage notice:", err);
    }
    setDevicePairingModalOpen(true);
  };

  return (
    <div className="app-layout">
      {/* Desktop Header */}
      <Header
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
        user={user}
        onOpenAuth={handleOpenAuth}
        onSignOut={handleSignOut}
        onOpenSearch={() => setSearchModalOpen(true)}
        onNavigate={handleNavigate}
        t={t}
      />

      {/* Mobile Top & Bottom Navigation */}
      <MobileNav
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
        user={user}
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onOpenAuth={handleOpenAuth}
        onOpenSearch={() => setSearchModalOpen(true)}
        t={t}
      />

      <main className="main-content-flow">
        {/* 1. Hero Section */}
        <Hero
          onExplorePlatform={() => handleNavigate("quick-access")}
          onExploreDevice={() => handleNavigate("device-section")}
          t={t}
        />

        {/* 2. Quick Access Cards */}
        <QuickAccess
          onNavigate={handleNavigate}
          onOpenAuth={handleOpenAuth}
          isLoggedIn={!!user?.isLoggedIn}
          t={t}
        />

        {/* 3. How It Works (4 Linear Steps) */}
        <HowItWorks t={t} />

        {/* 4. Interactive Farmland Map with Authoritative GeoJSON & Manual Drawing */}
        <ParcelMap
          selectedParcel={selectedParcel}
          onSelectParcel={setSelectedParcel}
          onOpenAuth={handleOpenAuth}
          onOpenAddLand={() => setAddLandModalOpen(true)}
          allParcels={parcelsList}
          onLandCreated={(l) => handleLandAdded(l, "ABZ-2026-9901-4412", activeCropForPairing)}
          isLoggedIn={!!user?.isLoggedIn}
          t={t}
        />

        {/* 5. Latest Soil Snapshot & Weather */}
        <SoilSnapshot
          parcel={selectedParcel}
          onOpenAuth={handleOpenAuth}
          isLoggedIn={!!user?.isLoggedIn}
          t={t}
        />

        {/* 6. 3-Column Feature Row: Device, Crop Intelligence, Marketplace */}
        <section className="three-column-feature-section">
          <div className="section-container">
            <div className="three-col-grid">
              <DeviceSection
                onOpenAuth={handleOpenAuth}
                isLoggedIn={!!user?.isLoggedIn}
                t={t}
              />
              <CropIntelligence
                onOpenAuth={handleOpenAuth}
                isLoggedIn={!!user?.isLoggedIn}
                t={t}
              />
              <MarketplaceSection
                onOpenAuth={handleOpenAuth}
                isLoggedIn={!!user?.isLoggedIn}
                t={t}
              />
            </div>
          </div>
        </section>

        {/* 7. Services Section (6 Cards) */}
        <ServicesSection
          onOpenAuth={handleOpenAuth}
          isLoggedIn={!!user?.isLoggedIn}
          t={t}
        />

        {/* 8. AI Intelligence Section */}
        <AIAssistantSection
          currentLang={currentLang}
          onOpenAuth={handleOpenAuth}
          isLoggedIn={!!user?.isLoggedIn}
          t={t}
        />

        {/* 9. Local Language Section */}
        <LanguageSection
          currentLang={currentLang}
          onSelectLanguage={setCurrentLang}
          t={t}
        />

        {/* 10. Why AgriBridgeZero (6 Comparison Pillars) */}
        <WhyAgriBridge t={t} />

        {/* 11. Farmer Story Banner */}
        <FarmerBanner t={t} />
      </main>

      {/* 12. Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenAuth={handleOpenAuth}
        isLoggedIn={!!user?.isLoggedIn}
        t={t}
      />

      {/* Interactive Add Land Modal with Geolocation, Cadastre Query & 10 Crops */}
      <AddLandModal
        isOpen={addLandModalOpen}
        onClose={() => setAddLandModalOpen(false)}
        onLandAdded={handleLandAdded}
      />

      {/* Device Pairing & Hardware Feature Toggle Modal */}
      <DevicePairingModal
        isOpen={devicePairingModalOpen}
        onClose={() => setDevicePairingModalOpen(false)}
        parcel={selectedParcel}
        pairingCode={activePairingCode}
        crop={activeCropForPairing}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={(newUser) => setUser(newUser)}
        targetAction={authTargetAction}
      />

      {/* Quick Search Modal */}
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        onSelectCrop={(_cropId) => {
          handleNavigate("crops-section");
        }}
        onSelectSection={(sectionId) => {
          handleNavigate(sectionId);
        }}
      />
    </div>
  );
}

export default App;
