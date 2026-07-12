from fastapi import APIRouter, Depends, HTTPException, status
from models.maintenance import MaintenanceCreate
from security import RoleChecker
from database import db
from bson import ObjectId

router = APIRouter(prefix="/maintenance", tags=["Maintenance"])
all_roles_gate = RoleChecker(["admin", "manager", "safety officer"])

@router.post("", status_code=status.HTTP_201_CREATED)
async def log_maintenance(maintenance_data: MaintenanceCreate, current_user: dict = Depends(all_roles_gate)):
    maintenance = maintenance_data.model_dump()
    result = await db.maintenance.insert_one(maintenance)
    
    # Update vehicle status
    await db.vehicles.update_one(
        {"regNo": maintenance_data.vehicleId},
        {"$set": {"status": "In Shop"}}
    )
    return {"message": "Maintenance log created successfully", "id": str(result.inserted_id)}

@router.put("/{log_id}", status_code=status.HTTP_200_OK)
async def update_maintenance(log_id: str, maintenance_data: MaintenanceCreate, current_user: dict = Depends(all_roles_gate)):
    if not ObjectId.is_valid(log_id):
        raise HTTPException(status_code=400, detail="Invalid maintenance log ID format")
    
    await db.maintenance.update_one(
        {"_id": ObjectId(log_id)},
        {"$set": maintenance_data.model_dump()}
    )
    return {"message": "Maintenance log updated successfully"}

@router.delete("/{log_id}", status_code=status.HTTP_200_OK)
async def delete_maintenance(log_id: str, current_user: dict = Depends(all_roles_gate)):
    if not ObjectId.is_valid(log_id):
        raise HTTPException(status_code=400, detail="Invalid maintenance log ID format")
        
    result = await db.maintenance.delete_one({"_id": ObjectId(log_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Maintenance log not found")
    return {"message": "Maintenance log deleted successfully"}

@router.get("")
async def get_all_maintenance(current_user: dict = Depends(all_roles_gate)):
    logs = []
    async for log in db.maintenance.find():
        log["id"] = str(log.pop("_id"))
        logs.append(log)
    return logs