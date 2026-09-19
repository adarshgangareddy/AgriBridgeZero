import { useState } from "react";
import { Search, X, Sprout, Radio, Activity, ArrowRight } from "lucide-react";
import { cropLibrary, hardwareSpecs } from "../data/demo";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCrop: (cropId: string) => void;
  onSelectSection: (sectionId: string) => void;
}

export function SearchModal({ isOpen, onClose, onSelectCrop, onSelectSection }: SearchModalProps) {
  const [query, setQuery] = useState("");

  if (!isOpen) return null;

  const filteredCrops = cropLibrary.filter(c => 
    c.name.toLowerCase().includes(query.toLowerCase()) || 
    c.scientificName.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="search-backdrop" onClick={onClose}>
      <div className="search-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="search-input-header">
          <Search size={18} className="search-icon-input" />
          <input
            type="text"
            className="search-main-input"
            placeholder="Search crops, services, soil params, device..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          <button className="search-close-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="search-results-box">
          {query.trim() === "" ? (
            <div className="search-quick-links">
              <span className="search-category-label">Quick Suggestions</span>
              <div className="search-chips-row">
                <button className="search-chip" onClick={() => { onSelectSection("map-section"); onClose(); }}>
                  <Activity size={13} /> Sy. No. 128/2A (4.02 Acres)
                </button>
                <button className="search-chip" onClick={() => { onSelectSection("soil-section"); onClose(); }}>
                  <Activity size={13} /> Soil pH & NPK Status
                </button>
                <button className="search-chip" onClick={() => { onSelectSection("device-section"); onClose(); }}>
                  <Radio size={13} /> ABZ-001 Hardware Probe
                </button>
                <button className="search-chip" onClick={() => { onSelectCrop("crop-tomato"); onClose(); }}>
                  <Sprout size={13} /> Tomato (Arka Rakshak)
                </button>
              </div>
            </div>
          ) : (
            <div className="search-filtered-items">
              {filteredCrops.length > 0 && (
                <div className="search-group">
                  <span className="search-category-label">Crops</span>
                  {filteredCrops.map(crop => (
                    <div 
                      key={crop.id} 
                      className="search-item-row"
                      onClick={() => { onSelectCrop(crop.id); onClose(); }}
                    >
                      <img src={crop.image} alt={crop.name} className="search-item-thumb" />
                      <div className="search-item-meta">
                        <span className="search-item-title">{crop.name}</span>
                        <span className="search-item-sub">{crop.scientificName} • pH: {crop.phRange}</span>
                      </div>
                      <ArrowRight size={14} className="search-arrow" />
                    </div>
                  ))}
                </div>
              )}

              {hardwareSpecs.capabilities.some(c => c.toLowerCase().includes(query.toLowerCase())) && (
                <div className="search-group">
                  <span className="search-category-label">Device Features</span>
                  <div 
                    className="search-item-row"
                    onClick={() => { onSelectSection("device-section"); onClose(); }}
                  >
                    <Radio size={18} className="search-item-icon" />
                    <div className="search-item-meta">
                      <span className="search-item-title">AgriBridgeZero ABZ-001 Multi-Sensor Probe</span>
                      <span className="search-item-sub">Spectral, NPK, moisture & depth sensing</span>
                    </div>
                    <ArrowRight size={14} className="search-arrow" />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
