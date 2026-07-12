from fastapi import APIRouter, HTTPException
from bson import ObjectId

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
            "message": "MongoDB not connected",
            "data": []
        }

    trips = []

    for trip in db.trips.find():
        trip["_id"] = str(trip["_id"])
        trips.append(trip)

    return trips


@router.get("/{trip_id}")
def get_trip(trip_id: str):

    if db is None:
        return {
            "message": "MongoDB not connected"
        }

    try:
        trip = db.trips.find_one({"_id": ObjectId(trip_id)})

        if trip is None:
            raise HTTPException(status_code=404, detail="Trip not found")

        trip["_id"] = str(trip["_id"])

        return trip

    except Exception:
        raise HTTPException(status_code=400, detail="Invalid Trip ID")


@router.post("/")
def create_trip(trip: TripCreate):

    if db is None:
        return {
            "message": "MongoDB not connected",
            "data": trip.model_dump()
        }

    trip_data = trip.model_dump()
    trip_data["status"] = "Draft"

    result = db.trips.insert_one(trip_data)

    return {
        "message": "Trip Created Successfully",
        "trip_id": str(result.inserted_id)
    }


@router.post("/{trip_id}/dispatch")
def dispatch_trip(trip_id: str):

    if db is None:
        return {
            "message": "MongoDB not connected"
        }

    try:

        trip = db.trips.find_one({"_id": ObjectId(trip_id)})

        if trip is None:
            raise HTTPException(status_code=404, detail="Trip not found")

        db.trips.update_one(
            {"_id": ObjectId(trip_id)},
            {
                "$set": {
                    "status": "On Trip"
                }
            }
        )

        return {
            "message": "Trip Dispatched Successfully"
        }

    except Exception:
        raise HTTPException(status_code=400, detail="Invalid Trip ID")


@router.post("/{trip_id}/complete")
def complete_trip(trip_id: str):

    if db is None:
        return {
            "message": "MongoDB not connected"
        }

    try:

        trip = db.trips.find_one({"_id": ObjectId(trip_id)})

        if trip is None:
            raise HTTPException(status_code=404, detail="Trip not found")

        db.trips.update_one(
            {"_id": ObjectId(trip_id)},
            {
                "$set": {
                    "status": "Completed"
                }
            }
        )

        return {
            "message": "Trip Completed Successfully"
        }

    except Exception:
        raise HTTPException(status_code=400, detail="Invalid Trip ID")


@router.post("/{trip_id}/cancel")
def cancel_trip(trip_id: str):

    if db is None:
        return {
            "message": "MongoDB not connected"
        }

    try:

        trip = db.trips.find_one({"_id": ObjectId(trip_id)})

        if trip is None:
            raise HTTPException(status_code=404, detail="Trip not found")

        db.trips.update_one(
            {"_id": ObjectId(trip_id)},
            {
                "$set": {
                    "status": "Cancelled"
                }
            }
        )

        return {
            "message": "Trip Cancelled Successfully"
        }

    except Exception:
        raise HTTPException(status_code=400, detail="Invalid Trip ID")