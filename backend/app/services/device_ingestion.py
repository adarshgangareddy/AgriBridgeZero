import json
import uuid
from datetime import datetime
from sqlalchemy.orm import Session
from app.models.device import SoilScanRecord
from app.schemas.device import DeviceIngestRequest, DeviceIngestResponse, ValidationResult


def process_device_ingest(db: Session, payload: DeviceIngestRequest) -> DeviceIngestResponse:
    scan_id = f"SCAN-{uuid.uuid4().hex[:8].upper()}"
    warnings = []
    unavailable = []

    # Validate parameters
    ph_val = 6.5
    moist_val = 32.0
    ec_val = 0.68
    temp_val = 24.5

    if "ph" in payload.soil:
        try:
            ph_val = float(payload.soil["ph"].value)
            if ph_val < 3.0 or ph_val > 10.0:
                warnings.append(f"pH reading {ph_val} outside typical agricultural range (4.5-8.5)")
        except (ValueError, TypeError):
            unavailable.append("ph")

    if "moisture" in payload.soil:
        try:
            moist_val = float(payload.soil["moisture"].value)
        except (ValueError, TypeError):
            unavailable.append("moisture")

    if "ec" in payload.soil:
        try:
            ec_val = float(payload.soil["ec"].value)
        except (ValueError, TypeError):
            unavailable.append("ec")

    # Record scan
    record = SoilScanRecord(
        id=scan_id,
        device_id=payload.device_id,
        land_id=payload.land_id,
        timestamp=datetime.utcnow(),
        depth_cm=payload.depth_cm,
        ph=ph_val,
        moisture=moist_val,
        nitrogen=str(payload.nutrients.get("nitrogen", {}).get("value", "Medium")),
        phosphorus=str(payload.nutrients.get("phosphorus", {}).get("value", "Low")),
        potassium=str(payload.nutrients.get("potassium", {}).get("value", "Good")),
        ec=ec_val,
        temperature=temp_val,
        raw_payload=payload.model_dump_json(),
    )
    db.add(record)
    db.commit()

    return DeviceIngestResponse(
        scan_id=scan_id,
        accepted=True,
        received_at=datetime.utcnow().isoformat() + "Z",
        validation=ValidationResult(
            valid=len(unavailable) == 0,
            warnings=warnings,
            unavailable_parameters=unavailable,
        ),
    )
