import { useState, useMemo } from "react";
import { 
  MapContainer, 
  TileLayer, 
  Polygon, 
  useMap 
} from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import { 
  Search, 
  Edit3, 
  Plus, 
  ArrowUpRight, 
  ShieldCheck,
  MapPin
} from "lucide-react";
import { demoParcels, type CadastralParcel } from "../data/demo";

interface FarmlandMapProps {
  selectedParcel: CadastralParcel;
  onSelectParcel: (parcel: CadastralParcel) => void;
  onOpenAuth: (actionDesc: string) => void;
  onOpenAddLand: () => void;
  allParcels: CadastralParcel[];
  isLoggedIn: boolean;
  t: (key: string) => string;
}

function MapViewController({ center, zoom }: { center: LatLngExpression; zoom: number }) {
  const map = useMap();
  map.setView(center, zoom, { animate: true });
  return null;
}

export function FarmlandMap({
  selectedParcel,
  onSelectParcel,
  onOpenAuth,
  onOpenAddLand,
  allParcels,
  isLoggedIn,
  t,
}: FarmlandMapProps) {
  const [mapType, setMapType] = useState<"satellite" | "standard">("satellite");
  const [searchQuery, setSearchQuery] = useState("");
  const [manualDrawMode, setManualDrawMode] = useState(false);

  // Calculate polygon center for label
  const polygonCenter = useMemo(() => {
    const lats = selectedParcel.coordinates.map((c) => c[0]);
    const lngs = selectedParcel.coordinates.map((c) => c[1]);
    return [
      (Math.min(...lats) + Math.max(...lats)) / 2,
      (Math.min(...lngs) + Math.max(...lngs)) / 2,
    ] as [number, number];
  }, [selectedParcel]);

  const tileUrl =
    mapType === "satellite"
      ? "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
      : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

  const attribution =
    mapType === "satellite"
      ? "&copy; Esri &mdash; World Imagery"
      : "&copy; OpenStreetMap contributors";

  const handleLocationSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim().length > 0) {
      // Find matching parcel or simulate jump to Hoskote / Bengaluru
      const match = demoParcels.find((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
      if (match) {
        onSelectParcel(match);
      }
    }
  };

  return (
    <section className="map-section" id="map-section">
      <div className="section-container">
        {/* Section Header */}
        <div className="section-header-row map-header-row">
          <div>
            <h2 className="section-heading">{t("mapSectionTitle")}</h2>
            <p className="section-subheading">{t("mapSectionSubtitle")}</p>
          </div>
          <button 
            className="view-all-link"
            onClick={() => {
              if (!isLoggedIn) onOpenAuth("Full Cadastral Map");
            }}
          >
            <span>{t("openFullMap")}</span>
            <ArrowUpRight size={14} />
          </button>
        </div>

        {/* Search & Map Type Switcher Bar */}
        <div className="map-controls-bar">
          <form onSubmit={handleLocationSearch} className="map-search-form">
            <Search size={16} className="map-search-icon" />
            <input
              type="text"
              className="map-search-input"
              placeholder={t("searchMapPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="map-search-btn">
              Search
            </button>
          </form>

          <button
            type="button"
            className="add-land-quick-trigger"
            onClick={onOpenAddLand}
          >
            <MapPin size={14} />
            <span>+ Add Land (Turn On Location)</span>
          </button>

          <div className="map-toggle-group">
            <button
              type="button"
              className={`map-toggle-btn ${mapType === "standard" ? "active" : ""}`}
              onClick={() => setMapType("standard")}
            >
              {t("mapView")}
            </button>
            <button
              type="button"
              className={`map-toggle-btn ${mapType === "satellite" ? "active" : ""}`}
              onClick={() => setMapType("satellite")}
            >
              {t("satelliteView")}
            </button>
          </div>
        </div>

        {/* Map Layout Grid: 65% Map, 35% Info Panel */}
        <div className="map-layout-grid">
          {/* Map Viewport Container */}
          <div className="map-viewport-wrapper">
            <MapContainer
              center={polygonCenter}
              zoom={15}
              scrollWheelZoom={false}
              className="interactive-leaflet-map"
            >
              <TileLayer url={tileUrl} attribution={attribution} maxZoom={19} />
              <MapViewController center={polygonCenter} zoom={15} />

              {/* Render all parcels (default + custom added) */}
              {allParcels.map((parcel) => {
                const isSelected = parcel.id === selectedParcel.id;
                return (
                  <Polygon
                    key={parcel.id}
                    positions={parcel.coordinates}
                    eventHandlers={{
                      click: () => onSelectParcel(parcel),
                    }}
                    pathOptions={{
                      color: isSelected ? "#34D399" : "#E5E7EB",
                      weight: isSelected ? 3.5 : 1.5,
                      fillColor: isSelected ? "#10B981" : "#F3F4F6",
                      fillOpacity: isSelected ? 0.35 : 0.12,
                      dashArray: isSelected ? undefined : "4, 4",
                    }}
                  />
                );
              })}
            </MapContainer>

            {/* Overlaid Floating Parcel Tag matching design mockup */}
            <div className="map-floating-parcel-pill">
              <span className="parcel-acre-bold">{selectedParcel.areaAcres} Acres</span>
              <span className="parcel-sy-tag">{selectedParcel.surveyNumber}</span>
            </div>

            {/* Subtle Map Legend */}
            <div className="map-layer-indicator">
              <span className="layer-dot active" />
              <span>Cadastral Boundary Layer</span>
            </div>
          </div>

          {/* Right Column: Selected Land Details Card */}
          <div className="selected-land-panel">
            <div className="land-card-image-wrap">
              <img
                src={selectedParcel.image}
                alt={selectedParcel.name}
                className="land-card-img"
              />
              <span className="land-demo-badge">
                <ShieldCheck size={12} />
                {t("selectedLandBadge")}
              </span>
            </div>

            <div className="land-card-body">
              <div className="land-title-group">
                <h3 className="land-name">{selectedParcel.name}</h3>
                <span className="land-sy-no">{selectedParcel.surveyNumber}</span>
              </div>

              <div className="land-meta-list">
                <div className="land-meta-item">
                  <span className="meta-label">{t("areaLabel")}:</span>
                  <span className="meta-value">{selectedParcel.areaAcres} acres</span>
                </div>
                <div className="land-meta-item">
                  <span className="meta-label">{t("locationLabel")}:</span>
                  <span className="meta-value">{selectedParcel.location}</span>
                </div>
                <div className="land-meta-item">
                  <span className="meta-label">{t("soilTypeLabel")}:</span>
                  <span className="meta-value">{selectedParcel.soilType}</span>
                </div>
                <div className="land-meta-item">
                  <span className="meta-label">{t("lastScanLabel")}:</span>
                  <span className="meta-value">{selectedParcel.lastScan}</span>
                </div>
              </div>

              <div className="land-action-buttons">
                <button
                  type="button"
                  className="land-primary-btn"
                  onClick={() => {
                    if (!isLoggedIn) {
                      onOpenAuth("View Land Details");
                    } else {
                      const el = document.getElementById("soil-section");
                      el?.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                >
                  {t("viewLandDetails")}
                </button>

                <button
                  type="button"
                  className="land-secondary-btn add-new-land-btn"
                  onClick={onOpenAddLand}
                >
                  <MapPin size={14} />
                  <span>+ Add New Land (Turn On Location)</span>
                </button>

                {!isLoggedIn && (
                  <button
                    type="button"
                    className="land-secondary-btn"
                    onClick={() => onOpenAuth("Add Land to My Account")}
                  >
                    <Plus size={15} />
                    {t("addToMyLands")}
                  </button>
                )}
              </div>

              {/* Cadastral Fallback */}
              <div className="cadastral-fallback-box">
                <span className="fallback-prompt">{t("cantFindBoundary")}</span>
                <button
                  type="button"
                  className="draw-manually-link"
                  onClick={() => {
                    if (!isLoggedIn) {
                      onOpenAuth("Draw Land Manually");
                    } else {
                      setManualDrawMode(!manualDrawMode);
                    }
                  }}
                >
                  <Edit3 size={12} />
                  <span>{t("drawManually")}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
