from pydantic import BaseModel
from typing import Optional

class MaintenanceCreate(BaseModel):
    vehicleId: str
    serviceType: str
    date: str
    cost: float
    description: str
    status: str = "Pending"