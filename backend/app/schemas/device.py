from typing import Dict, Any, Optional, List
from datetime import datetime
from pydantic import BaseModel, Field


class ParameterReading(BaseModel):
    value: Any
    unit: Optional[str] = None
    status: Optional[str] = "Normal"


class DeviceIngestRequest(BaseModel):
    device_id: str
    farm_id: Optional[str] = "farm-1"
    land_id: str
    timestamp: Optional[str] = None
    latitude: float
    longitude: float
    depth_cm: int = 30
    soil: Dict[str, ParameterReading] = Field(default_factory=dict)
    nutrients: Dict[str, ParameterReading] = Field(default_factory=dict)
    contaminants: Dict[str, ParameterReading] = Field(default_factory=dict)
    environment: Optional[Dict[str, ParameterReading]] = None


class ValidationResult(BaseModel):
    valid: bool
    warnings: List[str] = Field(default_factory=list)
    unavailable_parameters: List[str] = Field(default_factory=list)


class DeviceIngestResponse(BaseModel):
    scan_id: str
    accepted: bool
    received_at: str
    validation: ValidationResult
