from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.api import materials_api, recipes_api, ocr_api, stats_api
from backend.app.models.db_session import init_db
from mangum import Mangum
import uvicorn

try:
    init_db()
except Exception as e:
    print(f"Startup error: {e}")

app = FastAPI(title="BiSpecial Meze Maliyet Kontrol Sistemi")
handler = Mangum(app)

# CORS setup for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "BiSpecial Meze API is running", "version": "1.0.0"}

app.include_router(stats_api.router)

@app.get("/api/health")
async def health_check():
    from backend.app.models.db_session import SQLALCHEMY_DATABASE_URL
    db_status = "unknown"
    db_type = "sqlite" if "sqlite" in SQLALCHEMY_DATABASE_URL else "postgresql"
    
    try:
        from sqlalchemy import text
        from backend.app.models.db_session import SessionLocal
        db = SessionLocal()
        db.execute(text("SELECT 1"))
        db.close()
        db_status = "connected"
    except Exception as e:
        db_status = f"error: {str(e)}"

    return {
        "status": "online",
        "environment": "vercel" if os.getenv("VERCEL") else "local",
        "database": {
            "type": db_type,
            "status": db_status
        }
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=True)
