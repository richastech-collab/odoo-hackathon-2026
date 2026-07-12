from fastapi import APIRouter, Depends, HTTPException, status
from models.maintenance import MaintenanceCreate
from security import RoleChecker
from database import db
from bson import ObjectId
from datetime import datetime

router = APIRouter(prefix="/maintenance", tags=["Maintenance"])
admin_manager_gate = RoleChecker(["admin", "manager"])
all_roles_gate = RoleChecker(["admin", "manager", "driver"])

@router.post("", status_code=status.HTTP_201_CREATED)
async def log_maintenance(maintenance_data: MaintenanceCreate, current_user: dict = Depends(admin_manager_gate)):
    vehicle = await db.vehicles.find_one({"license_plate": maintenance_data.vehicle_plate})
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
        
    maintenance = maintenance_data.dict()
    await db.maintenance.insert_one(maintenance)
    
    await db.vehicles.update_one(
        {"license_plate": maintenance_data.vehicle_plate},
        {"$set": {"status": "Maintenance"}}
    )
    return {"message": "Maintenance log created successfully and vehicle status updated"}

@router.get("/vehicle/{vehicle_plate}")
async def get_vehicle_maintenance_history(vehicle_plate: str, current_user: dict = Depends(all_roles_gate)):
    logs = []
    async for log in db.maintenance.find({"vehicle_plate": vehicle_plate}):
        log["_id"] = str(log["_id"])
        logs.append(log)
    return logs

@router.patch("/{log_id}/complete")
async def complete_maintenance(log_id: str, current_user: dict = Depends(admin_manager_gate)):
    if not ObjectId.is_valid(log_id):
        raise HTTPException(status_code=400, detail="Invalid maintenance log ID format")
        
    log = await db.maintenance.find_one({"_id": ObjectId(log_id)})
    if not log:
        raise HTTPException(status_code=404, detail="Maintenance log not found")
        
    await db.maintenance.update_one(
        {"_id": ObjectId(log_id)},
        {"$set": {"status": "Completed", "completion_date": datetime.utcnow()}}
    )
    
    await db.vehicles.update_one(
        {"license_plate": log["vehicle_plate"]},
        {"$set": {"status": "Active"}}
    )
    
    return {"message": "Maintenance marked as completed and vehicle status restored to Active"}