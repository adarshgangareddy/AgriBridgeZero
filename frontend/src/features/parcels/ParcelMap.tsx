import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import { Search, MapPin, ArrowUpRight, AlertCircle } from "lucide-react";
import type { CadastralParcel } from "../../data/demo";
import type { CadastralFeature, CadastralFeatureCollection, GeoJSONPolygonGeometry } from "../../api/contracts";
import { fetchCadastreParcels, fetchCadastreParcelAt, saveLand } from "./parcelApi";
import { ManualParcelDraw } from "./ManualParcelDraw";
import { ParcelSelector } from "./ParcelSelector";

interface ParcelMapProps {
  selectedParcel: CadastralParcel;
  onSelectParcel: (parcel: CadastralParcel) => void;
  onOpenAuth: (actionDesc: string) => void;
  onOpenAddLand: () => void;
  allParcels: CadastralParcel[];
  onLandCreated?: (newLand: CadastralParcel) => void;
  isLoggedIn: boolean;
  t: (key: string) => string;
}

// Controller that calls fitBounds ONLY when the selected parcel ID changes
function MapSelectionController({
  selectedParcelId,
  coordinates,
}: {
  selectedParcelId: string;
  coordinates: [number, number][];
}) {
  const map = useMap();
  const lastIdRef = useRef<string | null>(null);

  useEffect(() => {
    // Only fitBounds when selected parcel ID actually changes to a different parcel
    if (selectedParcelId && selectedParcelId !== lastIdRef.current && coordinates.length > 2) {
      lastIdRef.current = selectedParcelId;
      try {
        const bounds = L.latLngBounds(coordinates);
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 17, animate: true });
      } catch (err) {
        console.warn("Could not fit map bounds:", err);
      }
    }
  }, [selectedParcelId, coordinates, map]);

  return null;
}

// Handler for empty map clicks and viewport movements
function MapInteractionListener({
  isDrawMode,
  onEmptyMapClick,
  onBoundsChange,
}: {
  isDrawMode: boolean;
  onEmptyMapClick: (lng: number, lat: number) => void;
  onBoundsChange: (bbox: string) => void;
}) {
  const map = useMapEvents({
    click(e) {
      if (isDrawMode) return;
      onEmptyMapClick(e.latlng.lng, e.latlng.lat);
    },
    moveend() {
      try {
        const bounds = map.getBounds();
        const bbox = `${bounds.getWest().toFixed(4)},${bounds.getSouth().toFixed(4)},${bounds.getEast().toFixed(4)},${bounds.getNorth().toFixed(4)}`;
        onBoundsChange(bbox);
      } catch {
        // ignore
      }
    },
  });

  return null;
}

