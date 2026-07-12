from fastapi import APIRouter
from app.database import db

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)


@router.get("/")
def dashboard():

    if db is None:
        return {
            "message": "MongoDB not connected"
        }

    total_trips = db.trips.count_documents({})

    active_trips = db.trips.count_documents({
        "status": "On Trip"
    })

    completed_trips = db.trips.count_documents({
        "status": "Completed"
    })

    cancelled_trips = db.trips.count_documents({
        "status": "Cancelled"
    })

    pending_trips = db.trips.count_documents({
        "status": "Draft"
    })

    return {
        "totalTrips": total_trips,
        "activeTrips": active_trips,
        "completedTrips": completed_trips,
        "cancelledTrips": cancelled_trips,
        "pendingTrips": pending_trips
    }