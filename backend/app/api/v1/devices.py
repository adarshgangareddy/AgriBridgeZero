from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db import get_db
from app.schemas.device import DeviceIngestRequest, DeviceIngestResponse
from app.services.device_ingestion import process_device_ingest

router = APIRouter(prefix="/devices", tags=["Devices"])


@router.post("/ingest", response_model=DeviceIngestResponse)
def ingest_device_reading(payload: DeviceIngestRequest, db: Session = Depends(get_db)):
    """Receives sensor telemetry from physical ABZ-001 soil probe."""
    return process_device_ingest(db, payload)
