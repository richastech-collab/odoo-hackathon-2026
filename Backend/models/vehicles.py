from pydantic import BaseModel
from typing import Optional

class VehicleCreate(BaseModel):
    regNo: str
    name: str
    type: str
    capacity: float
    odometer: float
    cost: float
    status: str = "Available"