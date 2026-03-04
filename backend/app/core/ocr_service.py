
import re
from typing import List, Dict

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

def mock_process_image(image_bytes) -> str:
    """
    Simulates OCR processing call (e.g. to Tesseract or Google Vision)
    """
    return """
    BI SPECIAL MEZE
    FIS NO: 0001
    SUZME YOGURT 150,00
    PATLICAN 80,00
    KAP 1.50
    """

# Example:
# text = mock_process_image(None)
# print(extract_invoice_data(text))
