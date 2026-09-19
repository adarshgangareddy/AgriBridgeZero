from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.db import get_db
from app.schemas.geojson import GeoJSONFeature, GeoJSONFeatureCollection
from app.services.cadastre import (
    get_parcels_in_bbox,
    get_parcel_at,
    get_parcel_by_id,
)

router = APIRouter(prefix="/cadastre", tags=["Cadastral Parcels"])


@router.get("/parcels", response_model=GeoJSONFeatureCollection)
def list_parcels_in_bbox(
    bbox: Optional[str] = Query(
        None,
        description="Bounding box in format 'minLng,minLat,maxLng,maxLat'",
        examples=["77.78,13.05,77.82,13.08"],
    ),
    db: Session = Depends(get_db),
):
    """Loads parcel GeoJSON for the specified map bounding box.
    If bbox is omitted, returns authoritative demo parcels for Karnataka.
    """
    if bbox:
        try:
            parts = [float(x.strip()) for x in bbox.split(",")]
            if len(parts) == 4:
                min_lng, min_lat, max_lng, max_lat = parts
                return get_parcels_in_bbox(db, min_lng, min_lat, max_lng, max_lat)
        except Exception:
            pass

    # Default to Bengaluru Rural / Hoskote bounding box
    return get_parcels_in_bbox(db, 77.75, 13.00, 78.20, 13.20)


@router.get("/parcels/at", response_model=GeoJSONFeature)
def lookup_parcel_at(
    lng: float = Query(..., description="Longitude in decimal degrees"),
    lat: float = Query(..., description="Latitude in decimal degrees"),
    db: Session = Depends(get_db),
):
    """Queries authoritative cadastral dataset for a boundary containing the point."""
    feature = get_parcel_at(db, lng, lat)
    if not feature:
        raise HTTPException(
            status_code=404,
            detail="No verified parcel boundary is available here. Drop a point or draw your boundary.",
        )
    return feature


@router.get("/parcels/{cadastre_id}", response_model=GeoJSONFeature)
def get_parcel(cadastre_id: str, db: Session = Depends(get_db)):
    """Retrieves a single cadastral parcel by its ID."""
    feature = get_parcel_by_id(db, cadastre_id)
    if not feature:
        raise HTTPException(status_code=404, detail="Cadastral parcel not found")
    return feature
