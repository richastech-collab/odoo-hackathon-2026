from fastapi import APIRouter, Depends, status
from models.expenses import ExpenseCreate
from security import RoleChecker
from database import db
from datetime import datetime

router = APIRouter(prefix="/expenses", tags=["Expenses"])
all_roles_gate = RoleChecker(["Admin", "Manager", "Driver"])
admin_manager_gate = RoleChecker(["Admin", "Manager"])

@router.post("", status_code=status.HTTP_201_CREATED)
async def log_expense(expense_data: ExpenseCreate, current_user: dict = Depends(all_roles_gate)):
    expense = expense_data.dict()
    expense["logged_by"] = str(current_user["_id"])
    expense["timestamp"] = datetime.utcnow().isoformat()
    await db.expenses.insert_one(expense)
    return {"message": "Expense logged successfully"}

@router.get("/vehicle/{vehicle_id}")
async def get_vehicle_expenses(vehicle_id: str, current_user: dict = Depends(admin_manager_gate)):
    expenses = []
    async for expense in db.expenses.find({"vehicle_id": vehicle_id}):
        expense["_id"] = str(expense["_id"])
        expenses.append(expense)
    return expenses