from pydantic import BaseModel
from typing import Dict, Any, Optional

class ExpenseCreate(BaseModel):
    vehicle_id: str
    amount: float
    type: str
    details: Optional[Dict[str, Any]] = None