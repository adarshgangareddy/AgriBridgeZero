import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

from app.core.config import settings

logger = logging.getLogger(__name__)

Base = declarative_base()

try:
    engine = create_engine(
        settings.DATABASE_URL,
        pool_pre_ping=True,
        echo=False,
    )
    # Test quick connection
    with engine.connect() as conn:
        logger.info("Connected to primary database successfully.")
except Exception as e:
    logger.warning(f"PostgreSQL connection failed ({e}). Falling back to local SQLite engine.")
    engine = create_engine(
        "sqlite:///./agribridgezero.db",
        connect_args={"check_same_thread": False},
        echo=False,
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
