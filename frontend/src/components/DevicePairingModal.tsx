import { useState } from "react";
import { 
  X, 
  Radio, 
  Check, 
  Copy, 
  CheckCircle2, 
  Sliders, 
  AlertTriangle, 
  ArrowRight,
  MessageSquare
} from "lucide-react";
import { 
  evaluateCropSuitability, 
  type CropInfo, 
  type CadastralParcel 
} from "../data/demo";

interface DevicePairingModalProps {
  isOpen: boolean;
  onClose: () => void;
  parcel: CadastralParcel;
  pairingCode: string;
  crop: CropInfo;
  onOpenAIChat?: (initialPrompt?: string) => void;
}

export function DevicePairingModal({
  isOpen,
  onClose,
  parcel,
  pairingCode,
  crop,
  onOpenAIChat,
}: DevicePairingModalProps) {
  const [deviceConnected, setDeviceConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [copied, setCopied] = useState(false);

  // Hardware feature toggles
  const [features, setFeatures] = useState({
    soilChemistry: true,
    moistureTemp: true,
    multiDepth: true,
    contaminantScan: true,
    leafCamera: false,
    cloudSync: true,
  });

  if (!isOpen) return null;

  // Evaluate suitability using our agronomic engine
  const suitability = evaluateCropSuitability(
    crop,
    parcel.soilType,
    parcel.snapshot.ph.value,
    parcel.snapshot.moisture.value
  );

  const handleCopyCode = () => {
    navigator.clipboard.writeText(pairingCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConnectDevice = () => {
    setConnecting(true);
    setTimeout(() => {
      setConnecting(false);
      setDeviceConnected(true);
    }, 1200);
  };

  const toggleFeature = (key: keyof typeof features) => {
    setFeatures((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="pairing-modal-backdrop" onClick={onClose}>
      <div className="pairing-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="pairing-modal-head">
          <div className="pairing-title-col">
            <span className="pairing-badge">
              <Radio size={13} />
              Hardware Device Pairing
            </span>
            <h2 className="pairing-main-title">
              {parcel.name} — Device ID & AI Suitability
            </h2>
          </div>
          <button className="pairing-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="pairing-modal-scroll">
          {/* 12-Digit Pairing Code Banner */}
          <div className="pairing-code-banner">
            <div className="code-meta-col">
              <span className="code-label">12-Digit Unique Device Pairing ID</span>
              <div className="code-display-row">
                <span className="code-digits">{pairingCode}</span>
                <button className="copy-code-btn" onClick={handleCopyCode}>
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copied ? "Copied" : "Copy"}</span>
                </button>
              </div>
              <p className="code-instruction">
                Enter this 12-digit code on the touchscreen of your physical <strong>AgriBridgeZero ABZ-001</strong> device to link this land parcel.
              </p>
            </div>

            <div className="pairing-status-box">
              {deviceConnected ? (
                <div className="connected-status-pill">
                  <span className="live-pulse" />
                  <strong>ABZ-001 Connected</strong>
                  <small>Battery: 96% • Signal: 4G LTE</small>
                </div>
              ) : (
                <button
                  className="quick-pair-btn"
                  onClick={handleConnectDevice}
                  disabled={connecting}
                >
                  {connecting ? (
                    <span>Linking Device via MQTT...</span>
                  ) : (
                    <>
                      <Radio size={14} />
                      <span>Simulate Connect Device</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Location & Land Snapshot */}
          <div className="location-snapshot-row">
            <div className="loc-item">
              <span className="loc-label">Area:</span>
              <strong>{parcel.areaAcres} Acres</strong>
            </div>
            <div className="loc-item">
              <span className="loc-label">Location:</span>
              <strong>{parcel.location}</strong>
            </div>
            <div className="loc-item">
              <span className="loc-label">Soil Type:</span>
              <strong>{parcel.soilType}</strong>
            </div>
            <div className="loc-item">
              <span className="loc-label">Target Crop:</span>
              <strong>{crop.name}</strong>
            </div>
          </div>

          {/* AI CROP SUITABILITY & WHAT TO TAKE CARE OF */}
          <div className="ai-suitability-section">
            <div className="suitability-score-header">
              <div className="score-badge-wrap">
                <span className="score-number">{suitability.score}%</span>
                <span className="score-status">{suitability.status}</span>
              </div>
              <div className="suitability-desc-col">
                <h4>AI Agronomic Analysis for {crop.name}</h4>
                <p>Evaluated against {parcel.soilType} with baseline pH {parcel.snapshot.ph.value}.</p>
              </div>
            </div>

            {/* Suitability Reasons */}
            <div className="suitability-reasons-list">
              {suitability.reasons.map((r, i) => (
                <div key={i} className="suitability-reason-item">
                  <CheckCircle2 size={14} className="reason-check" />
                  <span>{r}</span>
                </div>
              ))}
            </div>

            {/* Actionable Care Guide: What farmer needs to take care of */}
            <div className="care-guide-box">
              <h4 className="care-guide-title">
                <AlertTriangle size={15} className="care-alert-icon" />
                What You Need to Take Care Of for {crop.name}
              </h4>

              <div className="care-cards-grid">
                <div className="care-card">
                  <span className="care-card-title">💧 Irrigation Schedule</span>
                  <p>{suitability.careGuide.watering}</p>
                </div>

                <div className="care-card">
                  <span className="care-card-title">🧪 Fertilizer & Nutrients</span>
                  <p>{suitability.careGuide.fertilizer}</p>
                </div>

                <div className="care-card">
                  <span className="care-card-title">🌱 Soil Treatment</span>
                  <p>{suitability.careGuide.soilTreatment}</p>
                </div>

                <div className="care-card">
                  <span className="care-card-title">⏱️ Critical Growth Stages</span>
                  <p>{suitability.careGuide.criticalPeriod}</p>
                </div>
              </div>
            </div>
          </div>

          {/* HARDWARE SENSING OPTIONS TOGGLE */}
          <div className="hardware-features-toggle-section">
            <div className="features-head">
              <Sliders size={16} />
              <h4>Configure Device Sensing Capabilities</h4>
            </div>
            <p className="features-sub">
              Enable or disable sensing modules for this parcel from here or from the hardware device:
            </p>

            <div className="features-toggle-grid">
              <label className="feature-toggle-label">
                <input
                  type="checkbox"
                  checked={features.soilChemistry}
                  onChange={() => toggleFeature("soilChemistry")}
                />
                <div className="feature-text-col">
                  <strong>Soil Chemistry (pH, EC, NPK)</strong>
                  <span>Continuous macronutrient & electrical conductivity</span>
                </div>
              </label>

              <label className="feature-toggle-label">
                <input
                  type="checkbox"
                  checked={features.moistureTemp}
                  onChange={() => toggleFeature("moistureTemp")}
                />
                <div className="feature-text-col">
                  <strong>Moisture & Soil Temperature</strong>
                  <span>Real-time volumetric water content telemetry</span>
                </div>
              </label>

              <label className="feature-toggle-label">
                <input
                  type="checkbox"
                  checked={features.multiDepth}
                  onChange={() => toggleFeature("multiDepth")}
                />
                <div className="feature-text-col">
                  <strong>Multi-Depth Sensing (0-60 cm)</strong>
                  <span>Topsoil (0-10cm), Mid (10-30cm), Deep (30-60cm)</span>
                </div>
              </label>

              <label className="feature-toggle-label">
                <input
                  type="checkbox"
                  checked={features.contaminantScan}
                  onChange={() => toggleFeature("contaminantScan")}
                />
                <div className="feature-text-col">
                  <strong>Heavy Metal & Toxicity Alerts</strong>
                  <span>Lead, cadmium, arsenic & chemical residues</span>
                </div>
              </label>

              <label className="feature-toggle-label">
                <input
                  type="checkbox"
                  checked={features.leafCamera}
                  onChange={() => toggleFeature("leafCamera")}
                />
                <div className="feature-text-col">
                  <strong>Leaf Disease AI Camera</strong>
                  <span>Optical plant disease detection via device lens</span>
                </div>
              </label>

              <label className="feature-toggle-label">
                <input
                  type="checkbox"
                  checked={features.cloudSync}
                  onChange={() => toggleFeature("cloudSync")}
                />
                <div className="feature-text-col">
                  <strong>Real-time Cloud Sync</strong>
                  <span>Instant push notifications to phone & WhatsApp</span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="pairing-modal-footer">
          <button
            className="chat-advisor-btn"
            onClick={() => {
              onClose();
              if (onOpenAIChat) {
                onOpenAIChat(`Give me step-by-step guidance for growing ${crop.name} on ${parcel.name} with ${parcel.soilType}.`);
              }
            }}
          >
            <MessageSquare size={16} />
            <span>Done & View Telemetry</span>
          </button>

          <button className="done-btn" onClick={onClose}>
            <span>Done & View on Map</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
