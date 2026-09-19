import { apiClient } from "../../api/client";
import {
  apiRoutes,
  type CadastralFeature,
  type CadastralFeatureCollection,
  type LandRecord,
  type LandCreatePayload,
} from "../../api/contracts";

export async function fetchCadastreParcels(
  bbox?: string
): Promise<CadastralFeatureCollection> {
  const url = bbox
    ? `${apiRoutes.cadastreParcels}?bbox=${encodeURIComponent(bbox)}`
    : apiRoutes.cadastreParcels;
  return apiClient<CadastralFeatureCollection>(url);
}

export async function fetchCadastreParcelAt(
  lng: number,
  lat: number
): Promise<CadastralFeature | null> {
  try {
    return await apiClient<CadastralFeature>(apiRoutes.cadastreParcelAt(lng, lat));
  } catch (err: any) {
    if (err.status === 404) {
      return null;
    }
    console.warn("Cadastre lookup warning:", err);
    return null;
  }
}

export async function fetchUserLands(): Promise<LandRecord[]> {
  return apiClient<LandRecord[]>(apiRoutes.lands);
}

export async function saveLand(payload: LandCreatePayload): Promise<LandRecord> {
  return apiClient<LandRecord>(apiRoutes.lands, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateLand(
  landId: string,
  payload: Partial<LandCreatePayload>
): Promise<LandRecord> {
  return apiClient<LandRecord>(apiRoutes.landById(landId), {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}
