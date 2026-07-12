from fastapi import APIRouter, Depends, status, HTTPException
from models.expenses import ExpenseCreate
from security import RoleChecker
from database import db
from datetime import datetime
from bson import ObjectId

router = APIRouter(prefix="/expenses", tags=["Expenses"])
all_roles_gate = RoleChecker(["admin", "manager", "financial analyst"])

@router.post("", status_code=status.HTTP_201_CREATED)
async def log_expense(expense_data: ExpenseCreate, current_user: dict = Depends(all_roles_gate)):
    expense = expense_data.model_dump()
    expense["logged_by"] = str(current_user["_id"])
    expense["timestamp"] = datetime.utcnow().isoformat()
    result = await db.expenses.insert_one(expense)
    return {"message": "Expense logged successfully", "id": str(result.inserted_id)}

@router.get("")
async def get_expenses(current_user: dict = Depends(all_roles_gate)):
    expenses = []
    async for expense in db.expenses.find():
        expense["id"] = str(expense.pop("_id"))
        expenses.append(expense)
    return expenses

@router.put("/{expense_id}", status_code=status.HTTP_200_OK)
async def update_expense(expense_id: str, expense_data: ExpenseCreate, current_user: dict = Depends(all_roles_gate)):
    if not ObjectId.is_valid(expense_id):
        raise HTTPException(status_code=400, detail="Invalid expense ID format")
    
    await db.expenses.update_one(
        {"_id": ObjectId(expense_id)},
        {"$set": expense_data.model_dump()}
    )
    return {"message": "Expense updated successfully"}

@router.delete("/{expense_id}", status_code=status.HTTP_200_OK)
async def delete_expense(expense_id: str, current_user: dict = Depends(all_roles_gate)):
    if not ObjectId.is_valid(expense_id):
        raise HTTPException(status_code=400, detail="Invalid expense ID format")
        
    result = await db.expenses.delete_one({"_id": ObjectId(expense_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Expense not found")
    return {"message": "Expense deleted successfully"}