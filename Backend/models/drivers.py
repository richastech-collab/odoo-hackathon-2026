from pydantic import BaseModel
from typing import Optional

class DriverCreate(BaseModel):
    name: str
    license_number: str
    status: str = "Available"
    assigned_vehicle: Optional[str] = None