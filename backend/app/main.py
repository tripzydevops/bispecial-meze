from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.api import materials_api, recipes_api, ocr_api
import uvicorn

app = FastAPI(title="BiSpecial Meze Maliyet Kontrol Sistemi")

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

# Include routers
app.include_router(materials_api.router)
app.include_router(recipes_api.router)
app.include_router(ocr_api.router)

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=True)
