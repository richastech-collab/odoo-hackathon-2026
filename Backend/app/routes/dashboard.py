from fastapi import APIRouter
from database import db

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)


@router.get("/")
async def dashboard():
    total_trips = await db.trips.count_documents({})
    
    active_trips = await db.trips.count_documents({
        "status": "On Trip"
    })
    
    completed_trips = await db.trips.count_documents({
        "status": "Completed"
    })
    
    cancelled_trips = await db.trips.count_documents({
        "status": "Cancelled"
    })
    
    pending_trips = await db.trips.count_documents({
        "status": "Draft"
    })
    
    return {
        "totalTrips": total_trips,
        "activeTrips": active_trips,
        "completedTrips": completed_trips,
        "cancelledTrips": cancelled_trips,
        "pendingTrips": pending_trips
    }