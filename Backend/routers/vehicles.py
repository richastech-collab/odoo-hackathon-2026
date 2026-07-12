from fastapi import APIRouter, Depends, HTTPException, status
from models.vehicles import VehicleCreate
from security import RoleChecker
from database import db

router = APIRouter(prefix="/vehicles", tags=["Vehicles"])
admin_manager_gate = RoleChecker(["admin", "manager"])
all_roles_gate = RoleChecker(["admin", "manager", "driver"])

@router.post("", status_code=status.HTTP_201_CREATED)
async def add_vehicle(vehicle_data: VehicleCreate, current_user: dict = Depends(admin_manager_gate)):
    existing = await db.vehicles.find_one({"license_plate": vehicle_data.license_plate})
    if existing:
        raise HTTPException(status_code=400, detail="Vehicle plate already registered")
    
    vehicle = vehicle_data.dict()
    await db.vehicles.insert_one(vehicle)
    return {"message": "Vehicle added successfully"}

@router.get("")
async def get_vehicles(current_user: dict = Depends(all_roles_gate)):
    vehicles = []
    async for vehicle in db.vehicles.find():
        vehicle["_id"] = str(vehicle["_id"])
        vehicles.append(vehicle)
    return vehicles