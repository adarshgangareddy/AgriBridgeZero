import { useState } from "react";
import { CheckCircle2, Eye, Radio } from "lucide-react";
import { hardwareSpecs } from "../data/demo";

interface DeviceSectionProps {
  onOpenAuth: (actionDesc: string) => void;
  isLoggedIn: boolean;
  t: (key: string) => string;
}

export function DeviceSection({ onOpenAuth, isLoggedIn, t }: DeviceSectionProps) {
  const [showDiagramModal, setShowDiagramModal] = useState(false);

  return (
    <div className="feature-column-card device-feature-card" id="device-section">
      <div className="card-head-row">
        <div>
          <h3 className="card-column-title">{t("deviceSectionTitle")}</h3>
          <p className="card-column-subtitle">{t("deviceTagline")}</p>
        </div>
        <div className="live-status-pill">
          <span className="live-dot" />
          <span>{t("deviceConnected")}</span>
        </div>
      </div>

      <div className="device-preview-box">
        <div className="device-img-frame">
          <img
            src="/hero-device.jpg"
            alt="AgriBridgeZero ABZ-001"
            className="device-thumbnail-img"
          />
        </div>

        <div className="device-bullet-specs">
          <div className="spec-bullet">
            <CheckCircle2 size={13} className="bullet-check" />
            <span>pH, EC, Moisture & Temp</span>
          </div>
          <div className="spec-bullet">
            <CheckCircle2 size={13} className="bullet-check" />
            <span>NPK & Micronutrients</span>
          </div>
          <div className="spec-bullet">
            <CheckCircle2 size={13} className="bullet-check" />
            <span>Spectral Soil Sensing</span>
          </div>
          <div className="spec-bullet">
            <CheckCircle2 size={13} className="bullet-check" />
            <span>High-Accuracy GNSS/GPS</span>
          </div>
          <div className="spec-bullet">
            <CheckCircle2 size={13} className="bullet-check" />
            <span>IP67 Rugged Field Ready</span>
          </div>
        </div>
      </div>

      {/* Live Device Status Pill */}
      <div className="device-connection-meta">
        <div className="meta-pair">
          <span className="meta-sub">Device:</span>
          <strong>ABZ-001</strong>
        </div>
        <div className="meta-pair">
          <span className="meta-sub">Battery:</span>
          <strong className="battery-val">84%</strong>
        </div>
        <div className="meta-pair">
          <span className="meta-sub">Last Sync:</span>
          <strong>2 min ago</strong>
        </div>
      </div>

      <div className="card-button-row">
        <button
          className="btn-accent-sm"
          onClick={() => {
            if (!isLoggedIn) {
              onOpenAuth("View ABZ-001 Live Telemetry");
            } else {
              setShowDiagramModal(true);
            }
          }}
        >
          <Radio size={14} />
          <span>{isLoggedIn ? "Live Telemetry" : t("viewDevice")}</span>
        </button>
        <button
          className="btn-outline-sm"
          onClick={() => setShowDiagramModal(true)}
        >
          <Eye size={14} />
          <span>{t("exploreDevice")}</span>
        </button>
      </div>

      {/* Full Hardware Specs Modal (Image 2 representation) */}
      {showDiagramModal && (
        <div className="diagram-modal-backdrop" onClick={() => setShowDiagramModal(false)}>
          <div className="diagram-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-top-bar">
              <div>
                <h3 className="modal-title">AgriBridgeZero Hardware Architecture</h3>
                <p className="modal-sub">Multi-Depth Modular Soil & Crop Analysis System</p>
              </div>
              <button className="close-btn" onClick={() => setShowDiagramModal(false)}>×</button>
            </div>

            <div className="modal-diagram-scroll">
              <img
                src="/device-hardware.jpg"
                alt="AgriBridgeZero Hardware Diagram"
                className="full-hardware-diagram-img"
              />

              <div className="depth-levels-grid">
                {hardwareSpecs.depths.map((d) => (
                  <div key={d.range} className="depth-level-card">
                    <span className="depth-range-badge">{d.range}</span>
                    <p className="depth-label">{d.label}</p>
                  </div>
                ))}
              </div>

              <div className="modular-probes-grid">
                {hardwareSpecs.modules.map((m) => (
                  <div key={m.title} className="modular-box">
                    <h4 className="modular-title">{m.title}</h4>
                    <p className="modular-items">{m.items}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
