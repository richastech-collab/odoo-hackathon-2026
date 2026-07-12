from pydantic import BaseModel

class TripCreate(BaseModel):
    source: str
    dest: str
    vehicleId: str
    driverId: str
    weight: float
    status: str = "Draft"