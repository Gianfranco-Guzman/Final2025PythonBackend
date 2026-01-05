"""Product schema for request/response validation."""
from schemas.category_schema import CategorySchemaWithoutProducts
from typing import Optional, List, TYPE_CHECKING
from pydantic import Field

from schemas.base_schema import BaseSchema

if TYPE_CHECKING:
    from schemas.category_schema import CategorySchema, CategorySchemaWithoutProducts


class ProductSchemaWithoutRelations(BaseSchema):
    """Schema for Product entity without any relational fields to break cycles."""

    name: str = Field(..., min_length=1, max_length=200,
                      description="Product name (required)")
    price: float = Field(..., gt=0,
                         description="Product price (must be greater than 0, required)")
    stock: int = Field(
        default=0, ge=0, description="Product stock quantity (must be >= 0)")
    category_id: int = Field(...,
                             description="Category ID reference (required)")


class ProductSchema(BaseSchema):
    """Schema for Product entity with validations."""

    name: str = Field(..., min_length=1, max_length=200, description="Product name (required)")
    price: float = Field(..., gt=0, description="Product price (must be greater than 0, required)")
    stock: int = Field(default=0, ge=0, description="Product stock quantity (must be >= 0)")

    category_id: int = Field(..., description="Category ID reference (required)")

    category: Optional['CategorySchemaWithoutProducts'] = None


# Rebuild schema to resolve forward references
ProductSchema.model_rebuild()
