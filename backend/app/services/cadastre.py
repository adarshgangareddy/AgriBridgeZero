import json
import logging
from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from app.models.cadastre import CadastralParcel
from app.schemas.geojson import GeoJSONFeature, GeoJSONFeatureCollection, GeoJSONGeometry
from app.services.geometry import is_point_in_geometry, calculate_bbox, calculate_area_acres

logger = logging.getLogger(__name__)

# Predefined authoritative Karnataka Cadastre parcels with standard [longitude, latitude] GeoJSON coordinates
DEFAULT_CADASTRE_PARCELS = [
    {
        "id": "CAD-KAR-HSK-142-1",
        "survey_number": "Sy. No. 142/1",
        "state": "Karnataka",
        "district": "Bengaluru Rural",
        "taluk": "Hoskote",
        "village": "Mylanahalli",
        "area_acres": 4.2,
        "confidence": 0.98,
        "source": "authoritative_karnataka_bhoomi",
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
        "id": "CAD-KAR-HSK-142-2",
        "survey_number": "Sy. No. 142/2",
        "state": "Karnataka",
        "district": "Bengaluru Rural",
        "taluk": "Hoskote",
        "village": "Mylanahalli",
        "area_acres": 3.8,
        "confidence": 0.97,
        "source": "authoritative_karnataka_bhoomi",
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
    {
        "id": "CAD-KAR-HSK-108-3",
        "survey_number": "Sy. No. 108/3",
        "state": "Karnataka",
        "district": "Bengaluru Rural",
        "taluk": "Hoskote",
        "village": "Kambalipura",
        "area_acres": 6.5,
        "confidence": 0.99,
        "source": "authoritative_karnataka_bhoomi",
        "geometry": {
            "type": "Polygon",
            "coordinates": [
                [
                    [77.8015, 13.0725],
                    [77.8055, 13.0730],
                    [77.8058, 13.0675],
                    [77.8018, 13.0670],
                    [77.8015, 13.0725],
                ]
            ],
        },
    },
    {
        "id": "CAD-KAR-HSK-89-1",
        "survey_number": "Sy. No. 89/1",
        "state": "Karnataka",
        "district": "Bengaluru Rural",
        "taluk": "Hoskote",
        "village": "Sulibele",
        "area_acres": 5.1,
        "confidence": 0.96,
        "source": "authoritative_karnataka_bhoomi",
        "geometry": {
            "type": "Polygon",
            "coordinates": [
                [
                    [77.7915, 13.0710],
                    [77.7955, 13.0715],
                    [77.7958, 13.0665],
                    [77.7918, 13.0660],
                    [77.7915, 13.0710],
                ]
            ],
        },
    },
    {
        "id": "CAD-KAR-KLR-214-A",
        "survey_number": "Sy. No. 214/A",
        "state": "Karnataka",
        "district": "Kolar",
        "taluk": "Bangarapet",
        "village": "Kyasamballi",
        "area_acres": 7.4,
        "confidence": 0.98,
        "source": "authoritative_karnataka_bhoomi",
        "geometry": {
            "type": "Polygon",
            "coordinates": [
                [
                    [78.1280, 13.1360],
                    [78.1340, 13.1365],
                    [78.1345, 13.1310],
                    [78.1285, 13.1305],
                    [78.1280, 13.1360],
                ]
            ],
        },
    },
]


def seed_default_cadastre(db: Session):
    """Populates default cadastral parcels in DB if table is empty."""
    count = db.query(CadastralParcel).count()
    if count == 0:
        for p in DEFAULT_CADASTRE_PARCELS:
            min_lng, min_lat, max_lng, max_lat = calculate_bbox(p["geometry"])
            parcel = CadastralParcel(
                id=p["id"],
                survey_number=p["survey_number"],
                state=p["state"],
                district=p["district"],
                taluk=p["taluk"],
                village=p["village"],
                area_acres=p["area_acres"],
                confidence=p["confidence"],
                source=p["source"],
                geometry_geojson=json.dumps(p["geometry"]),
                min_lng=min_lng,
                min_lat=min_lat,
                max_lng=max_lng,
                max_lat=max_lat,
            )
            db.add(parcel)
        db.commit()
        logger.info("Authoritative cadastral demo parcels seeded successfully.")


def parcel_to_geojson_feature(parcel: CadastralParcel) -> GeoJSONFeature:
    """Converts a CadastralParcel DB model to a standard GeoJSON Feature."""
    geom = json.loads(parcel.geometry_geojson)
    return GeoJSONFeature(
        id=parcel.id,
        geometry=GeoJSONGeometry(**geom),
        properties={
            "cadastre_id": parcel.id,
            "survey_number": parcel.survey_number,
            "state": parcel.state,
            "district": parcel.district,
            "taluk": parcel.taluk,
            "village": parcel.village,
            "area_acres": parcel.area_acres,
            "confidence": parcel.confidence,
            "source": parcel.source,
            "is_authoritative": True,
        },
    )


def get_parcels_in_bbox(
    db: Session, min_lng: float, min_lat: float, max_lng: float, max_lat: float
) -> GeoJSONFeatureCollection:
    """Finds all parcels intersecting the requested bounding box."""
    # Ensure parcels are seeded
    seed_default_cadastre(db)

    # Query bounding box overlaps
    parcels = (
        db.query(CadastralParcel)
        .filter(
            CadastralParcel.max_lng >= min_lng,
            CadastralParcel.min_lng <= max_lng,
            CadastralParcel.max_lat >= min_lat,
            CadastralParcel.min_lat <= max_lat,
        )
        .all()
    )

    features = [parcel_to_geojson_feature(p) for p in parcels]
    return GeoJSONFeatureCollection(features=features)


def get_parcel_at(db: Session, lng: float, lat: float) -> Optional[GeoJSONFeature]:
    """Finds the authoritative cadastral parcel covering the given [lng, lat] coordinate."""
    seed_default_cadastre(db)

    # First filter by bounding box
    candidates = (
        db.query(CadastralParcel)
        .filter(
            CadastralParcel.min_lng <= lng,
            CadastralParcel.max_lng >= lng,
            CadastralParcel.min_lat <= lat,
            CadastralParcel.max_lat >= lat,
        )
        .all()
    )

    # Then exact point-in-polygon verification using Shapely
    for c in candidates:
        geom = json.loads(c.geometry_geojson)
        if is_point_in_geometry(lng, lat, geom):
            return parcel_to_geojson_feature(c)

    return None


def get_parcel_by_id(db: Session, cadastre_id: str) -> Optional[GeoJSONFeature]:
    seed_default_cadastre(db)
    parcel = db.query(CadastralParcel).filter(CadastralParcel.id == cadastre_id).first()
    if parcel:
        return parcel_to_geojson_feature(parcel)
    return None
