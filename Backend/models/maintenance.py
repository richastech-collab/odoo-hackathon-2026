from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class MaintenanceCreate(BaseModel):
    vehicle_plate: str = Field(..., description="The license plate of the vehicle under maintenance")
    service_type: str = Field(..., description="Type of service: Repair, Routine, Inspection, etc.")
    description: str = Field(..., description="Detailed notes on what is being fixed")
    cost: float = Field(..., ge=0, description="Cost of the maintenance activity")
    start_date: datetime = Field(default_factory=datetime.utcnow)
    completion_date: Optional[datetime] = None
    status: str = Field(default="Scheduled", description="Status: Scheduled, In Progress, Completed")