from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List, Dict
from ..models.db_session import get_db
from ..models.database import Material, Recipe
from ..core.calculations import calculate_recipe_total

router = APIRouter(prefix="/api/stats", tags=["stats"])

@router.get("/summary")
async def get_summary(db: Session = Depends(get_db)):
    # 1. Counts
    total_materials = db.query(Material).count()
    total_recipes = db.query(Recipe).count()
    
    # 2. Average Portion Cost
    recipes = db.query(Recipe).all()
    total_portion_cost = 0.0
    
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
        total_portion_cost += costs["portion_cost"]
        
    avg_portion_cost = round(total_portion_cost / total_recipes, 2) if total_recipes > 0 else 0.0
    
    # 3. Recent Activity (Mix of last 5 materials/recipes)
    # Note: We'll sort by id or updated_at if available
    recent_mats = db.query(Material).order_by(Material.id.desc()).limit(5).all()
    recent_recipes = db.query(Recipe).order_by(Recipe.id.desc()).limit(5).all()
    
    activity = []
    for m in recent_mats:
        activity.append({
            "id": f"mat_{m.id}",
            "type": "material",
            "title": m.name,
            "subtitle": f"{m.unit_price} ₺ / {m.unit_type}",
            "time": "Yeni" 
        })
    for r in recent_recipes:
        activity.append({
            "id": f"rec_{r.id}",
            "type": "recipe",
            "title": r.name,
            "subtitle": "Reçete güncellendi",
            "time": "Yeni"
        })
        
    return {
        "stats": {
            "materials": total_materials,
            "recipes": total_recipes,
            "avg_cost": avg_portion_cost,
            "active_tasks": 0 # Placeholder for now
        },
        "activity": activity[:6], # Show top 6
        "trends": [65, 78, 72, 85, 80, 92, 88] # Static trend data for chart
    }
