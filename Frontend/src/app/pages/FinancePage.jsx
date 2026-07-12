/**
 * FinancePage — Phase 6 CRUD for Fuel & General Expenses.
 * Features a tabbed view, separate data tables, and auto-calculation for fuel costs.
 */
import React, { useState } from 'react';
import DataTable from '../components/ui/DataTable';
import Button from '../components/ui/Button';
import ModalDialog from '../components/ui/ModalDialog';
import Input from '../components/ui/Input';
import SelectDropdown from '../components/ui/SelectDropdown';
import Badge from '../components/ui/Badge';

// Mock DB states
const MOCK_VEHICLES = [
  { id: 'v1', regNo: 'VAN-05', name: 'Ford Transit', status: 'Available' },
  { id: 'v2', regNo: 'TRK-12', name: 'Volvo FH16', status: 'On Trip' },
  { id: 'v3', regNo: 'VAN-08', name: 'Mercedes Sprinter', status: 'In Shop' },
  { id: 'v4', regNo: 'TRK-09', name: 'Scania R500', status: 'Available' },
];

const INITIAL_FUEL = [
  { id: 'f1', vehicleId: 'v1', date: '2026-07-11', liters: 45, costPerLiter: 1.50, total: 67.50 },
  { id: 'f2', vehicleId: 'v2', date: '2026-07-12', liters: 120, costPerLiter: 1.45, total: 174.00 },
];

const INITIAL_EXPENSES = [
  { id: 'e1', date: '2026-07-10', category: 'Tolls', amount: 25.00, description: 'Highway A4 Toll' },
  { id: 'e2', date: '2026-07-11', category: 'Maintenance', amount: 150.00, description: 'Routine Inspection (VAN-05)' },
];

const EXPENSE_CATEGORIES = [
  { value: 'Tolls', label: 'Tolls' },
  { value: 'Meals', label: 'Meals' },
  { value: 'Lodging', label: 'Lodging' },
  { value: 'Maintenance', label: 'Maintenance' },
  { value: 'Other', label: 'Other' },
];