export function ParcelMap({
  selectedParcel,
  onSelectParcel,
  onOpenAuth,
  onOpenAddLand,
  allParcels,
  onLandCreated,
  isLoggedIn,
  t,
}: ParcelMapProps) {
  const [mapType, setMapType] = useState<"satellite" | "standard">("satellite");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDrawMode, setIsDrawMode] = useState(false);
  const [cadastreCollection, setCadastreCollection] = useState<CadastralFeatureCollection>({
    type: "FeatureCollection",
    features: [],
  });
  const [feedbackNotice, setFeedbackNotice] = useState<string | null>(null);

  // Initial center [lat, lng]
  const initialCenter = useMemo(() => {
    if (selectedParcel?.coordinates?.length > 0) {
      return selectedParcel.coordinates[0];
    }
    return [13.0698, 77.7982] as [number, number];
  }, [selectedParcel]);

  // Load authoritative GeoJSON parcels on mount
  useEffect(() => {
    let isMounted = true;
    fetchCadastreParcels()
      .then((data) => {
        if (isMounted && data?.features) {
          setCadastreCollection(data);
        }
      })
      .catch((err) => console.warn("Could not load initial cadastre:", err));

    return () => {
      isMounted = false;
    };
  }, []);

  const handleBoundsChange = useCallback((bbox: string) => {
    fetchCadastreParcels(bbox)
      .then((data) => {
        if (data?.features) {
          setCadastreCollection(data);
        }
      })
      .catch(() => {});
  }, []);

  // Handle clicking empty map space
  const handleEmptyMapClick = useCallback(
    async (lng: number, lat: number) => {
      const match = await fetchCadastreParcelAt(lng, lat);
      if (match) {
        // Found an authoritative parcel covering that point
        const geom = match.geometry;
        const coords: [number, number][] = (geom.coordinates[0] as [number, number][]).map(([cLng, cLat]) => [cLat, cLng]);
        const mappedParcel: CadastralParcel = {
          id: match.id || `PARCEL-${match.properties.survey_number}`,
          name: `${match.properties.village} Plot`,
          surveyNumber: match.properties.survey_number,
          areaAcres: match.properties.area_acres,
          location: `${match.properties.taluk}, ${match.properties.district}`,
          soilType: "Red Loamy",
          crop: "Tomato",
          status: "Healthy",
          lastScan: "Just now",
          image: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=600&auto=format&fit=crop&q=80",
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
        (mappedParcel as any).boundarySource = "cadastral";
        onSelectParcel(mappedParcel);
        setFeedbackNotice(null);
      } else {
        // No verified boundary found
        setFeedbackNotice(
          "No verified parcel boundary is available here. Drop a point or draw your boundary."
        );
      }
    },
    [onSelectParcel]
  );

  // Handle clicking an authoritative GeoJSON feature
  const onEachCadastreFeature = useCallback(
    (feature: CadastralFeature, layer: L.Layer) => {
      layer.on({
        click: () => {
          if (isDrawMode) return;
          const geom = feature.geometry;
          const coords: [number, number][] = (geom.coordinates[0] as [number, number][]).map(([cLng, cLat]) => [cLat, cLng]);
          const mappedParcel: CadastralParcel = {
            id: feature.id || `CAD-${feature.properties.survey_number}`,
            name: `${feature.properties.village || "Cadastral"} Field`,
            surveyNumber: feature.properties.survey_number,
            areaAcres: feature.properties.area_acres,
            location: `${feature.properties.taluk || "Hoskote"}, ${feature.properties.district || "Bengaluru Rural"}`,
            soilType: "Red Loamy",
            crop: "Tomato",
            status: "Healthy",
            lastScan: "Just now",
            image: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=600&auto=format&fit=crop&q=80",
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
          (mappedParcel as any).boundarySource = "cadastral";
          onSelectParcel(mappedParcel);
          setFeedbackNotice(null);
        },
      });
    },
    [isDrawMode, onSelectParcel]
  );

  // Style for GeoJSON layer
  const cadastreStyle = useCallback(
    (feature?: any) => {
      const isSelected =
        selectedParcel &&
        (selectedParcel.surveyNumber === feature?.properties?.survey_number ||
          selectedParcel.id === feature?.id);

      return {
        color: isSelected ? "#34D399" : "#E5E7EB",
        weight: isSelected ? 3.5 : 1.5,
        fillColor: isSelected ? "#10B981" : "#F3F4F6",
        fillOpacity: isSelected ? 0.4 : 0.15,
        dashArray: isSelected ? undefined : "4, 4",
      };
    },
    [selectedParcel]
  );

  // Handle completed manual polygon drawing
  const handlePolygonComplete = async (geometry: GeoJSONPolygonGeometry) => {
    setIsDrawMode(false);
    // Convert GeoJSON [lng, lat] to Leaflet [lat, lng]
    const leafletCoords = geometry.coordinates[0].map(([lng, lat]): [number, number] => [lat, lng]);

    try {
      const newLand = await saveLand({
        name: "My Manually Drawn Field",
        survey_number: `Manual Plot`,
        area_acres: 3.5,
        location: "Bengaluru Rural, Karnataka",
        soil_type: "Red Loamy",
        crop: "Tomato",
        boundary_source: "manual", // ALWAYS marked as manual
        geometry,
        image_url: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=600&auto=format&fit=crop&q=80",
      });

      const mapped: CadastralParcel = {
        id: newLand.id,
        name: newLand.name,
        surveyNumber: newLand.survey_number || "Manual Plot",
        areaAcres: newLand.area_acres,
        location: newLand.location,
        soilType: newLand.soil_type,
        crop: newLand.crop,
        status: "Healthy",
        lastScan: newLand.last_scan || "Just now",
        image: newLand.image_url || "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=600&auto=format&fit=crop&q=80",
        coordinates: leafletCoords,
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
      (mapped as any).boundarySource = "manual";

      onSelectParcel(mapped);
      if (onLandCreated) onLandCreated(mapped);
      setFeedbackNotice(null);
    } catch (err) {
      console.warn("Could not save manual boundary to backend:", err);
    }
  };

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
      const match = allParcels.find(
        (p) =>
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

        {/* Empty Map Notice Prompt */}
        {feedbackNotice && (
          <div className="map-feedback-banner">
            <AlertCircle size={16} className="feedback-icon" />
            <span className="feedback-text">{feedbackNotice}</span>
            <button
              type="button"
              className="feedback-draw-btn"
              onClick={() => {
                setFeedbackNotice(null);
                setIsDrawMode(true);
              }}
            >
              Draw Boundary Now
            </button>
            <button
              type="button"
              className="feedback-close-btn"
              onClick={() => setFeedbackNotice(null)}
            >
              &times;
            </button>
          </div>
        )}

        {/* Map Layout Grid: 65% Map, 35% Info Panel */}
        <div className="map-layout-grid">
          {/* Map Viewport Container */}
          <div className="map-viewport-wrapper">
            <MapContainer
              center={initialCenter}
              zoom={15}
              scrollWheelZoom={false}
              className="interactive-leaflet-map"
            >
              <TileLayer url={tileUrl} attribution={attribution} maxZoom={19} />

              {/* Viewport selection controller: calls fitBounds ONLY when selectedParcel.id changes */}
              <MapSelectionController
                selectedParcelId={selectedParcel.id}
                coordinates={selectedParcel.coordinates}
              />

              {/* Empty map click & bounds change listener */}
              <MapInteractionListener
                isDrawMode={isDrawMode}
                onEmptyMapClick={handleEmptyMapClick}
                onBoundsChange={handleBoundsChange}
              />

              {/* GeoJSON Cadastral Layer with standard RFC 7946 coordinates [lng, lat] */}
              {cadastreCollection.features.length > 0 && (
                <GeoJSON
                  key={`geojson-layer-${cadastreCollection.features.length}-${selectedParcel.id}`}
                  data={cadastreCollection as any}
                  style={cadastreStyle}
                  onEachFeature={onEachCadastreFeature as any}
                />
              )}

              {/* Interactive Manual Drawing Tool */}
              <ManualParcelDraw
                isActive={isDrawMode}
                onPolygonComplete={handlePolygonComplete}
                onCancel={() => setIsDrawMode(false)}
              />
            </MapContainer>

            {/* Overlaid Floating Parcel Tag */}
            <div className="map-floating-parcel-pill">
              <span className="parcel-acre-bold">{selectedParcel.areaAcres} Acres</span>
              <span className="parcel-sy-tag">{selectedParcel.surveyNumber}</span>
            </div>

            {/* Label: Demo parcel layer as requested */}
            <div className="map-layer-indicator">
              <span className="layer-dot active" />
              <span>Demo parcel layer</span>
            </div>
          </div>

          {/* Right Column: Selected Land Details Card */}
          <ParcelSelector
            selectedParcel={selectedParcel}
            onOpenAuth={onOpenAuth}
            onOpenAddLand={onOpenAddLand}
            onStartManualDraw={() => setIsDrawMode(true)}
            isLoggedIn={isLoggedIn}
            t={t}
          />
        </div>
      </div>
    </section>
  );
}
