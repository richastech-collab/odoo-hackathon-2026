from fastapi import APIRouter, Depends, HTTPException, status
from models.vehicles import VehicleCreate
from security import RoleChecker
from database import db
from bson import ObjectId

router = APIRouter(prefix="/vehicles", tags=["Vehicles"])
admin_manager_gate = RoleChecker(["admin", "manager"])
all_roles_gate = RoleChecker(["admin", "manager", "driver", "safety officer", "financial analyst"])

@router.post("", status_code=status.HTTP_201_CREATED)
async def add_vehicle(vehicle_data: VehicleCreate, current_user: dict = Depends(admin_manager_gate)):
    existing = await db.vehicles.find_one({"regNo": vehicle_data.regNo})
    if existing:
        raise HTTPException(status_code=400, detail="Vehicle plate already registered")
    
    vehicle = vehicle_data.model_dump()
    result = await db.vehicles.insert_one(vehicle)
    return {"message": "Vehicle added successfully", "id": str(result.inserted_id)}

@router.put("/{vehicle_id}", status_code=status.HTTP_200_OK)
async def update_vehicle(vehicle_id: str, vehicle_data: VehicleCreate, current_user: dict = Depends(admin_manager_gate)):
    existing = await db.vehicles.find_one({"_id": ObjectId(vehicle_id)})
    if not existing:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    
    await db.vehicles.update_one(
        {"_id": ObjectId(vehicle_id)},
        {"$set": vehicle_data.model_dump()}
    )
    return {"message": "Vehicle updated successfully"}

@router.delete("/{vehicle_id}", status_code=status.HTTP_200_OK)
async def delete_vehicle(vehicle_id: str, current_user: dict = Depends(admin_manager_gate)):
    result = await db.vehicles.delete_one({"_id": ObjectId(vehicle_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    return {"message": "Vehicle deleted successfully"}

@router.get("")
async def get_vehicles(current_user: dict = Depends(all_roles_gate)):
    vehicles = []
    async for vehicle in db.vehicles.find():
        vehicle["id"] = str(vehicle.pop("_id"))
        vehicles.append(vehicle)
    return vehicles