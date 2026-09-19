import { Sun, CloudRain, Wind, Droplets, ArrowRight } from "lucide-react";
import type { CadastralParcel } from "../data/demo";

interface SoilSnapshotProps {
  parcel: CadastralParcel;
  onOpenAuth: (actionDesc: string) => void;
  isLoggedIn: boolean;
  t: (key: string) => string;
}

export function SoilSnapshot({ parcel, onOpenAuth, isLoggedIn, t }: SoilSnapshotProps) {
  const { snapshot, weather } = parcel;

  const soilMetrics = [
    {
      label: "pH",
      value: snapshot.ph.value.toString(),
      status: t("suitable"),
      tone: "good",
      unit: "pH",
      optimal: "6.0 - 6.8",
    },
    {
      label: "Nitrogen",
      value: snapshot.nitrogen.value,
      status: t("attention"),
      tone: "attention",
      unit: "N",
      optimal: "Medium / High",
    },
    {
      label: "Phosphorus",
      value: snapshot.phosphorus.value,
      status: t("attention"),
      tone: "attention",
      unit: "P",
      optimal: "25 - 45 mg/kg",
    },
    {
      label: "Potassium",
      value: snapshot.potassium.value,
      status: t("stable"),
      tone: "good",
      unit: "K",
      optimal: "110 - 160 mg/kg",
    },
  ];

  return (
    <section className="soil-snapshot-section" id="soil-section">
      <div className="section-container">
        <div className="snapshot-weather-grid">
          {/* Left: Latest Soil Snapshot */}
          <div className="snapshot-card-panel">
            <div className="section-header-row">
              <div>
                <h2 className="section-heading">{t("soilSnapshotTitle")}</h2>
                <p className="section-subheading">{t("soilSnapshotDesc")}</p>
              </div>
              <button
                className="view-all-link"
                onClick={() => {
                  if (!isLoggedIn) onOpenAuth("View Full Soil Report");
                }}
              >
                <span>{t("viewFullReport")}</span>
                <ArrowRight size={14} />
              </button>
            </div>

            {/* Horizontal parameters carousel / grid */}
            <div className="parameters-grid">
              {soilMetrics.map((metric) => (
                <div key={metric.label} className={`metric-tile tone-${metric.tone}`}>
                  <div className="metric-header-row">
                    <span className="metric-label">{metric.label}</span>
                    <span className={`status-badge-chip badge-${metric.tone}`}>
                      {metric.status}
                    </span>
                  </div>
                  <div className="metric-val-large">{metric.value}</div>
                  <div className="metric-optimal-text">Target: {metric.optimal}</div>
                </div>
              ))}
            </div>

            {/* Extra sensor bars: Moisture & EC */}
            <div className="secondary-readings-row">
              <div className="sensor-bar-item">
                <div className="bar-header">
                  <span>Soil Moisture</span>
                  <strong>{snapshot.moisture.value}% ({snapshot.moisture.status})</strong>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${snapshot.moisture.value}%`, backgroundColor: "var(--accent-green)" }} />
                </div>
              </div>

              <div className="sensor-bar-item">
                <div className="bar-header">
                  <span>Electrical Conductivity (EC)</span>
                  <strong>{snapshot.ec.value} dS/m ({snapshot.ec.status})</strong>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: "48%", backgroundColor: "var(--accent-amber)" }} />
                </div>
              </div>
            </div>
          </div>

          {/* Right: Weather at Location */}
          <div className="weather-card-panel">
            <div className="section-header-row">
              <h2 className="section-heading">{t("weatherTitle")}</h2>
              <button className="view-all-link" onClick={() => onOpenAuth("Weather Forecast")}>
                <span>{t("viewForecast")}</span>
                <ArrowRight size={14} />
              </button>
            </div>

            <div className="weather-main-display">
              <div className="weather-sun-icon-wrap">
                <Sun size={36} className="sun-icon-pulsing" />
              </div>
              <div className="weather-temp-wrap">
                <span className="temp-degrees">{weather.temp}°C</span>
                <span className="temp-condition">{weather.condition}</span>
              </div>
            </div>

            <div className="weather-sub-metrics-list">
              <div className="weather-metric-row">
                <span className="w-metric-name">
                  <Droplets size={14} /> {t("humidity")}
                </span>
                <strong className="w-metric-val">{weather.humidity}%</strong>
              </div>

              <div className="weather-metric-row">
                <span className="w-metric-name">
                  <Wind size={14} /> {t("wind")}
                </span>
                <strong className="w-metric-val">{weather.wind} km/h</strong>
              </div>

              <div className="weather-metric-row">
                <span className="w-metric-name">
                  <CloudRain size={14} /> {t("rainfall")}
                </span>
                <strong className="w-metric-val">{weather.rainfall} mm</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
