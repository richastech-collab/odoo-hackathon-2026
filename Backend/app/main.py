from fastapi import FastAPI

from app.routes.trips import router as trips_router
from app.routes.dashboard import router as dashboard_router
from app.routes.maintenance import router as maintenance_router
from app.routes.reports import router as reports_router

app = FastAPI(title="TransitOps Backend")

app.include_router(trips_router)
app.include_router(dashboard_router)
app.include_router(maintenance_router)
app.include_router(reports_router)

@app.get("/")
def home():
    return {
        "message": "TransitOps Backend Running 🚀"
    }