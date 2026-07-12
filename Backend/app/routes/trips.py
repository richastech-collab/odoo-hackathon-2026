from fastapi import APIRouter
from app.schemas.trip_schema import TripCreate
from app.database import db

router = APIRouter(
    prefix="/trips",
    tags=["Trips"]
)

@router.get("/")
def get_all_trips():

    if db is None:
        return {
            "message": "MongoDB not connected yet",
            "data": []
        }

    trips = []

    for trip in db.trips.find():
        trip["_id"] = str(trip["_id"])
        trips.append(trip)

    return trips


@router.post("/")
def create_trip(trip: TripCreate):

    if db is None:
        return {
            "message": "MongoDB not connected yet",
            "data": trip.model_dump()
        }

    result = db.trips.insert_one(trip.model_dump())

    return {
        "message": "Trip Created Successfully",
        "trip_id": str(result.inserted_id)
    }


@router.post("/{trip_id}/dispatch")
def dispatch_trip(trip_id: str):

    return {
        "message": f"Trip {trip_id} dispatched"
    }


@router.post("/{trip_id}/complete")
def complete_trip(trip_id: str):

    return {
        "message": f"Trip {trip_id} completed"
    }


@router.post("/{trip_id}/cancel")
def cancel_trip(trip_id: str):

    return {
        "message": f"Trip {trip_id} cancelled"
    }