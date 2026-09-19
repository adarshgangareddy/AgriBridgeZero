import { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import L from "leaflet";
import {
  X,
  Compass,
  MapPin,
  Check,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  AlertCircle,
  Droplets,
  Calendar,
} from "lucide-react";
import {
  soilTypesList,
  irrigationMethods,
  farmingSeasons,
  cropLibrary,
  type CropInfo,
  type CadastralParcel,
} from "../data/demo";
import { fetchCadastreParcelAt, saveLand } from "../features/parcels/parcelApi";
import type { CadastralFeature, GeoJSONPolygonGeometry } from "../api/contracts";

interface AddLandModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLandAdded: (newParcel: CadastralParcel, pairingCode: string, selectedCrop: CropInfo) => void;
}

function MapClickSelector({
  onLocationSelect,
}: {
  onLocationSelect: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function MapCenterUpdater({ center }: { center: LatLngExpression }) {
  const map = useMap();
  map.setView(center, 15, { animate: true });
  return null;
}

// Custom Leaflet pin icon
const pinIcon = L.divIcon({
  className: "custom-point-pin",
  html: `<div style="width: 18px; height: 18px; background: #B76543; border: 3px solid #FFFFFF; border-radius: 50%; box-shadow: 0 2px 8px rgba(0,0,0,0.4);"></div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

export function AddLandModal({ isOpen, onClose, onLandAdded }: AddLandModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Map/Location, 2: Land Details, 3: Crop Selection
  const [coords, setCoords] = useState<[number, number]>([13.0698, 77.7982]);
  const [isLocating, setIsLocating] = useState(false);
  const [locationName, setLocationName] = useState("Hoskote, Bengaluru Rural, Karnataka");
  const [farmName, setFarmName] = useState("My Farm Block 1");
  const [areaAcres, setAreaAcres] = useState<number>(3.5);
  const [selectedSoilType, setSelectedSoilType] = useState(soilTypesList[0].name);
  const [selectedIrrigation, setSelectedIrrigation] = useState(irrigationMethods[0].name);
  const [selectedSeason, setSelectedSeason] = useState(farmingSeasons[0].name);
  const [selectedCrop, setSelectedCrop] = useState<CropInfo>(cropLibrary[0]);

  // Real authoritative cadastre lookup
  const [cadastreParcel, setCadastreParcel] = useState<CadastralFeature | null>(null);
  const [checkedCoord, setCheckedCoord] = useState<string>("");
  const isCheckingCadastre = checkedCoord !== `${coords[0]},${coords[1]}`;

  // When coordinates change, query the authoritative cadastre API
  useEffect(() => {
    let isMounted = true;
    fetchCadastreParcelAt(coords[1], coords[0])
      .then((feature) => {
        if (!isMounted) return;
        if (feature) {
          setCadastreParcel(feature);
          if (feature.properties.area_acres) {
            setAreaAcres(feature.properties.area_acres);
          }
        } else {
          setCadastreParcel(null);
        }
      })
      .catch(() => {
        if (isMounted) setCadastreParcel(null);
      })
      .finally(() => {
        if (isMounted) setCheckedCoord(`${coords[0]},${coords[1]}`);
      });

    return () => {
      isMounted = false;
    };
  }, [coords]);

  if (!isOpen) return null;

  // Browser Geolocation integration ("Turn On Location")
  const handleTurnOnLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLat = position.coords.latitude;
        const newLng = position.coords.longitude;
        setCoords([newLat, newLng]);
        setLocationName(`Near GPS (${newLat.toFixed(4)}°N, ${newLng.toFixed(4)}°E)`);
        setIsLocating(false);
      },
      (error) => {
        console.warn("Geolocation notice:", error);
        setCoords([13.0698, 77.7982]);
        setLocationName("Bengaluru Rural, Karnataka");
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleMapClick = (lat: number, lng: number) => {
    setCoords([lat, lng]);
    setLocationName(`Selected Point (${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E)`);
  };

  // Generate 12-digit hardware pairing ID: ABZ-XXXX-XXXX-XXXX
  const generate12DigitId = () => {
    const randPart = () => Math.floor(1000 + Math.random() * 9000);
    return `ABZ-${randPart()}-${randPart()}-${randPart()}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const pairingCode = generate12DigitId();

    // Prepare GeoJSON geometry: use authoritative polygon if found, else a point-box
    let geometry: GeoJSONPolygonGeometry;
    let boundarySource: "cadastral" | "manual" = "manual";
    let cadastreId: string | undefined;

    if (cadastreParcel && cadastreParcel.geometry.type === "Polygon") {
      geometry = cadastreParcel.geometry as GeoJSONPolygonGeometry;
      boundarySource = "cadastral";
      cadastreId = cadastreParcel.id;
    } else {
      // Manual farmer point geometry: define a basic 4-corner boundary around point
      const delta = 0.001;
      const [lat, lng] = coords;
      geometry = {
        type: "Polygon",
        coordinates: [
          [
            [lng - delta, lat - delta],
            [lng + delta, lat - delta],
            [lng + delta, lat + delta],
            [lng - delta, lat + delta],
            [lng - delta, lat - delta],
          ],
        ],
      };
      boundarySource = "manual";
    }

    const leafletCoords = geometry.coordinates[0].map(([gLng, gLat]): [number, number] => [gLat, gLng]);

    try {
      const savedLand = await saveLand({
        name: farmName.trim() || "My New Farmland",
        survey_number: cadastreParcel ? cadastreParcel.properties.survey_number : `Manual Sy. No.`,
        area_acres: Number(areaAcres),
        location: locationName,
        soil_type: selectedSoilType,
        crop: selectedCrop.name,
        boundary_source: boundarySource,
        cadastre_id: cadastreId,
        pairing_code: pairingCode,
        geometry,
        image_url: selectedCrop.image,
      });

      const newParcel: CadastralParcel = {
        id: savedLand.id,
        surveyNumber: savedLand.survey_number || "Sy. No. Pending",
        name: savedLand.name,
        areaAcres: savedLand.area_acres,
        location: savedLand.location,
        soilType: savedLand.soil_type,
        crop: savedLand.crop,
        status: "Healthy",
        lastScan: "Just now",
        coordinates: leafletCoords,
        image: selectedCrop.image,
        snapshot: {
          ph: { value: 6.5, status: "Suitable" },
          nitrogen: { value: "Medium", status: "Good" },
          phosphorus: { value: "Low", status: "Attention" },
          potassium: { value: "Good", status: "Good" },
          moisture: { value: 32, status: "Moderate" },
          ec: { value: 0.68, status: "Normal" },
        },
        weather: {
          temp: 28,
          condition: "Clear Sky",
          humidity: 58,
          wind: 11,
          rainfall: 0,
        },
      };
      (newParcel as any).boundarySource = boundarySource;

      onLandAdded(newParcel, pairingCode, selectedCrop);
      onClose();
    } catch (err) {
      console.warn("Could not save to backend, fallback to local state:", err);
      // Fallback
      const newParcel: CadastralParcel = {
        id: `PARCEL-${Date.now().toString().slice(-4)}`,
        surveyNumber: cadastreParcel ? cadastreParcel.properties.survey_number : `Sy. No. Pending`,
        name: farmName.trim() || "My New Farmland",
        areaAcres: Number(areaAcres),
        location: locationName,
        soilType: selectedSoilType,
        crop: selectedCrop.name,
        status: "Attention required",
        lastScan: "Just now",
        coordinates: leafletCoords,
        image: selectedCrop.image,
        snapshot: {
          ph: { value: 6.5, status: "Suitable" },
          nitrogen: { value: "Medium", status: "Good" },
          phosphorus: { value: "Low", status: "Attention" },
          potassium: { value: "Good", status: "Good" },
          moisture: { value: 32, status: "Moderate" },
          ec: { value: 0.68, status: "Normal" },
        },
        weather: {
          temp: 28,
          condition: "Clear Sky",
          humidity: 58,
          wind: 11,
          rainfall: 0,
        },
      };
      (newParcel as any).boundarySource = boundarySource;
      onLandAdded(newParcel, pairingCode, selectedCrop);
      onClose();
    }
  };

  return (
    <div className="add-land-backdrop" onClick={onClose}>
      <div className="add-land-modal" onClick={(e) => e.stopPropagation()}>
        {/* Modal Top Bar */}
        <div className="add-land-header">
          <div>
            <span className="step-tracker-pill">Step {step} of 3</span>
            <h2 className="add-land-title">
              {step === 1 && "Select Land Location on Map"}
              {step === 2 && "Configure Land & Soil Profile"}
              {step === 3 && "Select Your Primary Crop"}
            </h2>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* STEP 1: GEOLOCATION & MAP PINNING */}
        {step === 1 && (
          <div className="add-land-body step-map-flow">
            <div className="location-toolbar">
              <button
                type="button"
                className="gps-detect-btn"
                onClick={handleTurnOnLocation}
                disabled={isLocating}
              >
                <Compass size={16} className={isLocating ? "spinning" : ""} />
                <span>
                  {isLocating
                    ? "Locating Your Farm via GPS..."
                    : "📍 Turn On Location (Auto-Detect Farm)"}
                </span>
              </button>

              <div className="location-tip-txt">
                Click anywhere on the map to inspect parcel boundaries or drop your farm pin.
              </div>
            </div>

            {/* Cadastral Boundary Status Banner */}
            <div className={`cadastre-status-banner ${cadastreParcel ? "verified" : "manual"}`}>
              {cadastreParcel ? (
                <>
                  <ShieldCheck size={16} className="status-icon" />
                  <span>
                    ✓ Verified Bhoomi Cadastre Found:{" "}
                    <strong>{cadastreParcel.properties.survey_number}</strong> (
                    {cadastreParcel.properties.village}, {cadastreParcel.properties.taluk}) —{" "}
                    {cadastreParcel.properties.area_acres} Acres
                  </span>
                </>
              ) : (
                <>
                  <AlertCircle size={16} className="status-icon manual" />
                  <span>
                    {isCheckingCadastre
                      ? "Checking cadastre database..."
                      : "No verified parcel boundary is available here. Dropping point pin (Manual Boundary)."}
                  </span>
                </>
              )}
            </div>

            <div className="map-picker-container">
              <MapContainer
                center={coords}
                zoom={15}
                scrollWheelZoom={false}
                className="map-picker-canvas"
              >
                <TileLayer
                  url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                  attribution="&copy; Esri World Imagery"
                />
                <MapCenterUpdater center={coords} />
                <MapClickSelector onLocationSelect={handleMapClick} />

                {/* Render authoritative GeoJSON feature if present */}
                {cadastreParcel && (
                  <GeoJSON
                    key={cadastreParcel.id}
                    data={cadastreParcel as any}
                    style={{
                      color: "#34D399",
                      weight: 3,
                      fillColor: "#10B981",
                      fillOpacity: 0.35,
                    }}
                  />
                )}

                {/* Always render point pin */}
                <Marker position={coords} icon={pinIcon} />
              </MapContainer>

              <div className="map-picker-pill">
                <MapPin size={14} className="map-pin-icon" />
                <span className="picker-coords">
                  {coords[0].toFixed(4)}°N, {coords[1].toFixed(4)}°E
                </span>
                <span className="picker-loc-tag">{locationName}</span>
              </div>
            </div>

            <div className="add-land-footer-nav">
              <div className="selected-summary-badge">
                {cadastreParcel ? <ShieldCheck size={14} /> : <UserCheck size={14} />}
                <span>
                  {cadastreParcel
                    ? `Authoritative Cadastre (${areaAcres} Acres)`
                    : `Point Pin (${areaAcres} Acres)`}
                </span>
              </div>
              <button
                type="button"
                className="modal-next-btn"
                onClick={() => setStep(2)}
              >
                <span>Continue to Land Details</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: LAND PROFILE PICKLISTS */}
        {step === 2 && (
          <div className="add-land-body step-details-flow">
            <div className="form-group-row">
              <div className="form-field-box">
                <label className="field-label">Farm / Parcel Name</label>
                <input
                  type="text"
                  className="text-input-field"
                  value={farmName}
                  onChange={(e) => setFarmName(e.target.value)}
                  placeholder="e.g. North Plot - Tomato Field"
                  required
                />
              </div>

              <div className="form-field-box">
                <label className="field-label">Area in Acres</label>
                <input
                  type="number"
                  step="0.1"
                  min="0.2"
                  max="1000"
                  className="text-input-field"
                  value={areaAcres}
                  onChange={(e) => setAreaAcres(parseFloat(e.target.value) || 1)}
                  required
                />
              </div>
            </div>

            <div className="picklists-grid">
              {/* Soil Type Picklist */}
              <div className="picklist-column">
                <label className="field-label">Soil Type (Pick from list)</label>
                <div className="pick-cards-list">
                  {soilTypesList.map((soil) => (
                    <button
                      type="button"
                      key={soil.name}
                      className={`pick-option-card ${selectedSoilType === soil.name ? "active" : ""}`}
                      onClick={() => setSelectedSoilType(soil.name)}
                    >
                      <div className="pick-card-head">
                        <span className="pick-name">{soil.name}</span>
                        {selectedSoilType === soil.name && <Check size={14} className="check-icon" />}
                      </div>
                      <span className="pick-desc">{soil.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Irrigation Method Picklist */}
              <div className="picklist-column">
                <label className="field-label">Irrigation Method</label>
                <div className="pick-cards-list">
                  {irrigationMethods.map((irr) => (
                    <button
                      type="button"
                      key={irr.name}
                      className={`pick-option-card ${selectedIrrigation === irr.name ? "active" : ""}`}
                      onClick={() => setSelectedIrrigation(irr.name)}
                    >
                      <div className="pick-card-head">
                        <span className="pick-name">
                          <Droplets size={12} className="inline-icon" /> {irr.name}
                        </span>
                        {selectedIrrigation === irr.name && <Check size={14} className="check-icon" />}
                      </div>
                      <span className="pick-desc">{irr.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Farming Season Picklist */}
              <div className="picklist-column">
                <label className="field-label">Farming Season</label>
                <div className="pick-cards-list">
                  {farmingSeasons.map((season) => (
                    <button
                      type="button"
                      key={season.name}
                      className={`pick-option-card ${selectedSeason === season.name ? "active" : ""}`}
                      onClick={() => setSelectedSeason(season.name)}
                    >
                      <div className="pick-card-head">
                        <span className="pick-name">
                          <Calendar size={12} className="inline-icon" /> {season.name}
                        </span>
                        {selectedSeason === season.name && <Check size={14} className="check-icon" />}
                      </div>
                      <span className="pick-desc">{season.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="add-land-footer-nav">
              <button
                type="button"
                className="modal-back-btn"
                onClick={() => setStep(1)}
              >
                Back to Map
              </button>
              <button
                type="button"
                className="modal-next-btn"
                onClick={() => setStep(3)}
              >
                <span>Select Crops (Step 3)</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: VISUAL 10-CROP SELECTOR */}
        {step === 3 && (
          <div className="add-land-body step-crop-flow">
            <div className="crop-grid-header">
              <p className="crop-sub-desc">
                Select your primary planned crop. AgriBridgeZero AI will immediately calculate
                compatibility with your <strong>{selectedSoilType}</strong> soil and provide
                watering, fertilizer, and soil care schedules.
              </p>
            </div>

            <div className="crops-visual-grid">
              {cropLibrary.map((crop) => (
                <div
                  key={crop.id}
                  className={`crop-select-card ${selectedCrop.id === crop.id ? "selected" : ""}`}
                  onClick={() => setSelectedCrop(crop)}
                >
                  <div className="crop-card-image-wrap">
                    <img src={crop.image} alt={crop.name} className="crop-card-img" />
                    {selectedCrop.id === crop.id && (
                      <span className="crop-selected-badge">
                        <Check size={12} />
                      </span>
                    )}
                    <span className="crop-category-tag">{crop.durationDays}</span>
                  </div>

                  <div className="crop-card-info">
                    <h4 className="crop-name-title">{crop.name}</h4>
                    <span className="crop-sci-name">{crop.scientificName}</span>
                    <span className="crop-season-pill">{crop.optimalMoisture}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="add-land-footer-nav">
              <button
                type="button"
                className="modal-back-btn"
                onClick={() => setStep(2)}
              >
                Back to Land Details
              </button>
              <button
                type="button"
                className="modal-submit-btn"
                onClick={handleSubmit}
              >
                <span>Connect ABZ-001 Hardware & Pair</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
