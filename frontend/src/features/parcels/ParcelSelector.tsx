import { ShieldCheck, UserCheck, Edit3, MapPin, Plus } from "lucide-react";
import type { CadastralParcel } from "../../data/demo";

interface ParcelSelectorProps {
  selectedParcel: CadastralParcel;
  onOpenAuth: (actionDesc: string) => void;
  onOpenAddLand: () => void;
  onStartManualDraw: () => void;
  isLoggedIn: boolean;
  t: (key: string) => string;
}

export function ParcelSelector({
  selectedParcel,
  onOpenAuth,
  onOpenAddLand,
  onStartManualDraw,
  isLoggedIn,
  t,
}: ParcelSelectorProps) {
  const isCadastral = (selectedParcel as any).boundarySource === "cadastral" || (!("boundarySource" in selectedParcel) && selectedParcel.id.startsWith("PARCEL-00"));

  return (
    <div className="selected-land-panel">
      <div className="land-card-image-wrap">
        <img
          src={selectedParcel.image}
          alt={selectedParcel.name}
          className="land-card-img"
        />
        <span className="land-demo-badge">
          {isCadastral ? <ShieldCheck size={12} /> : <UserCheck size={12} />}
          {isCadastral ? "Authoritative Cadastre" : "Manual Boundary"}
        </span>
      </div>

      <div className="land-card-body">
        <div className="land-title-group">
          <h3 className="land-name">{selectedParcel.name}</h3>
          <span className="land-sy-no">{selectedParcel.surveyNumber}</span>
        </div>

        {/* Boundary Source Transparency */}
        <div className="boundary-source-pill-row">
          {isCadastral ? (
            <span className="source-pill cadastral">
              ✓ Verified Bhoomi Survey (98% Match)
            </span>
          ) : (
            <span className="source-pill manual">
              ✎ Farmer Manual Boundary (Unverified)
            </span>
          )}
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
          <span className="fallback-prompt">Can't find your exact survey parcel?</span>
          <button
            type="button"
            className="draw-manually-link"
            onClick={() => {
              if (!isLoggedIn) {
                onOpenAuth("Draw Land Manually");
              } else {
                onStartManualDraw();
              }
            }}
          >
            <Edit3 size={12} />
            <span>Draw Field Boundary Manually</span>
          </button>
        </div>
      </div>
    </div>
  );
}
