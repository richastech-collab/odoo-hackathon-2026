from motor.motor_asyncio import AsyncIOMotorClient
from config import settings

client = AsyncIOMotorClient(settings.MONGO_URI)
db = client.vehicle_db

async def init_db():
    await db.users.create_index("email", unique=True)
    await db.vehicles.create_index("license_plate", unique=True)
    await db.drivers.create_index("license_number", unique=True)