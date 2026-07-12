from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import init_db
from routers import auth, vehicles, drivers, expenses, maintenance
from app.routes import trips, dashboard, reports

app = FastAPI(title="Vehicle & Expense Management API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    await init_db()

@app.get("/")
async def root():
    return {"message": "Vehicle & Expense Management System Backend API is active"}

app.include_router(auth.router, prefix="/api")
app.include_router(vehicles.router, prefix="/api")
app.include_router(drivers.router, prefix="/api")
app.include_router(expenses.router, prefix="/api")
app.include_router(maintenance.router, prefix="/api")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)