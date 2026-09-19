from fastapi import APIRouter
from app.api.v1.parcels import router as parcels_router
from app.api.v1.lands import router as lands_router
from app.api.v1.devices import router as devices_router
from app.api.v1.soil import router as soil_router
from app.api.v1.ai import router as ai_router
from app.api.v1.auth import router as auth_router

api_v1_router = APIRouter()
api_v1_router.include_router(parcels_router)
api_v1_router.include_router(lands_router)
api_v1_router.include_router(devices_router)
api_v1_router.include_router(soil_router)
api_v1_router.include_router(ai_router)
api_v1_router.include_router(auth_router)

__all__ = ["api_v1_router"]
