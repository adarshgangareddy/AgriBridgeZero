from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, DateTime, Text
from app.db import Base


class Device(Base):
    __tablename__ = "devices"

    id = Column(String(64), primary_key=True, index=True)
    pairing_code = Column(String(32), unique=True, index=True)
    land_id = Column(String(64), nullable=True, index=True)
    status = Column(String(32), default="connected")
    battery = Column(Integer, default=94)
    firmware_version = Column(String(32), default="v2.4.1")
    last_synced = Column(DateTime, default=datetime.utcnow)


class SoilScanRecord(Base):
    __tablename__ = "soil_scans"

    id = Column(String(64), primary_key=True, index=True)
    device_id = Column(String(64), nullable=False, index=True)
    land_id = Column(String(64), nullable=False, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    depth_cm = Column(Integer, default=30)
    ph = Column(Float, default=6.5)
    moisture = Column(Float, default=32.0)
    nitrogen = Column(String(32), default="Medium")
    phosphorus = Column(String(32), default="Low")
    potassium = Column(String(32), default="Good")
    ec = Column(Float, default=0.68)
    temperature = Column(Float, default=24.5)
    raw_payload = Column(Text, nullable=True)
