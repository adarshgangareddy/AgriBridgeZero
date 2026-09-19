import json
import uuid
from datetime import datetime
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db import get_db
from app.models.land import Land
from app.models.device import SoilScanRecord
from app.schemas.land import LandCreate, LandUpdate, LandResponse
from app.schemas.geojson import GeoJSONGeometry
from app.services.geometry import validate_geojson_geometry, calculate_area_acres

router = APIRouter(prefix="/lands", tags=["Lands"])


def land_to_response(land: Land) -> LandResponse:
    geom = json.loads(land.geometry_geojson)
    return LandResponse(
        id=land.id,
        name=land.name,
        survey_number=land.survey_number,
        area_acres=land.area_acres,
        location=land.location,
        soil_type=land.soil_type,
        crop=land.crop,
        boundary_source=land.boundary_source,
        confidence=land.confidence,
        cadastre_id=land.cadastre_id,
        pairing_code=land.pairing_code,
        status=land.status,
        last_scan=land.last_scan,
        image_url=land.image_url,
        geometry=GeoJSONGeometry(**geom),
        created_at=land.created_at,
        updated_at=land.updated_at,
    )


def seed_demo_user_lands(db: Session):
    """Seed initial lands for demo user if none exist."""
    count = db.query(Land).count()
    if count == 0:
        demo_items = [
            {
                "id": "PARCEL-001",
                "name": "North Plot — Tomato & Vegetables",
                "survey_number": "Sy. No. 142/1",
                "area_acres": 4.2,
                "location": "Hoskote, Bengaluru Rural, Karnataka",
                "soil_type": "Red Loamy",
                "crop": "Tomato",
                "boundary_source": "cadastral",
                "confidence": 0.98,
                "cadastre_id": "CAD-KAR-HSK-142-1",
                "pairing_code": "ABZ-8492-7103-5629",
                "status": "Attention required",
                "last_scan": "14 mins ago",
                "image_url": "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=600&auto=format&fit=crop&q=80",
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [
                        [
                            [77.7965, 13.0715],
                            [77.8001, 13.0722],
                            [77.8005, 13.0682],
                            [77.7969, 13.0679],
                            [77.7965, 13.0715],
                        ]
                    ],
                },
            },
            {
                "id": "PARCEL-002",
                "name": "South Plot — Maize Field",
                "survey_number": "Sy. No. 142/2",
                "area_acres": 3.8,
                "location": "Hoskote, Bengaluru Rural, Karnataka",
                "soil_type": "Red Loamy",
                "crop": "Maize",
                "boundary_source": "cadastral",
                "confidence": 0.97,
                "cadastre_id": "CAD-KAR-HSK-142-2",
                "pairing_code": "ABZ-1104-9823-4410",
                "status": "Optimal",
                "last_scan": "2 hours ago",
                "image_url": "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=600&auto=format&fit=crop&q=80",
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [
                        [
                            [77.7969, 13.0679],
                            [77.8005, 13.0682],
                            [77.8002, 13.0645],
                            [77.7966, 13.0641],
                            [77.7969, 13.0679],
                        ]
                    ],
                },
            },
        ]

        for d in demo_items:
            land = Land(
                id=d["id"],
                owner_id="farmer-rajesh",
                name=d["name"],
                survey_number=d["survey_number"],
                area_acres=d["area_acres"],
                location=d["location"],
                soil_type=d["soil_type"],
                crop=d["crop"],
                boundary_source=d["boundary_source"],
                confidence=d["confidence"],
                cadastre_id=d["cadastre_id"],
                pairing_code=d["pairing_code"],
                status=d["status"],
                last_scan=d["last_scan"],
                image_url=d["image_url"],
                geometry_geojson=json.dumps(d["geometry"]),
            )
            db.add(land)
        db.commit()


@router.get("", response_model=List[LandResponse])
def get_user_lands(db: Session = Depends(get_db)):
    """Fetches all registered lands for the authenticated farmer."""
    seed_demo_user_lands(db)
    lands = db.query(Land).order_by(Land.created_at.desc()).all()
    return [land_to_response(l) for l in lands]


@router.post("", response_model=LandResponse, status_code=201)
def create_land(payload: LandCreate, db: Session = Depends(get_db)):
    """Saves a newly registered land parcel.
    If geometry was drawn by farmer, it is stored with boundary_source='manual'
    and NEVER presented as authoritative/cadastral.
    """
    geom_dict = payload.geometry.model_dump()
    if not validate_geojson_geometry(geom_dict):
        raise HTTPException(
            status_code=422,
            detail="Invalid GeoJSON geometry: polygon must be non-self-intersecting.",
        )

    # Determine boundary source and confidence
    is_cadastral = bool(payload.cadastre_id and payload.boundary_source == "cadastral")
    boundary_source = "cadastral" if is_cadastral else "manual"
    confidence = 0.98 if is_cadastral else 0.75

    # Compute area if needed
    area = payload.area_acres or calculate_area_acres(geom_dict)

    land_id = f"PARCEL-{uuid.uuid4().hex[:6].upper()}"
    new_land = Land(
        id=land_id,
        owner_id="farmer-rajesh",
        name=payload.name,
        survey_number=payload.survey_number or f"Sy. No. {uuid.uuid4().int % 900 + 100}/1",
        area_acres=round(area, 2),
        location=payload.location,
        soil_type=payload.soil_type,
        crop=payload.crop,
        boundary_source=boundary_source,
        confidence=confidence,
        cadastre_id=payload.cadastre_id,
        pairing_code=payload.pairing_code,
        status="Optimal",
        last_scan="Just now",
        image_url=payload.image_url,
        geometry_geojson=json.dumps(geom_dict),
    )

    db.add(new_land)
    db.commit()
    db.refresh(new_land)
    return land_to_response(new_land)


@router.get("/{land_id}", response_model=LandResponse)
def get_single_land(land_id: str, db: Session = Depends(get_db)):
    seed_demo_user_lands(db)
    land = db.query(Land).filter(Land.id == land_id).first()
    if not land:
        raise HTTPException(status_code=404, detail="Land parcel not found")
    return land_to_response(land)


@router.patch("/{land_id}", response_model=LandResponse)
def update_land(land_id: str, payload: LandUpdate, db: Session = Depends(get_db)):
    seed_demo_user_lands(db)
    land = db.query(Land).filter(Land.id == land_id).first()
    if not land:
        raise HTTPException(status_code=404, detail="Land parcel not found")

    if payload.name is not None:
        land.name = payload.name
    if payload.soil_type is not None:
        land.soil_type = payload.soil_type
    if payload.crop is not None:
        land.crop = payload.crop
    if payload.pairing_code is not None:
        land.pairing_code = payload.pairing_code
    if payload.geometry is not None:
        geom_dict = payload.geometry.model_dump()
        if not validate_geojson_geometry(geom_dict):
            raise HTTPException(status_code=422, detail="Invalid GeoJSON geometry")
        land.geometry_geojson = json.dumps(geom_dict)
        land.boundary_source = "manual"  # Editing makes it manual

    db.commit()
    db.refresh(land)
    return land_to_response(land)


@router.get("/{land_id}/scans")
def get_land_scans(land_id: str, db: Session = Depends(get_db)):
    scans = (
        db.query(SoilScanRecord)
        .filter(SoilScanRecord.land_id == land_id)
        .order_by(SoilScanRecord.timestamp.desc())
        .limit(10)
        .all()
    )
    return scans
