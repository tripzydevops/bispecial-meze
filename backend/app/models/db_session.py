from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv
from .database import Base

# Load environment variables from .env file
# Load environment variables
load_dotenv()

# Check if running on Vercel
IS_VERCEL = os.getenv("VERCEL", "0") == "1"

# Database URL configuration
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    if IS_VERCEL:
        SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"
    else:
        SQLALCHEMY_DATABASE_URL = "sqlite:///./meze_sistemi.db"
else:
    SQLALCHEMY_DATABASE_URL = DATABASE_URL
    # Fix for SQLAlchemy 1.4+ which requires "postgresql://" instead of "postgres://"
    if SQLALCHEMY_DATABASE_URL.startswith("postgres://"):
        SQLALCHEMY_DATABASE_URL = SQLALCHEMY_DATABASE_URL.replace("postgres://", "postgresql://", 1)
    
    # Ensure SSL for Supabase/Postgres if not specified
    if SQLALCHEMY_DATABASE_URL.startswith("postgresql"):
        if "sslmode" not in SQLALCHEMY_DATABASE_URL:
            separator = "&" if "?" in SQLALCHEMY_DATABASE_URL else "?"
            SQLALCHEMY_DATABASE_URL += f"{separator}sslmode=require"
    
    # Log masked URL for diagnostic purposes on Vercel
    masked_url = SQLALCHEMY_DATABASE_URL
    if "@" in masked_url:
        parts = masked_url.split("@")
        masked_url = parts[0].split(":")[0] + ":****@" + parts[1]
    print(f"Database configured with URL: {masked_url}")

# SQLite needs "check_same_thread" but PostgreSQL does not
connect_args = {"check_same_thread": False} if SQLALCHEMY_DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args=connect_args
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def init_db():
    try:
        Base.metadata.create_all(bind=engine)
        return True
    except Exception as e:
        print(f"Database initialization failed: {e}")
        return False

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
