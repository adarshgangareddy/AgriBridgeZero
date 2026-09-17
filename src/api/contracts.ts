import type { MeasurementType, ParameterReading, SoilScan } from "../data/demo";

export type DevicePayload = {
  device_id: string;
  farm_id: string;
  land_id: string;
  timestamp: string;
  latitude: number;
  longitude: number;
  depth_cm: number;
  soil: Record<string, ParameterReading>;
  nutrients: Record<string, ParameterReading>;
  contaminants: Record<string, ParameterReading>;
  spectral_data?: { available: boolean; data_reference?: string };
  environment?: {
    air_temperature?: ParameterReading;
    humidity?: ParameterReading;
  };
};

export type DeviceIngestionResponse = {
  scan_id: string;
  accepted: boolean;
  received_at: string;
  validation: {
    valid: boolean;
    warnings: string[];
    unavailable_parameters: string[];
  };
};

export type SoilAnalysisRequest = {
  land_id: string;
  crop_id: string;
  current_scan: SoilScan;
  historical_scan_ids: string[];
  language: "en" | "kn" | "hi" | "te" | "ta" | "ml" | "mr";
};

export type SoilRecommendation = {
  id: string;
  title: string;
  reason: string;
  severity: "info" | "attention" | "critical";
  input_data_used: string[];
  confidence: number | null;
  data_source: "device" | "model" | "lab" | "agronomic_knowledge";
  requires_lab_validation: boolean;
  created_at: string;
};

export const apiRoutes = {
  ingestDevicePayload: "/api/v1/devices/ingest",
  landScans: (landId: string) => `/api/v1/lands/${landId}/scans`,
  analyzeSoil: "/api/v1/soil/analyze",
  recommendations: (landId: string) =>
    `/api/v1/lands/${landId}/recommendations`,
  liveUpdates: "/api/v1/ws/live-updates",
} as const;

export type SensorValueState = MeasurementType;
