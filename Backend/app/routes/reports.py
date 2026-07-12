from fastapi import APIRouter
from app.database import db

router = APIRouter(
    prefix="/reports",
    tags=["Reports"]
)


@router.get("/")
def reports():

    if db is None:
        return {
            "message": "MongoDB not connected"
        }

    total_trips = db.trips.count_documents({})

    draft_trips = db.trips.count_documents({
        "status": "Draft"
    })

    active_trips = db.trips.count_documents({
        "status": "On Trip"
    })

    completed_trips = db.trips.count_documents({
        "status": "Completed"
    })

    cancelled_trips = db.trips.count_documents({
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