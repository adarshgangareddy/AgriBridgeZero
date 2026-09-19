from typing import Any, Dict, List, Literal, Optional
from pydantic import BaseModel, Field


class GeoJSONGeometry(BaseModel):
    type: Literal["Point", "Polygon", "MultiPolygon"]
    coordinates: List[Any]


class GeoJSONFeature(BaseModel):
    type: Literal["Feature"] = "Feature"
    id: Optional[str] = None
    geometry: GeoJSONGeometry
    properties: Dict[str, Any] = Field(default_factory=dict)


class GeoJSONFeatureCollection(BaseModel):
    type: Literal["FeatureCollection"] = "FeatureCollection"
    features: List[GeoJSONFeature] = Field(default_factory=list)
