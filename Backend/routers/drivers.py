from fastapi import APIRouter, Depends, HTTPException, status
from models.drivers import DriverCreate
from security import RoleChecker
from database import db
from bson import ObjectId

router = APIRouter(prefix="/drivers", tags=["Drivers"])
all_roles_gate = RoleChecker(["admin", "manager", "safety officer"])

@router.post("", status_code=status.HTTP_201_CREATED)
async def add_driver(driver_data: DriverCreate, current_user: dict = Depends(all_roles_gate)):
    existing = await db.drivers.find_one({"licenseNo": driver_data.licenseNo})
    if existing:
        raise HTTPException(status_code=400, detail="License number already exists")
    
    driver = driver_data.model_dump()
    result = await db.drivers.insert_one(driver)
    return {"message": "Driver profile created", "id": str(result.inserted_id)}

@router.put("/{driver_id}", status_code=status.HTTP_200_OK)
async def update_driver(driver_id: str, driver_data: DriverCreate, current_user: dict = Depends(all_roles_gate)):
    existing = await db.drivers.find_one({"_id": ObjectId(driver_id)})
    if not existing:
        raise HTTPException(status_code=404, detail="Driver not found")
    
    await db.drivers.update_one(
        {"_id": ObjectId(driver_id)},
        {"$set": driver_data.model_dump()}
    )
    return {"message": "Driver updated successfully"}

@router.delete("/{driver_id}", status_code=status.HTTP_200_OK)
async def delete_driver(driver_id: str, current_user: dict = Depends(all_roles_gate)):
    result = await db.drivers.delete_one({"_id": ObjectId(driver_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Driver not found")
    return {"message": "Driver deleted successfully"}

@router.get("")
async def get_drivers(current_user: dict = Depends(all_roles_gate)):
    drivers = []
    async for driver in db.drivers.find():
        driver["id"] = str(driver.pop("_id"))
        drivers.append(driver)
    return drivers