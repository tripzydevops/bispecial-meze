
def convert_to_base_unit(amount: float, unit: str) -> float:
    """
    Converts units like 'gr' to 'kg' or 'ml' to 'lt' for standardized calculation.
    Base units: kg, lt, adet, bağ.
    """
    unit = unit.lower().strip()
    if unit == 'gr':
        return amount / 1000
    if unit == 'ml':
        return amount / 1000
    return amount

def calculate_item_cost(unit_price: float, amount: float, unit: str, waste_percent: float = 0.0) -> float:
    """
    Calculates the cost of an item in a recipe.
    
    Formula:
    Effective Cost = (Unit Price * Standardized Amount) * (1 + Waste Percentage)
    """
    # Standardize amount (e.g., 500gr -> 0.5kg)
    standardized_amount = convert_to_base_unit(amount, unit)
    
    # Calculate waste factor (e.g., 20% -> 1.25 multiplier or direct addition?)
    # Usually: If 1kg eggplant gives 0.8kg after peeling, 
    # the cost of that 0.8kg is the full price of 1kg.
    # So waste_factor = 1 / (1 - waste_percent/100)
    
    waste_factor = 1 / (1 - (waste_percent / 100)) if waste_percent < 100 else 1.0
    
    item_cost = unit_price * standardized_amount * waste_factor
    return round(item_cost, 2)

def calculate_recipe_total(items: list, portions: int = 1) -> dict:
    """
    Aggregates total cost and cost per portion.
    items: list of dicts with {unit_price, amount, unit, waste_percent}
    """
    total_cost = sum(calculate_item_cost(**item) for item in items)
    return {
        "total_cost": round(total_cost, 2),
        "portion_cost": round(total_cost / portions, 2) if portions > 0 else 0
    }

# Example Usage:
# materials = [
#     {"unit_price": 200, "amount": 500, "unit": "gr", "waste_percent": 0},    # Yogurt
#     {"unit_price": 80,  "amount": 1,   "unit": "kg", "waste_percent": 20},   # Patlıcan (Eggplant)
# ]
# print(calculate_recipe_total(materials, portions=4))
