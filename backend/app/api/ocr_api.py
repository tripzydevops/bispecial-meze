from fastapi import APIRouter, UploadFile, File, HTTPException
from typing import List, Dict
from ..core.ocr_service import extract_invoice_data, mock_process_image

router = APIRouter(prefix="/api/ocr", tags=["ocr"])

@router.post("/scan")
async def scan_invoice(file: UploadFile = File(...)):
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
        
        return {
            "filename": file.filename,
            "extracted_items": extracted_data,
            "message": "Fatura başarıyla tarandı. Lütfen fiyatları kontrol ederek onaylayınız."
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OCR Processing failed: {str(e)}")
