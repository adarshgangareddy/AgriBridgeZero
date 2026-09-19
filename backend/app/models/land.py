from datetime import datetime
from sqlalchemy import Column, String, Float, DateTime, Text
from app.db import Base


class Land(Base):
    __tablename__ = "lands"

    id = Column(String(64), primary_key=True, index=True)
    owner_id = Column(String(64), default="farmer-rajesh", index=True)
    name = Column(String(128), nullable=False)
    survey_number = Column(String(64), nullable=True)
    area_acres = Column(Float, nullable=False)
    location = Column(String(256), nullable=False)
    soil_type = Column(String(64), nullable=False)
    crop = Column(String(64), nullable=False)
    
    # "cadastral" (authoritative government boundary) or "manual" (farmer drawn/point)
    boundary_source = Column(String(32), nullable=False, default="manual")
    confidence = Column(Float, default=0.75)
    cadastre_id = Column(String(64), nullable=True)
    
    # Store standard GeoJSON geometry string [lng, lat]
    geometry_geojson = Column(Text, nullable=False)
    
    pairing_code = Column(String(32), nullable=True)
    status = Column(String(32), default="Optimal")
    last_scan = Column(String(64), default="Just now")
    image_url = Column(String(512), nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
