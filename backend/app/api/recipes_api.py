from fastapi import APIRouter, HTTPException, Depends
from typing import List
from pydantic import BaseModel
from sqlalchemy.orm import Session
from ..models.db_session import get_db
from ..models.database import Recipe, RecipeIngredient, Material
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

class RecipeResponse(BaseModel):
    id: int
    name: str
    portions: int
    kdv_rate: float
    total_cost: float
    portion_cost: float
    
    class Config:
        from_attributes = True

@router.get("/", response_model=List[RecipeResponse])
async def list_recipes(db: Session = Depends(get_db)):
    recipes = db.query(Recipe).all()
    results = []
    
    for r in recipes:
        calc_items = []
        for ing in r.ingredients:
            mat = db.query(Material).filter(Material.id == ing.material_id).first()
            if mat:
                calc_items.append({
                    "unit_price": mat.unit_price,
                    "amount": ing.amount,
                    "unit": ing.unit,
                    "waste_percent": mat.waste_percent
                })
        
        costs = calculate_recipe_total(calc_items, portions=r.portions)
        results.append({
            "id": r.id,
            "name": r.name,
            "portions": r.portions,
            "kdv_rate": r.kdv_rate,
            **costs
        })
    return results

@router.post("/", response_model=RecipeResponse)
async def create_recipe(recipe: RecipeBase, db: Session = Depends(get_db)):
    # Create the recipe
    db_recipe = Recipe(
        name=recipe.name,
        portions=recipe.portions,
        kdv_rate=recipe.kdv_rate
    )
    db.add(db_recipe)
    db.flush() # Get ID before adding ingredients
    
    calc_items = []
    for ing in recipe.ingredients:
        mat = db.query(Material).filter(Material.id == ing.material_id).first()
        if not mat:
            raise HTTPException(status_code=400, detail=f"Material {ing.material_id} not found")
        
        db_ing = RecipeIngredient(
            recipe_id=db_recipe.id,
            material_id=ing.material_id,
            amount=ing.amount,
            unit=ing.unit
        )
        db.add(db_ing)
        
        calc_items.append({
            "unit_price": mat.unit_price,
            "amount": ing.amount,
            "unit": ing.unit,
            "waste_percent": mat.waste_percent
        })
    
    db.commit()
    db.refresh(db_recipe)
    
    costs = calculate_recipe_total(calc_items, portions=db_recipe.portions)
    
    return {
        "id": db_recipe.id,
        "name": db_recipe.name,
        "portions": db_recipe.portions,
        "kdv_rate": db_recipe.kdv_rate,
        **costs
    }
