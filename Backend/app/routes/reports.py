from fastapi import APIRouter
from database import db

router = APIRouter(
    prefix="/reports",
    tags=["Reports"]
)


@router.get("/")
async def reports():
    total_trips = await db.trips.count_documents({})
    
    draft_trips = await db.trips.count_documents({
        "status": "Draft"
    })
    
    active_trips = await db.trips.count_documents({
        "status": "On Trip"
    })
    
    completed_trips = await db.trips.count_documents({
        "status": "Completed"
    })
    
    cancelled_trips = await db.trips.count_documents({
        "status": "Cancelled"
    })
    
    return {
        "summary": {
            "totalTrips": total_trips,
            "draftTrips": draft_trips,
            "activeTrips": active_trips,
            "completedTrips": completed_trips,
            "cancelledTrips": cancelled_trips
        }
    }