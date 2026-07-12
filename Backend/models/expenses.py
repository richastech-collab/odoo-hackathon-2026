from pydantic import BaseModel
from typing import Optional

class ExpenseCreate(BaseModel):
    vehicleId: str
    date: str
    type: str
    amount: float
    desc: Optional[str] = None
    liters: Optional[float] = None
    costPerLiter: Optional[float] = None