from typing import Optional, Literal
from datetime import datetime
from pydantic import BaseModel, Field
from app.schemas.geojson import GeoJSONGeometry


class LandBase(BaseModel):
    name: str
    survey_number: Optional[str] = None
    area_acres: float = Field(gt=0)
    location: str
    soil_type: str
    crop: str
    boundary_source: Literal["cadastral", "manual"] = "manual"
    cadastre_id: Optional[str] = None
    pairing_code: Optional[str] = None
    image_url: Optional[str] = None


class LandCreate(LandBase):
    geometry: GeoJSONGeometry


class LandUpdate(BaseModel):
    name: Optional[str] = None
    soil_type: Optional[str] = None
    crop: Optional[str] = None
    pairing_code: Optional[str] = None
    geometry: Optional[GeoJSONGeometry] = None


class LandResponse(LandBase):
    id: str
    confidence: float
    status: str
    last_scan: str
    geometry: GeoJSONGeometry
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
