from datetime import datetime
from sqlalchemy import Column, String, Float, DateTime, Text
from app.db import Base


class CadastralParcel(Base):
    __tablename__ = "cadastral_parcels"

    id = Column(String(64), primary_key=True, index=True)
    survey_number = Column(String(64), nullable=False, index=True)
    state = Column(String(64), default="Karnataka", index=True)
    district = Column(String(64), default="Bengaluru Rural", index=True)
    taluk = Column(String(64), default="Hoskote", index=True)
    village = Column(String(64), default="Mylanahalli")
    area_acres = Column(Float, nullable=False)
    confidence = Column(Float, default=0.98)
    source = Column(String(64), default="authoritative_karnataka_bhoomi")
    
    # Store standard GeoJSON geometry string
    geometry_geojson = Column(Text, nullable=False)
    
    # Bounding box coordinates for rapid geospatial queries
    min_lng = Column(Float, nullable=False, index=True)
    min_lat = Column(Float, nullable=False, index=True)
    max_lng = Column(Float, nullable=False, index=True)
    max_lat = Column(Float, nullable=False, index=True)

    created_at = Column(DateTime, default=datetime.utcnow)
