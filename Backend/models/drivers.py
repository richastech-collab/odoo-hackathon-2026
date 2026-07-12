from pydantic import BaseModel
from typing import Optional

class DriverCreate(BaseModel):
    name: str
    licenseNo: str
    category: str
    expiryDate: str
    safetyScore: int
    status: str = "Available"