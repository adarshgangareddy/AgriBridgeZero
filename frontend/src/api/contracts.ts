import type { MeasurementType, ParameterReading, SoilScan } from "../data/demo";

// RFC 7946 GeoJSON Types
export type GeoJSONPosition = [number, number]; // [longitude, latitude]

export type GeoJSONPolygonGeometry = {
  type: "Polygon";
  coordinates: GeoJSONPosition[][];
};

export type GeoJSONMultiPolygonGeometry = {
  type: "MultiPolygon";
  coordinates: GeoJSONPosition[][][];
};

export type GeoJSONGeometry = GeoJSONPolygonGeometry | GeoJSONMultiPolygonGeometry;

export type CadastreProperties = {
  cadastre_id: string;
  survey_number: string;
  state: string;
  district: string;
  taluk: string;
  village: string;
  area_acres: number;
  confidence: number;
  source: string;
  is_authoritative: boolean;
};

export type CadastralFeature = {
  type: "Feature";
  id: string;
  geometry: GeoJSONGeometry;
  properties: CadastreProperties;
};

export type CadastralFeatureCollection = {
  type: "FeatureCollection";
  features: CadastralFeature[];
};

export type LandRecord = {
  id: string;
  name: string;
  survey_number?: string;
  area_acres: number;
  location: string;
  soil_type: string;
  crop: string;
  boundary_source: "cadastral" | "manual";
  confidence: number;
  cadastre_id?: string;
  pairing_code?: string;
  status: string;
  last_scan: string;
  image_url?: string;
  geometry: GeoJSONGeometry;
  created_at: string;
  updated_at?: string;
};

export type LandCreatePayload = {
  name: string;
  survey_number?: string;
  area_acres: number;
  location: string;
  soil_type: string;
  crop: string;
  boundary_source: "cadastral" | "manual";
  geometry: GeoJSONGeometry;
  cadastre_id?: string;
  pairing_code?: string;
  image_url?: string;
};

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
  current_scan?: SoilScan;
  language: string;
  ph?: number;
  moisture?: number;
};

export type SoilRecommendation = {
  id: string;
  title: string;
  reason: string;
  severity: "info" | "attention" | "critical";
  category: string;
  dosage?: string;
};

export type SoilAnalysisResponse = {
  land_id: string;
  crop_id: string;
  suitability_score: number;
  summary: string;
  recommendations: SoilRecommendation[];
};

export const apiRoutes = {
  cadastreParcels: "/api/v1/cadastre/parcels",
  cadastreParcelAt: (lng: number, lat: number) => `/api/v1/cadastre/parcels/at?lng=${lng}&lat=${lat}`,
  cadastreParcelById: (id: string) => `/api/v1/cadastre/parcels/${id}`,
  lands: "/api/v1/lands",
  landById: (id: string) => `/api/v1/lands/${id}`,
  landScans: (landId: string) => `/api/v1/lands/${landId}/scans`,
  ingestDevicePayload: "/api/v1/devices/ingest",
  analyzeSoil: "/api/v1/soil/analyze",
  aiChat: "/api/v1/ai/chat",
} as const;

export type SensorValueState = MeasurementType;
