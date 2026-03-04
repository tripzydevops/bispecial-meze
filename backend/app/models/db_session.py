from sqlalchemy import create_client_engine, create_engine
from sqlalchemy.orm import sessionmaker
import os
from .database import Base

# Using SQLite for initial local development
# In production, this can be switched to PostgreSQL via environment variables
SQLALCHEMY_DATABASE_URL = "sqlite:///./meze_sistemi.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def init_db():
    Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
