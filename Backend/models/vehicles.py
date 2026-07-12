from pydantic import BaseModel
from typing import Optional

class VehicleCreate(BaseModel):
    license_plate: str
    model: str
    year: Optional[int] = None
    status: str = "Active"