import { useState } from "react";
import { ArrowRight, Sprout, X } from "lucide-react";
import { cropLibrary, type CropInfo } from "../data/demo";

interface CropIntelligenceProps {
  onOpenAuth: (actionDesc: string) => void;
  isLoggedIn: boolean;
  t: (key: string) => string;
}

export function CropIntelligence({ onOpenAuth, isLoggedIn, t }: CropIntelligenceProps) {
  const [activeCrop, setActiveCrop] = useState<CropInfo | null>(null);

  const previewCrops = cropLibrary.slice(0, 3); // Tomato, Rice, Maize

  return (
    <div className="feature-column-card crops-feature-card" id="crops-section">
      <div className="card-head-row">
        <div>
          <h3 className="card-column-title">Crop Intelligence</h3>
          <p className="card-column-subtitle">Tailored recommendations by crop</p>
        </div>
        <button
          className="view-all-link"
          onClick={() => setActiveCrop(cropLibrary[0])}
        >
          <span>{t("viewAllCrops")}</span>
          <ArrowRight size={14} />
        </button>
      </div>

      {/* Horizontal Crop Cards */}
      <div className="crops-preview-list">
        {previewCrops.map((crop) => (
          <div
            key={crop.id}
            className="crop-preview-tile"
            onClick={() => setActiveCrop(crop)}
            role="button"
            tabIndex={0}
          >
            <div className="crop-img-wrap">
              <img src={crop.image} alt={crop.name} className="crop-img" />
            </div>
            <div className="crop-meta-wrap">
              <h4 className="crop-name">{crop.name}</h4>
              <span className="crop-req-link">{t("viewRequirements")}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="crops-bottom-cta">
        <button
          className="btn-outline-full"
          onClick={() => setActiveCrop(cropLibrary[0])}
        >
          <Sprout size={14} />
          <span>Explore All 7 Supported Crops</span>
        </button>
      </div>

      {/* Crop Requirements Modal */}
      {activeCrop && (
        <div className="crop-modal-backdrop" onClick={() => setActiveCrop(null)}>
          <div className="crop-modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="crop-close-btn" onClick={() => setActiveCrop(null)}>
              <X size={18} />
            </button>

            <div className="crop-modal-header">
              <img src={activeCrop.image} alt={activeCrop.name} className="crop-modal-thumb" />
              <div>
                <h3 className="crop-modal-title">{activeCrop.name}</h3>
                <p className="crop-modal-sci">{activeCrop.scientificName}</p>
              </div>
            </div>

            <div className="crop-specs-table">
              <div className="spec-row">
                <span className="spec-lbl">Optimal Soil pH:</span>
                <strong className="spec-val">{activeCrop.phRange}</strong>
              </div>
              <div className="spec-row">
                <span className="spec-lbl">Moisture Target:</span>
                <strong className="spec-val">{activeCrop.optimalMoisture}</strong>
              </div>
              <div className="spec-row">
                <span className="spec-lbl">Recommended NPK:</span>
                <strong className="spec-val">{activeCrop.npkRequirement}</strong>
              </div>
              <div className="spec-row">
                <span className="spec-lbl">Duration:</span>
                <strong className="spec-val">{activeCrop.durationDays}</strong>
              </div>
              <div className="spec-row">
                <span className="spec-lbl">Yield Potential:</span>
                <strong className="spec-val">{activeCrop.yieldPotential}</strong>
              </div>
            </div>

            <div className="crop-tip-box">
              <span className="tip-title">Agronomic Insight:</span>
              <p className="tip-desc">{activeCrop.keyNutrientTip}</p>
            </div>

            <div className="crop-modal-actions">
              <button
                className="btn-accent-sm full-w"
                onClick={() => {
                  setActiveCrop(null);
                  if (!isLoggedIn) {
                    onOpenAuth(`Connect Land for ${activeCrop.name} Analysis`);
                  } else {
                    const el = document.getElementById("ai-section");
                    el?.scrollIntoView({ behavior: "smooth" });
                  }
                }}
              >
                {isLoggedIn ? `Run ${activeCrop.name} Soil Match` : "Connect Your Land for Analysis"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
