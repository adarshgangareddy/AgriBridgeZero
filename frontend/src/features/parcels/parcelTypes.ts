export type {
  GeoJSONPosition,
  GeoJSONPolygonGeometry,
  GeoJSONMultiPolygonGeometry,
  GeoJSONGeometry,
  CadastreProperties,
  CadastralFeature,
  CadastralFeatureCollection,
  LandRecord,
  LandCreatePayload,
} from "../../api/contracts";

export interface ActiveParcelState {
  id: string;
  name: string;
  surveyNumber: string;
  areaAcres: number;
  location: string;
  soilType: string;
  crop: string;
  boundarySource: "cadastral" | "manual";
  confidence: number;
  cadastreId?: string;
  pairingCode?: string;
  status: string;
  lastScan: string;
  image: string;
  geometry: any;
  coordinates: [number, number][]; // Leaflet LatLngExpression for compatibility
  snapshot?: any;
  weather?: any;
}
