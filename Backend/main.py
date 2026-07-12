import os
import sys

# 1. FORCE VERCEL TO SEARCH THE BACKEND DIRECTORY FOR LOCAL IMPORTS
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import init_db
from routers import auth, vehicles, drivers, expenses, maintenance

# Fixed relative/absolute import pathing if 'app' is inside Backend folder:
try:
    from app.routes import trips, dashboard, reports
except ModuleNotFoundError:
    # Fallback in case 'app' path maps differently relative to the root folder
    from Backend.app.routes import trips, dashboard, reports

app = FastAPI(title="Vehicle & Expense Management API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. RUN STARTUP DATABASE CHECKS WITHOUT BLOCKING INITIALIZATION
@app.on_event("startup")
async def startup_event():
    try:
        await init_db()
    except Exception as e:
        print(f"Database connection skipped or failed on startup: {e}")

@app.get("/")
async def root():
    return {"message": "Vehicle & Expense Management System Backend API is active"}

app.include_router(auth.router, prefix="/api")
app.include_router(vehicles.router, prefix="/api")
app.include_router(drivers.router, prefix="/api")
app.include_router(expenses.router, prefix="/api")
app.include_router(maintenance.router, prefix="/api")
app.include_router(trips.router, prefix="/api")
app.include_router(dashboard.router, prefix="/api")
app.include_router(reports.router, prefix="/api")

# 3. DO NOT CALL uvicorn.run DIRECTLY AT ROOT LEVEL FOR VERCEL
# Vercel reads the 'app' variable directly; execution blocks here will cause status 1 crashes.