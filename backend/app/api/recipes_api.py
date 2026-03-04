from fastapi import APIRouter, HTTPException
from typing import List, Dict
from pydantic import BaseModel
from .materials_api import mock_db as materials_db
from ..core.calculations import calculate_recipe_total

router = APIRouter(prefix="/api/recipes", tags=["recipes"])

class IngredientUsage(BaseModel):
    material_id: int
    amount: float
    unit: str

class RecipeBase(BaseModel):
    name: str
    portions: int = 1
    kdv_rate: float = 1.0
    ingredients: List[IngredientUsage]

class RecipeResponse(RecipeBase):
    id: int
    total_cost: float
    portion_cost: float

# Mock database for recipes
mock_recipes = []

@router.get("/", response_model=List[RecipeResponse])
async def list_recipes():
    results = []
    for r in mock_recipes:
        # Calculate costs on the fly for latest material prices
        calc_items = []
        for ing in r["ingredients"]:
            mat = next((m for m in materials_db if m["id"] == ing["material_id"]), None)
            if mat:
                calc_items.append({
                    "unit_price": mat["unit_price"],
                    "amount": ing["amount"],
                    "unit": ing["unit"],
                    "waste_percent": mat["waste_percent"]
                })
        
        costs = calculate_recipe_total(calc_items, portions=r["portions"])
        results.append({**r, **costs})
    return results

@router.post("/", response_model=RecipeResponse)
async def create_recipe(recipe: RecipeBase):
    new_id = max(r["id"] for r in mock_recipes) + 1 if mock_recipes else 1
    
    # Calculate initial costs
    calc_items = []
    for ing in recipe.ingredients:
        mat = next((m for m in materials_db if m.id == ing.material_id), None) # Note: pydantic vs dict
        # materials_db is a list of dicts in materials_api.py
        mat = next((m for m in materials_db if m["id"] == ing.material_id), None)
        if not mat:
            raise HTTPException(status_code=400, detail=f"Material {ing.material_id} not found")
        
        calc_items.append({
            "unit_price": mat["unit_price"],
            "amount": ing.amount,
            "unit": ing.unit,
            "waste_percent": mat["waste_percent"]
        })
    
    costs = calculate_recipe_total(calc_items, portions=recipe.portions)
    
    new_recipe = {
        "id": new_id,
        "name": recipe.name,
        "portions": recipe.portions,
        "kdv_rate": recipe.kdv_rate,
        "ingredients": [i.dict() for i in recipe.ingredients],
        **costs
    }
    mock_recipes.append(new_recipe)
    return new_recipe
