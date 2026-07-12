from fastapi import APIRouter

router = APIRouter(
    prefix="/reports",
    tags=["Reports"]
)

@router.get("/")
def reports():
    return {
        "message": "Reports"
    }