import React, { useState, useEffect } from 'react';
import { apiClient } from '../../api/client';
import DataTable from '../components/ui/DataTable';
import Button from '../components/ui/Button';
import ModalDialog from '../components/ui/ModalDialog';
import Input from '../components/ui/Input';
import SelectDropdown from '../components/ui/SelectDropdown';
import Badge from '../components/ui/Badge';

const EXPENSE_CATEGORIES = [
  { value: 'Tolls', label: 'Tolls' },
  { value: 'Meals', label: 'Meals' },
  { value: 'Lodging', label: 'Lodging' },
  { value: 'Maintenance', label: 'Maintenance' },
  { value: 'Other', label: 'Other' },
];

const FinancePage = () => {
  const [activeTab, setActiveTab] = useState('fuel'); // 'fuel' | 'expenses'
  
  const [fuelLogs, setFuelLogs] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [fuelForm, setFuelForm] = useState({ vehicleId: '', date: '', liters: '', costPerLiter: '' });
  const [expenseForm, setExpenseForm] = useState({ date: '', category: 'Tolls', amount: '', description: '' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [expensesData, vehiclesData] = await Promise.all([
        apiClient.get('/expenses'),
        apiClient.get('/vehicles'),
      ]);
      
      const allExpenses = expensesData || [];
      setFuelLogs(allExpenses.filter(e => e.type === 'Fuel'));
      setExpenses(allExpenses.filter(e => e.type !== 'Fuel'));
      setVehicles(vehiclesData || []);
    } catch (e) {
      console.error('Error fetching finance data:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const getVehicleName = (id) => vehicles.find(v => v.id === id)?.regNo || 'Unknown';

  const fuelColumns = [
    { key: 'vehicle', header: 'Vehicle', render: (_, row) => <span style={{ fontWeight: 600, color: 'var(--d-text)' }}>🚛 {getVehicleName(row.vehicleId)}</span> },
    { key: 'date', header: 'Date', render: (val) => <span style={{ color: 'var(--d-muted)' }}>{new Date(val).toLocaleDateString()}</span> },
    { key: 'liters', header: 'Volume (L)', render: (val) => <span style={{ fontWeight: 600 }}>{val} L</span> },
    { key: 'costPerLiter', header: 'Cost / L', render: (val) => `$${val.toFixed(2)}` },
    { key: 'amount', header: 'Total Cost', render: (val) => <span style={{ fontWeight: 700, color: 'var(--d-primary)' }}>${val.toFixed(2)}</span> },
    { key: 'actions', header: '', align: 'right', render: (_, row) => (
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <Button size="sm" variant="secondary" onClick={() => handleEditFuel(row)}>Edit</Button>
        <Button size="sm" variant="ghost" style={{ color: 'var(--d-danger)' }} onClick={() => handleDelete(row.id)}>Delete</Button>
      </div>
    )}
  ];

  const expenseColumns = [
    { key: 'date', header: 'Date', render: (val) => <span style={{ color: 'var(--d-muted)' }}>{new Date(val).toLocaleDateString()}</span> },
    { key: 'type', header: 'Category', render: (val) => <Badge variant="neutral">{val}</Badge> },
    { key: 'desc', header: 'Description' },
    { key: 'amount', header: 'Amount', render: (val) => <span style={{ fontWeight: 700, color: 'var(--d-danger)' }}>-${val.toFixed(2)}</span> },
    { key: 'actions', header: '', align: 'right', render: (_, row) => (
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <Button size="sm" variant="secondary" onClick={() => handleEditExpense(row)}>Edit</Button>
        <Button size="sm" variant="ghost" style={{ color: 'var(--d-danger)' }} onClick={() => handleDelete(row.id)}>Delete</Button>
      </div>
    )}
  ];

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
      category: exp.type,
      amount: exp.amount.toString(),
      description: exp.desc || ''
    });
    setErrors({});
    setEditingId(exp.id);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        await apiClient.delete(`/expenses/${id}`);
        fetchData();
      } catch (e) {
        alert(e.message);
      }
    }
  };

  const handleSubmit = async () => {
    try {
      if (activeTab === 'fuel') {
        if (!validateFuel()) return;
        const liters = Number(fuelForm.liters);
        const costPerLiter = Number(fuelForm.costPerLiter);
        const amount = liters * costPerLiter;
        
        const payload = {
          vehicleId: fuelForm.vehicleId,
          date: fuelForm.date,
          type: 'Fuel',
          amount,
          liters,
          costPerLiter
        };

        if (editingId) {
          await apiClient.put(`/expenses/${editingId}`, payload);
        } else {
          await apiClient.post('/expenses', payload);
        }
      } else {
        if (!validateExpense()) return;
        
        const payload = {
          vehicleId: vehicles[0]?.id || 'unknown', // general expenses aren't strictly tied to a vehicle in the form, just pass first or placeholder
          date: expenseForm.date,
          type: expenseForm.category,
          amount: Number(expenseForm.amount),
          desc: expenseForm.description
        };

        if (editingId) {
          await apiClient.put(`/expenses/${editingId}`, payload);
        } else {
          await apiClient.post('/expenses', payload);
        }
      }
      setModalOpen(false);
      fetchData();
    } catch (e) {
      alert(e.message);
    }
  };

  const currentFuelTotal = Number(fuelForm.liters || 0) * Number(fuelForm.costPerLiter || 0);
  const vehicleOptions = vehicles.map(v => ({ value: v.id, label: v.regNo }));

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

      {isLoading ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading records...</div>
      ) : activeTab === 'fuel' ? (
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
          searchKeys={['type', 'desc', 'date']}
          emptyTitle="No expenses found"
          emptyDesc="Log tolls, meals, or other operational costs."
        />
      )}

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
