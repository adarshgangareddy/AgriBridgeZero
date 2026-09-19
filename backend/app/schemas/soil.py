from typing import List, Optional
from pydantic import BaseModel, Field


class SoilAnalysisRequest(BaseModel):
    land_id: str
    crop_id: str
    language: str = "en"
    ph: Optional[float] = None
    moisture: Optional[float] = None
    nitrogen: Optional[str] = None
    phosphorus: Optional[str] = None
    potassium: Optional[str] = None


class RecommendationItem(BaseModel):
    id: str
    title: str
    reason: str
    severity: str = "info"  # "info", "attention", "critical"
    category: str = "fertilizer"
    dosage: Optional[str] = None


class SoilAnalysisResponse(BaseModel):
    land_id: str
    crop_id: str
    suitability_score: int
    summary: str
    recommendations: List[RecommendationItem] = Field(default_factory=list)
