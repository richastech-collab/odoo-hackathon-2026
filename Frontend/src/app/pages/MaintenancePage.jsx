/**
 * MaintenancePage — Phase 5 CRUD for Vehicle Maintenance.
 * Includes tracking service logs and simulating vehicle status changes (In Shop / Available).
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

const INITIAL_LOGS = [
  { id: 'm1', vehicleId: 'v3', serviceType: 'Engine Repair', date: '2026-07-10', cost: 1250, description: 'Replaced spark plugs and oil filter.', status: 'Pending' },
  { id: 'm2', vehicleId: 'v1', serviceType: 'Routine Inspection', date: '2026-06-15', cost: 150, description: 'Tire rotation and brake check.', status: 'Completed' },
];

const SERVICE_TYPES = [
  { value: 'Routine Inspection', label: 'Routine Inspection' },
  { value: 'Engine Repair', label: 'Engine Repair' },
  { value: 'Tire Replacement', label: 'Tire Replacement' },
  { value: 'Body Work', label: 'Body Work' },
  { value: 'Other', label: 'Other' },
];

const STATUS_COLORS = {
  'Pending': 'warning',
  'Completed': 'success',
};

const MaintenancePage = () => {
  const [logs, setLogs] = useState(INITIAL_LOGS);
  const [vehicles, setVehicles] = useState(MOCK_VEHICLES);
  
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Form state
  const [form, setForm] = useState({
    vehicleId: '', serviceType: 'Routine Inspection', date: '', cost: '', description: ''
  });
  const [errors, setErrors] = useState({});

  // Helper to get names for the table
  const getVehicleName = (id) => {
    const v = vehicles.find((v) => v.id === id);
    return v ? `${v.regNo} (${v.name})` : 'Unknown';
  };

  const handleStatusChange = (logId, newStatus) => {
    const log = logs.find(l => l.id === logId);
    if (!log) return;

    if (newStatus === 'Completed') {
      // Simulate releasing the vehicle from the shop
      setVehicles(prev => prev.map(v => v.id === log.vehicleId ? { ...v, status: 'Available' } : v));
    }
    
    setLogs(prev => prev.map(l => l.id === logId ? { ...l, status: newStatus } : l));
  };

  const columns = [
    { key: 'vehicle', header: 'Vehicle', render: (_, row) => (
      <div style={{ fontWeight: 600, color: 'var(--d-text)' }}>
        🚛 {getVehicleName(row.vehicleId)}
      </div>
    )},
    { key: 'serviceType', header: 'Service Type' },
    { key: 'date', header: 'Date', render: (val) => (
      <span style={{ color: 'var(--d-muted)' }}>{new Date(val).toLocaleDateString()}</span>
    )},
    { key: 'cost', header: 'Cost ($)', render: (val) => (
      <span style={{ fontWeight: 600 }}>${val?.toLocaleString()}</span>
    )},
    { key: 'status', header: 'Status', render: (val) => <Badge variant={STATUS_COLORS[val]}>{val}</Badge> },
    { key: 'actions', header: '', align: 'right', render: (_, row) => (
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
        {row.status === 'Pending' && (
          <>
            <Button size="sm" onClick={() => handleStatusChange(row.id, 'Completed')}>Mark Completed</Button>
            <Button size="sm" variant="secondary" onClick={() => handleEdit(row)}>Edit</Button>
            <Button size="sm" variant="ghost" style={{ color: 'var(--d-danger)' }} onClick={() => handleDelete(row.id)}>Delete</Button>
          </>
        )}
      </div>
    )}
  ];

  const validateForm = () => {
    const errs = {};
    if (!form.vehicleId) errs.vehicleId = 'Please select a vehicle.';
    if (!form.date) errs.date = 'Date is required.';
    if (!form.cost || Number(form.cost) < 0) {
      errs.cost = 'Valid cost is required.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (field) => (e) => {
    setForm(f => ({ ...f, [field]: e.target.value }));
    if (errors[field]) setErrors(e => ({ ...e, [field]: '' }));
  };

  const handleOpenModal = () => {
    // Default to today's date
    const today = new Date().toISOString().split('T')[0];
    setForm({ vehicleId: '', serviceType: 'Routine Inspection', date: today, cost: '', description: '' });
    setErrors({});
    setEditingId(null);
    setModalOpen(true);
  };

  const handleEdit = (log) => {
    setForm({
      vehicleId: log.vehicleId,
      serviceType: log.serviceType,
      date: log.date,
      cost: log.cost.toString(),
      description: log.description || ''
    });
    setErrors({});
    setEditingId(log.id);
    setModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this maintenance record?')) {
      const log = logs.find(l => l.id === id);
      if (log && log.status === 'Pending') {
         // Optionally, release the vehicle if a pending maintenance is deleted
         setVehicles(prev => prev.map(v => v.id === log.vehicleId ? { ...v, status: 'Available' } : v));
      }
      setLogs(prev => prev.filter(l => l.id !== id));
    }
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    if (editingId) {
      setLogs(prev => prev.map(l => l.id === editingId ? {
        ...l,
        vehicleId: form.vehicleId,
        serviceType: form.serviceType,
        date: form.date,
        cost: Number(form.cost),
        description: form.description
      } : l));
    } else {
      setLogs(prev => [{
        id: `m${Date.now()}`,
        vehicleId: form.vehicleId,
        serviceType: form.serviceType,
        date: form.date,
        cost: Number(form.cost),
        description: form.description,
        status: 'Pending'
      }, ...prev]);

      // If a new maintenance is logged, put the vehicle "In Shop"
      setVehicles(prev => prev.map(v => v.id === form.vehicleId ? { ...v, status: 'In Shop' } : v));
    }
    setModalOpen(false);
  };

  // Dropdown options
  const vehicleOptions = vehicles.map(v => {
    const isEditingThis = editingId && logs.find(l => l.id === editingId)?.vehicleId === v.id;
    // For maintenance, you can theoretically log it for any vehicle that isn't on a trip right now
    const canService = v.status !== 'On Trip' || isEditingThis;
    return {
      value: v.id,
      label: `${v.regNo} (${v.status})`,
      disabled: !canService
    };
  });

  return (
    <div>
      <div className="d-page-header">
        <div>
          <div className="d-page-header-title">Maintenance Logs</div>
          <div className="d-page-header-sub">Track repairs, routine service, and vehicle health</div>
        </div>
        <Button leftIcon="➕" onClick={handleOpenModal}>Log Maintenance</Button>
      </div>

      <DataTable 
        title="Service History & Active Work"
        columns={columns}
        data={logs}
        searchable={true}
        searchKeys={['serviceType', 'status', 'description']}
        emptyTitle="No maintenance logs found"
        emptyDesc="Log a service to start tracking vehicle health."
      />

      <ModalDialog
        open={isModalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Edit Maintenance Record' : 'Log Maintenance'}
        footer={
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit}>{editingId ? 'Save Changes' : 'Log Service'}</Button>
          </>
        }
      >
        <div className="d-form-grid">
          <SelectDropdown
            label="Vehicle"
            options={vehicleOptions}
            value={form.vehicleId}
            onChange={handleChange('vehicleId')}
            error={errors.vehicleId}
            required
            className="d-form-grid-full"
          />
          <SelectDropdown
            label="Service Type"
            options={SERVICE_TYPES}
            value={form.serviceType}
            onChange={handleChange('serviceType')}
            required
          />
          <Input 
            label="Service Date" 
            type="date"
            value={form.date} 
            onChange={handleChange('date')}
            error={errors.date}
            required
          />
          <Input 
            label="Cost ($)" 
            type="number"
            min="0"
            placeholder="0" 
            value={form.cost} 
            onChange={handleChange('cost')}
            error={errors.cost}
            required
            className="d-form-grid-full"
          />
          <div className="d-form-grid-full" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label className="d-label">Description / Notes</label>
            <textarea
              className="d-input"
              rows="3"
              placeholder="Provide details about the service performed..."
              value={form.description}
              onChange={handleChange('description')}
              style={{ resize: 'vertical' }}
            />
          </div>
        </div>
      </ModalDialog>
    </div>
  );
};

export default MaintenancePage;