const FinancePage = () => {
  const [activeTab, setActiveTab] = useState('fuel'); // 'fuel' | 'expenses'
  
  const [fuelLogs, setFuelLogs] = useState(INITIAL_FUEL);
  const [expenses, setExpenses] = useState(INITIAL_EXPENSES);
  
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Fuel form state
  const [fuelForm, setFuelForm] = useState({ vehicleId: '', date: '', liters: '', costPerLiter: '' });
  // Expense form state
  const [expenseForm, setExpenseForm] = useState({ date: '', category: 'Tolls', amount: '', description: '' });
  
  const [errors, setErrors] = useState({});

  // Get vehicle name for fuel table
  const getVehicleName = (id) => MOCK_VEHICLES.find(v => v.id === id)?.regNo || 'Unknown';

  /* ── Columns ───────────────────────────────────────────────── */
  const fuelColumns = [
    { key: 'vehicle', header: 'Vehicle', render: (_, row) => <span style={{ fontWeight: 600, color: 'var(--d-text)' }}>🚛 {getVehicleName(row.vehicleId)}</span> },
    { key: 'date', header: 'Date', render: (val) => <span style={{ color: 'var(--d-muted)' }}>{new Date(val).toLocaleDateString()}</span> },
    { key: 'liters', header: 'Volume (L)', render: (val) => <span style={{ fontWeight: 600 }}>{val} L</span> },
    { key: 'costPerLiter', header: 'Cost / L', render: (val) => `$${val.toFixed(2)}` },
    { key: 'total', header: 'Total Cost', render: (val) => <span style={{ fontWeight: 700, color: 'var(--d-primary)' }}>${val.toFixed(2)}</span> },
    { key: 'actions', header: '', align: 'right', render: (_, row) => (
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <Button size="sm" variant="secondary" onClick={() => handleEditFuel(row)}>Edit</Button>
        <Button size="sm" variant="ghost" style={{ color: 'var(--d-danger)' }} onClick={() => handleDelete(row.id, 'fuel')}>Delete</Button>
      </div>
    )}
  ];

  const expenseColumns = [
    { key: 'date', header: 'Date', render: (val) => <span style={{ color: 'var(--d-muted)' }}>{new Date(val).toLocaleDateString()}</span> },
    { key: 'category', header: 'Category', render: (val) => <Badge variant="neutral">{val}</Badge> },
    { key: 'description', header: 'Description' },
    { key: 'amount', header: 'Amount', render: (val) => <span style={{ fontWeight: 700, color: 'var(--d-danger)' }}>-${val.toFixed(2)}</span> },
    { key: 'actions', header: '', align: 'right', render: (_, row) => (
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <Button size="sm" variant="secondary" onClick={() => handleEditExpense(row)}>Edit</Button>
        <Button size="sm" variant="ghost" style={{ color: 'var(--d-danger)' }} onClick={() => handleDelete(row.id, 'expense')}>Delete</Button>
      </div>
    )}
  ];

  /* ── Form Handlers ─────────────────────────────────────────── */
  const validateFuel = () => {
    const errs = {};
    if (!fuelForm.vehicleId) errs.vehicleId = 'Please select a vehicle.';
    if (!fuelForm.date) errs.date = 'Date is required.';
    if (!fuelForm.liters || Number(fuelForm.liters) <= 0) errs.liters = 'Valid volume is required.';
    if (!fuelForm.costPerLiter || Number(fuelForm.costPerLiter) <= 0) errs.costPerLiter = 'Valid cost is required.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateExpense = () => {
    const errs = {};
    if (!expenseForm.date) errs.date = 'Date is required.';
    if (!expenseForm.amount || Number(expenseForm.amount) <= 0) errs.amount = 'Valid amount is required.';
    if (!expenseForm.description.trim()) errs.description = 'Description is required.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleOpenModal = () => {
    const today = new Date().toISOString().split('T')[0];
    if (activeTab === 'fuel') {
      setFuelForm({ vehicleId: '', date: today, liters: '', costPerLiter: '' });
    } else {
      setExpenseForm({ date: today, category: 'Tolls', amount: '', description: '' });
    }
    setErrors({});
    setEditingId(null);
    setModalOpen(true);
  };

  const handleEditFuel = (log) => {
    setFuelForm({
      vehicleId: log.vehicleId,
      date: log.date,
      liters: log.liters.toString(),
      costPerLiter: log.costPerLiter.toString()
    });
    setErrors({});
    setEditingId(log.id);
    setModalOpen(true);
  };

  const handleEditExpense = (exp) => {
    setExpenseForm({
      date: exp.date,
      category: exp.category,
      amount: exp.amount.toString(),
      description: exp.description
    });
    setErrors({});
    setEditingId(exp.id);
    setModalOpen(true);
  };

  const handleDelete = (id, type) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      if (type === 'fuel') setFuelLogs(prev => prev.filter(l => l.id !== id));
      else setExpenses(prev => prev.filter(e => e.id !== id));
    }
  };

  const handleSubmit = () => {
    if (activeTab === 'fuel') {
      if (!validateFuel()) return;
      const liters = Number(fuelForm.liters);
      const costPerLiter = Number(fuelForm.costPerLiter);
      const total = liters * costPerLiter;
      
      if (editingId) {
        setFuelLogs(prev => prev.map(l => l.id === editingId ? {
          ...l, vehicleId: fuelForm.vehicleId, date: fuelForm.date, liters, costPerLiter, total
        } : l));
      } else {
        setFuelLogs(prev => [{
          id: `f${Date.now()}`, vehicleId: fuelForm.vehicleId, date: fuelForm.date, liters, costPerLiter, total
        }, ...prev]);
      }
    } else {
      if (!validateExpense()) return;
      
      if (editingId) {
        setExpenses(prev => prev.map(e => e.id === editingId ? {
          ...e, date: expenseForm.date, category: expenseForm.category, amount: Number(expenseForm.amount), description: expenseForm.description
        } : e));
      } else {
        setExpenses(prev => [{
          id: `e${Date.now()}`, date: expenseForm.date, category: expenseForm.category, amount: Number(expenseForm.amount), description: expenseForm.description
        }, ...prev]);
      }
    }
    setModalOpen(false);
  };

  // Derived calculations for UI
  const currentFuelTotal = Number(fuelForm.liters || 0) * Number(fuelForm.costPerLiter || 0);
  const vehicleOptions = MOCK_VEHICLES.map(v => ({ value: v.id, label: v.regNo }));

  return (
    <div>
      <div className="d-page-header">
        <div>
          <div className="d-page-header-title">Financial Operations</div>
          <div className="d-page-header-sub">Track fuel consumption, tolls, and other operational expenses</div>
        </div>
        <Button leftIcon="➕" onClick={handleOpenModal}>
          {activeTab === 'fuel' ? 'Log Fuel' : 'Log Expense'}
        </Button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, borderBottom: '2px solid var(--d-border)', paddingBottom: 16 }}>
        <button
          onClick={() => setActiveTab('fuel')}
          style={{
            padding: '8px 16px', borderRadius: '12px', fontWeight: 700,
            background: activeTab === 'fuel' ? 'var(--d-primary)' : 'transparent',
            color: activeTab === 'fuel' ? '#fff' : 'var(--d-muted)',
            border: 'none', cursor: 'pointer', transition: 'all 0.2s',
          }}
        >
          ⛽ Fuel Logs
        </button>
        <button
          onClick={() => setActiveTab('expenses')}
          style={{
            padding: '8px 16px', borderRadius: '12px', fontWeight: 700,
            background: activeTab === 'expenses' ? 'var(--d-primary)' : 'transparent',
            color: activeTab === 'expenses' ? '#fff' : 'var(--d-muted)',
            border: 'none', cursor: 'pointer', transition: 'all 0.2s',
          }}
        >
          🧾 General Expenses
        </button>
      </div>

      {/* Tables */}
      {activeTab === 'fuel' ? (
        <DataTable 
          title="Fuel Consumption History"
          columns={fuelColumns}
          data={fuelLogs}
          searchable={true}
          searchKeys={['vehicleId', 'date']}
          emptyTitle="No fuel logs found"
          emptyDesc="Start tracking vehicle fuel consumption."
        />
      ) : (
        <DataTable 
          title="Operational Expenses"
          columns={expenseColumns}
          data={expenses}
          searchable={true}
          searchKeys={['category', 'description', 'date']}
          emptyTitle="No expenses found"
          emptyDesc="Log tolls, meals, or other operational costs."
        />
      )}

      {/* Modal */}
      <ModalDialog
        open={isModalOpen}
        onClose={() => setModalOpen(false)}
        title={activeTab === 'fuel' 
          ? (editingId ? 'Edit Fuel Log' : 'Log Fuel Entry') 
          : (editingId ? 'Edit Expense' : 'Log Expense')}
        footer={
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit}>{editingId ? 'Save Changes' : 'Save Record'}</Button>
          </>
        }
      >
        {activeTab === 'fuel' ? (
          <div className="d-form-grid">
            <SelectDropdown
              label="Vehicle"
              options={vehicleOptions}
              value={fuelForm.vehicleId}
              onChange={(e) => {
                setFuelForm(f => ({ ...f, vehicleId: e.target.value }));
                if (errors.vehicleId) setErrors(e => ({ ...e, vehicleId: '' }));
              }}
              error={errors.vehicleId}
              required
              className="d-form-grid-full"
            />
            <Input 
              label="Date" 
              type="date"
              value={fuelForm.date} 
              onChange={(e) => {
                setFuelForm(f => ({ ...f, date: e.target.value }));
                if (errors.date) setErrors(e => ({ ...e, date: '' }));
              }}
              error={errors.date}
              required
              className="d-form-grid-full"
            />
            <Input 
              label="Volume (Liters)" 
              type="number"
              min="0"
              step="0.1"
              placeholder="0.0" 
              value={fuelForm.liters} 
              onChange={(e) => {
                setFuelForm(f => ({ ...f, liters: e.target.value }));
                if (errors.liters) setErrors(e => ({ ...e, liters: '' }));
              }}
              error={errors.liters}
              required
            />
            <Input 
              label="Cost per Liter ($)" 
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00" 
              value={fuelForm.costPerLiter} 
              onChange={(e) => {
                setFuelForm(f => ({ ...f, costPerLiter: e.target.value }));
                if (errors.costPerLiter) setErrors(e => ({ ...e, costPerLiter: '' }));
              }}
              error={errors.costPerLiter}
              required
            />
            <div className="d-form-grid-full" style={{ padding: '16px', background: 'var(--d-surface-2)', borderRadius: '12px', border: '1px solid var(--d-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 600, color: 'var(--d-muted)' }}>Auto-calculated Total:</span>
              <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--d-primary)' }}>
                ${currentFuelTotal.toFixed(2)}
              </span>
            </div>
          </div>
        ) : (
          <div className="d-form-grid">
            <Input 
              label="Date" 
              type="date"
              value={expenseForm.date} 
              onChange={(e) => {
                setExpenseForm(f => ({ ...f, date: e.target.value }));
                if (errors.date) setErrors(e => ({ ...e, date: '' }));
              }}
              error={errors.date}
              required
            />
            <SelectDropdown
              label="Category"
              options={EXPENSE_CATEGORIES}
              value={expenseForm.category}
              onChange={(e) => setExpenseForm(f => ({ ...f, category: e.target.value }))}
              required
            />
            <Input 
              label="Amount ($)" 
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00" 
              value={expenseForm.amount} 
              onChange={(e) => {
                setExpenseForm(f => ({ ...f, amount: e.target.value }));
                if (errors.amount) setErrors(e => ({ ...e, amount: '' }));
              }}
              error={errors.amount}
              required
              className="d-form-grid-full"
            />
            <div className="d-form-grid-full" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label className="d-label d-label-required">Description</label>
              <Input
                placeholder="What was this expense for?"
                value={expenseForm.description}
                onChange={(e) => {
                  setExpenseForm(f => ({ ...f, description: e.target.value }));
                  if (errors.description) setErrors(e => ({ ...e, description: '' }));
                }}
                error={errors.description}
              />
            </div>
          </div>
        )}
      </ModalDialog>
    </div>
  );
};

export default FinancePage;
