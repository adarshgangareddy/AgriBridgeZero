import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.db import Base, engine, SessionLocal
from app.api.v1 import api_v1_router
from app.services.cadastre import seed_default_cadastre
from app.api.v1.lands import seed_demo_user_lands

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("agribridgezero")


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: create tables and seed default authoritative cadastre
    logger.info("Initializing AgriBridgeZero backend and database schemas...")
    try:
        Base.metadata.create_all(bind=engine)
        db = SessionLocal()
        try:
            seed_default_cadastre(db)
            seed_demo_user_lands(db)
        finally:
            db.close()
        logger.info("Database schemas and seed data ready.")
    except Exception as e:
        logger.error(f"Error during startup database initialization: {e}")
    yield
    # Shutdown logic if needed
    logger.info("Shutting down AgriBridgeZero backend...")


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="AgriBridgeZero AI-powered Soil Intelligence & PostGIS Cadastral Backend",
    lifespan=lifespan,
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API v1 router
app.include_router(api_v1_router, prefix=settings.API_V1_STR)


@app.get("/health")
def health_check():
    return {"status": "ok", "service": settings.PROJECT_NAME, "version": settings.VERSION}


@app.get("/")
def root():
    return {
        "app": settings.PROJECT_NAME,
        "docs": "/docs",
        "api_v1": settings.API_V1_STR,
    }
