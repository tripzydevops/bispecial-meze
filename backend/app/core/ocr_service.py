import re
import difflib
from typing import List, Dict, Optional

def extract_invoice_data(ocr_text: str) -> List[Dict[str, any]]:
    """
    Draft function to parse OCR text from invoices.
    Targets lines with product names and prices.
    """
    matches = []
    
    # Simple regex pattern for common Turkish invoice lines
    # Example: "SUZME YOGURT 5KG 150.00"
    # This is a very basic draft; real implementation would use LLMs or specialized parsers.
    lines = ocr_text.split('\n')
    
    for line in lines:
        # Looking for patterns like: [Product Name] ... [Price]
        # Matching Turkish characters as well
        match = re.search(r"([A-ZÇĞİÖŞÜ\s]+)\s+([\d,.]+)", line, re.IGNORECASE)
        if match:
            product_name = match.group(1).strip()
            price_str = match.group(2).replace(',', '.')
            try:
                price = float(price_str)
                matches.append({
                    "raw_name": product_name,
                    "unit_price": price,
                    "confidence": 0.8 # Placeholder
                })
            except ValueError:
                continue
                
    return matches

def find_material_match(raw_name: str, existing_materials: List[Dict]) -> Optional[Dict]:
    """
    Uses fuzzy matching to find the best existing material for a scanned item.
    """
    if not existing_materials:
        return None
        
    material_names = [m["name"] for m in existing_materials]
    matches = difflib.get_close_matches(raw_name, material_names, n=1, cutoff=0.6)
    
    if matches:
        best_match_name = matches[0]
        # Find the original material object
        for m in existing_materials:
            if m["name"] == best_match_name:
                return m
    return None

def mock_process_image(image_bytes) -> str:
    """
    Simulates OCR processing call (e.g. to Tesseract or Google Vision)
    """
    return """
    BALIKESIR PEYNIRCISI
    FIS NO: 0006
    GIDA 195,58
    """

# Example:
# text = mock_process_image(None)
# print(extract_invoice_data(text))
