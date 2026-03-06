from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from typing import List, Dict
from pydantic import BaseModel
from sqlalchemy.orm import Session
from ..core.ocr_service import extract_invoice_data, mock_process_image, find_material_match
from ..models.db_session import get_db
from ..models.database import Material

router = APIRouter(prefix="/api/ocr", tags=["ocr"])

class OcrItem(BaseModel):
    name: str
    unit_price: float
    unit_type: str = "kg"
    waste_percent: float = 0.0
    category: str = "Gıda"

class SaveOcrRequest(BaseModel):
    items: List[OcrItem]

@router.post("/scan")
async def scan_invoice(file: UploadFile = File(...), db: Session = Depends(get_db)):
    """
    Receives an image file, processes it via OCR, and returns extracted price data.
    """
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    try:
        contents = await file.read()
        # In a real app, we'd send 'contents' to Google Vision/Tesseract
        raw_text = mock_process_image(contents)
        extracted_data = extract_invoice_data(raw_text)
        
        # Add fuzzy matching
        existing = db.query(Material).all()
        existing_dicts = [{"id": m.id, "name": m.name, "category": m.category} for m in existing]
        
        for item in extracted_data:
            match = find_material_match(item["raw_name"], existing_dicts)
            if match:
                item["suggested_id"] = match["id"]
                item["suggested_name"] = match["name"]
        
        return {
            "filename": file.filename,
            "extracted_items": extracted_data,
            "message": "Fatura başarıyla tarandı. Lütfen fiyatları kontrol ederek onaylayınız."
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OCR Processing failed: {str(e)}")

@router.post("/save")
async def save_ocr_items(request: SaveOcrRequest, db: Session = Depends(get_db)):
    """
    Saves verified OCR items to the Material database.
    """
    try:
        saved_count = 0
        for item in request.items:
            # Check if material already exists by name
            existing = db.query(Material).filter(Material.name == item.name).first()
            if existing:
                # Update price if it exists
                existing.unit_price = item.unit_price
                existing.unit_type = item.unit_type
                existing.waste_percent = item.waste_percent
            else:
                # Create new material
                db_material = Material(
                    name=item.name,
                    unit_price=item.unit_price,
                    unit_type=item.unit_type,
                    waste_percent=item.waste_percent,
                    category=item.category
                )
                db.add(db_material)
                db.flush() # Get ID for history
            
            # Record history entry
            from ..models.database import MaterialPriceHistory
            history = MaterialPriceHistory(material_id=db_material.id, price=item.unit_price)
            db.add(history)
            
            saved_count += 1
            
        db.commit()
        return {"status": "success", "saved_count": saved_count}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to save items: {str(e)}")
