export type MeasurementType =
  | "measured"
  | "estimated"
  | "predicted"
  | "unavailable"
  | "requires_lab_validation";

export type ParameterReading = {
  value: number | null;
  unit: string;
  measurementType: MeasurementType;
  source: "device" | "model" | "lab" | "unavailable";
  confidence?: number;
  timestamp: string;
};

export type SoilScan = {
  id: string;
  timestamp: string;
  depthCm: number;
  soil: Record<string, ParameterReading>;
  nutrients: Record<string, ParameterReading>;
  contaminants: Record<string, ParameterReading>;
};

export type Land = {
  id: string;
  name: string;
  location: string;
  areaAcres: number;
  crop: string;
  status: "Attention required" | "Healthy" | "Needs review";
  lastScan: string;
  deviceId: string | null;
  coordinates: [number, number][];
  scan: SoilScan;
};

const measured = (value: number, unit: string): ParameterReading => ({
  value,
  unit,
  measurementType: "measured",
  source: "device",
  confidence: 0.98,
  timestamp: "2026-09-17T21:42:00+05:30",
});

const estimated = (
  value: number,
  unit: string,
  confidence: number,
): ParameterReading => ({
  value,
  unit,
  measurementType: "estimated",
  source: "model",
  confidence,
  timestamp: "2026-09-17T21:42:00+05:30",
});

const unavailable = (unit: string): ParameterReading => ({
  value: null,
  unit,
  measurementType: "unavailable",
  source: "unavailable",
  timestamp: "2026-09-17T21:42:00+05:30",
});

export const demoLands: Land[] = [
  {
    id: "LAND-001",
    name: "GVK Farm",
    location: "Hoskote, Karnataka",
    areaAcres: 4.02,
    crop: "Tomato",
    status: "Attention required",
    lastScan: "2 min ago",
    deviceId: "ABZ-001",
    coordinates: [
      [13.0698, 77.7982],
      [13.0716, 77.8017],
      [13.0693, 77.8041],
      [13.0667, 77.8012],
    ],
    scan: {
      id: "SCAN-2026-0917-2142",
      timestamp: "2026-09-17T21:42:00+05:30",
      depthCm: 20,
      soil: {
        ph: measured(6.4, "pH"),
        moisture: measured(31.5, "%"),
        temperature: measured(25.4, "°C"),
        ec: measured(0.72, "dS/m"),
        salinity: measured(0.38, "dS/m"),
        organicMatter: estimated(2.1, "%", 0.87),
      },
      nutrients: {
        nitrogen: estimated(42, "mg/kg", 0.94),
        phosphorus: estimated(18, "mg/kg", 0.94),
        potassium: estimated(110, "mg/kg", 0.92),
        calcium: estimated(850, "mg/kg", 0.9),
        magnesium: estimated(210, "mg/kg", 0.9),
        sulfur: unavailable("mg/kg"),
        iron: estimated(8.4, "mg/kg", 0.84),
        zinc: estimated(1.2, "mg/kg", 0.82),
        copper: unavailable("mg/kg"),
        boron: unavailable("mg/kg"),
        manganese: estimated(5.8, "mg/kg", 0.8),
      },
      contaminants: {
        lead: unavailable("mg/kg"),
        cadmium: unavailable("mg/kg"),
        arsenic: unavailable("mg/kg"),
        mercury: unavailable("mg/kg"),
      },
    },
  },
  {
    id: "LAND-002",
    name: "East Block",
    location: "Hoskote, Karnataka",
    areaAcres: 2.84,
    crop: "Chilli",
    status: "Healthy",
    lastScan: "Yesterday",
    deviceId: "ABZ-002",
    coordinates: [
      [13.0661, 77.7948],
      [13.0681, 77.7969],
      [13.0665, 77.7983],
      [13.0646, 77.7962],
    ],
    scan: {
      id: "SCAN-2026-0916-0818",
      timestamp: "2026-09-16T08:18:00+05:30",
      depthCm: 20,
      soil: {
        ph: measured(6.8, "pH"),
        moisture: measured(38.1, "%"),
        temperature: measured(24.1, "°C"),
        ec: measured(0.54, "dS/m"),
        salinity: measured(0.22, "dS/m"),
        organicMatter: estimated(2.8, "%", 0.89),
      },
      nutrients: {
        nitrogen: estimated(58, "mg/kg", 0.94),
        phosphorus: estimated(28, "mg/kg", 0.93),
        potassium: estimated(148, "mg/kg", 0.92),
        calcium: estimated(910, "mg/kg", 0.9),
        magnesium: estimated(220, "mg/kg", 0.9),
        sulfur: unavailable("mg/kg"),
        iron: estimated(9.1, "mg/kg", 0.84),
        zinc: estimated(1.8, "mg/kg", 0.82),
        copper: unavailable("mg/kg"),
        boron: unavailable("mg/kg"),
        manganese: estimated(7.2, "mg/kg", 0.8),
      },
      contaminants: {
        lead: unavailable("mg/kg"),
        cadmium: unavailable("mg/kg"),
        arsenic: unavailable("mg/kg"),
        mercury: unavailable("mg/kg"),
      },
    },
  },
];
