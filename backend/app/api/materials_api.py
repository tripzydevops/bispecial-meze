from fastapi import APIRouter, HTTPException, Depends
from typing import List
from pydantic import BaseModel
from sqlalchemy.orm import Session
from datetime import datetime
from ..models.db_session import get_db
from ..models.database import Material

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

@router.get("/", response_model=List[MaterialResponse])
async def list_materials(db: Session = Depends(get_db)):
    return db.query(Material).all()

@router.post("/", response_model=MaterialResponse)
async def create_material(material: MaterialBase, db: Session = Depends(get_db)):
    db_material = Material(**material.dict())
    db.add(db_material)
    db.commit()
    db.refresh(db_material)
    return db_material

@router.get("/{material_id}", response_model=MaterialResponse)
async def get_material(material_id: int, db: Session = Depends(get_db)):
    material = db.query(Material).filter(Material.id == material_id).first()
    if not material:
        raise HTTPException(status_code=404, detail="Material not found")
    return material

@router.put("/{material_id}", response_model=MaterialResponse)
async def update_material(material_id: int, material: MaterialBase, db: Session = Depends(get_db)):
    db_material = db.query(Material).filter(Material.id == material_id).first()
    if not db_material:
        raise HTTPException(status_code=404, detail="Material not found")
    
    for key, value in material.dict().items():
        setattr(db_material, key, value)
    
    db.commit()
    db.refresh(db_material)
    return db_material
