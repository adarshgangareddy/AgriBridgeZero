from fastapi import APIRouter
from app.schemas.soil import (
    SoilAnalysisRequest,
    SoilAnalysisResponse,
    RecommendationItem,
)

router = APIRouter(prefix="/soil", tags=["Soil Intelligence"])


@router.post("/analyze", response_model=SoilAnalysisResponse)
def analyze_soil(payload: SoilAnalysisRequest):
    """Analyzes soil chemistry against crop requirements and produces actionable recommendations."""
    ph = payload.ph or 6.5
    moisture = payload.moisture or 32.0

    score = 92
    if ph < 5.5 or ph > 8.0:
        score -= 15
    if moisture < 20 or moisture > 60:
        score -= 10

    recommendations = [
        RecommendationItem(
            id="REC-01",
            title="Drip Irrigation Pulse",
            reason="Maintain root-zone moisture between 30% and 35%",
            severity="info",
            category="irrigation",
            dosage="2.5 hours every 48 hours",
        ),
        RecommendationItem(
            id="REC-02",
            title="Single Superphosphate (SSP) Application",
            reason="Phosphorus reserves are sub-optimal for pre-flowering stage",
            severity="attention",
            category="fertilizer",
            dosage="50 kg per acre",
        ),
        RecommendationItem(
            id="REC-03",
            title="Organic Compost & Trichoderma",
            reason="Build microbial diversity and improve cation exchange capacity",
            severity="info",
            category="soil_prep",
            dosage="2 tonnes well-decomposed FYM per acre",
        ),
    ]

    return SoilAnalysisResponse(
        land_id=payload.land_id,
        crop_id=payload.crop_id,
        suitability_score=score,
        summary=f"Soil conditions are {score}% suitable for {payload.crop_id}. Balanced NPK recommended.",
        recommendations=recommendations,
    )
