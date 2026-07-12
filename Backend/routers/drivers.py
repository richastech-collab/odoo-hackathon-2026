from fastapi import APIRouter, Depends, HTTPException, status
from models.drivers import DriverCreate
from security import RoleChecker
from database import db

router = APIRouter(prefix="/drivers", tags=["Drivers"])
admin_manager_gate = RoleChecker(["Admin", "Manager"])

@router.post("", status_code=status.HTTP_201_CREATED)
async def add_driver(driver_data: DriverCreate, current_user: dict = Depends(admin_manager_gate)):
    existing = await db.drivers.find_one({"license_number": driver_data.license_number})
    if existing:
        raise HTTPException(status_code=400, detail="License number already exists")
    
    driver = driver_data.dict()
    await db.drivers.insert_one(driver)
    return {"message": "Driver profile created"}

@router.get("")
async def get_drivers(current_user: dict = Depends(admin_manager_gate)):
    drivers = []
    async for driver in db.drivers.find():
        driver["_id"] = str(driver["_id"])
        drivers.append(driver)
    return drivers