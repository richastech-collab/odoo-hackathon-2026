from fastapi import APIRouter, HTTPException
from bson import ObjectId

from app.schemas.trip_schema import TripCreate
from database import db

router = APIRouter(
    prefix="/trips",
    tags=["Trips"]
)


@router.get("/")
async def get_all_trips():
    trips = []
    async for trip in db.trips.find():
        trip["id"] = str(trip.pop("_id"))
        trips.append(trip)
    return trips


@router.get("/{trip_id}")
async def get_trip(trip_id: str):
    try:
        trip = await db.trips.find_one({"_id": ObjectId(trip_id)})
        if trip is None:
            raise HTTPException(status_code=404, detail="Trip not found")
        trip["id"] = str(trip.pop("_id"))
        return trip
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid Trip ID")


@router.post("/")
async def create_trip(trip: TripCreate):
    trip_data = trip.model_dump()
    trip_data["status"] = "Draft"
    result = await db.trips.insert_one(trip_data)
    return {
        "message": "Trip Created Successfully",
        "trip_id": str(result.inserted_id)
    }


@router.post("/{trip_id}/dispatch")
async def dispatch_trip(trip_id: str):
    try:
        trip = await db.trips.find_one({"_id": ObjectId(trip_id)})
        if trip is None:
            raise HTTPException(status_code=404, detail="Trip not found")

        await db.trips.update_one(
            {"_id": ObjectId(trip_id)},
            {"$set": {"status": "On Trip"}}
        )
        return {"message": "Trip Dispatched Successfully"}
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid Trip ID")


@router.post("/{trip_id}/complete")
async def complete_trip(trip_id: str):
    try:
        trip = await db.trips.find_one({"_id": ObjectId(trip_id)})
        if trip is None:
            raise HTTPException(status_code=404, detail="Trip not found")

        await db.trips.update_one(
            {"_id": ObjectId(trip_id)},
            {"$set": {"status": "Completed"}}
        )
        return {"message": "Trip Completed Successfully"}
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid Trip ID")


@router.post("/{trip_id}/cancel")
async def cancel_trip(trip_id: str):
    try:
        trip = await db.trips.find_one({"_id": ObjectId(trip_id)})
        if trip is None:
            raise HTTPException(status_code=404, detail="Trip not found")

        await db.trips.update_one(
            {"_id": ObjectId(trip_id)},
            {"$set": {"status": "Cancelled"}}
        )
        return {"message": "Trip Cancelled Successfully"}
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid Trip ID")