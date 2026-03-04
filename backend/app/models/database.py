from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Enum
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

Base = declarative_base()

class UnitType(str, enum.Enum):
    KG = "kg"
    LT = "lt"
    ADET = "adet"
    BAG = "bağ"
    GR = "gr"
    ML = "ml"

class Material(Base):
    __tablename__ = "materials"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    unit_type = Column(String, nullable=False) # Base unit (kg, lt, etc)
    unit_price = Column(Float, default=0.0)
    waste_percent = Column(Float, default=0.0) # Fire payı
    category = Column(String, default="Gıda") # Gıda, Ambalaj, Genel
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Recipe(Base):
    __tablename__ = "recipes"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    portions = Column(Integer, default=1)
    kdv_rate = Column(Float, default=1.0) # KDV oranı (e.g. 1.01, 1.10)
    created_at = Column(DateTime, default=datetime.utcnow)

    ingredients = relationship("RecipeIngredient", back_populates="recipe")

class RecipeIngredient(Base):
    __tablename__ = "recipe_ingredients"

    id = Column(Integer, primary_key=True, index=True)
    recipe_id = Column(Integer, ForeignKey("recipes.id"))
    material_id = Column(Integer, ForeignKey("materials.id"))
    amount = Column(Float, nullable=False)
    unit = Column(String, nullable=False) # Usage unit (can be gr, ml, etc)

    recipe = relationship("Recipe", back_populates="ingredients")
    material = relationship("Material")
