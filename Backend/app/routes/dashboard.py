from fastapi import APIRouter

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)

@router.get("/")
def dashboard():
    return {
        "activeVehicles": 0,
        "availableVehicles": 0,
        "driversOnDuty": 0,
        "activeTrips": 0,
        "pendingTrips": 0,
        "fleetUtilization": 0
    }