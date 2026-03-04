from fastapi import APIRouter, HTTPException
from typing import List
from pydantic import BaseModel
from datetime import datetime

router = APIRouter(prefix="/api/materials", tags=["materials"])

class MaterialBase(BaseModel):
    name: str
    unit_type: str
    unit_price: float
    waste_percent: float = 0.0
    category: str = "Gıda"

class MaterialResponse(MaterialBase):
    id: int
    updated_at: datetime

    class Config:
        from_attributes = True

# Mock database for initial development
mock_db = [
    {"id": 1, "name": "Süzme Yoğurt", "unit_type": "kg", "unit_price": 120.0, "waste_percent": 0.0, "category": "Gıda", "updated_at": datetime.now()},
    {"id": 2, "name": "Patlıcan", "unit_type": "kg", "unit_price": 45.0, "waste_percent": 20.0, "category": "Gıda", "updated_at": datetime.now()},
]

@router.get("/", response_model=List[MaterialResponse])
async def list_materials():
    return mock_db

@router.post("/", response_model=MaterialResponse)
async def create_material(material: MaterialBase):
    new_id = max(m["id"] for m in mock_db) + 1 if mock_db else 1
    new_material = {**material.dict(), "id": new_id, "updated_at": datetime.now()}
    mock_db.append(new_material)
    return new_material

@router.get("/{material_id}", response_model=MaterialResponse)
async def get_material(material_id: int):
    for m in mock_db:
        if m["id"] == material_id:
            return m
    raise HTTPException(status_code=404, detail="Material not found")
