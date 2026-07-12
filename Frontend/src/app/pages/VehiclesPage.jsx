/**
 * VehiclesPage — Phase 3 CRUD for Vehicles.
 */
import React, { useState } from 'react';
import DataTable from '../components/ui/DataTable';
import Button from '../components/ui/Button';
import ModalDialog from '../components/ui/ModalDialog';
import Input from '../components/ui/Input';
import SelectDropdown from '../components/ui/SelectDropdown';
import Badge from '../components/ui/Badge';

// Initial mock data
const INITIAL_VEHICLES = [
  { id: 'v1', regNo: 'VAN-05', name: 'Ford Transit', type: 'Van', capacity: 500, odometer: 12000, cost: 35000, status: 'Available' },
  { id: 'v2', regNo: 'TRK-12', name: 'Volvo FH16', type: 'Truck', capacity: 15000, odometer: 85000, cost: 120000, status: 'On Trip' },
  { id: 'v3', regNo: 'VAN-08', name: 'Mercedes Sprinter', type: 'Van', capacity: 800, odometer: 45000, cost: 42000, status: 'In Shop' },
];

const VEHICLE_TYPES = [
  { value: 'Van', label: 'Van' },
  { value: 'Truck', label: 'Truck' },
  { value: 'Trailer', label: 'Trailer' },
  { value: 'Car', label: 'Car' },
];

const STATUS_COLORS = {
  'Available': 'success',
  'On Trip': 'info',
  'In Shop': 'warning',
  'Retired': 'neutral',
};

const VehiclesPage = () => {
  const [vehicles, setVehicles] = useState(INITIAL_VEHICLES);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Form state
  const [form, setForm] = useState({
    regNo: '', name: '', type: 'Van', capacity: '', odometer: '', cost: ''
  });
  const [errors, setErrors] = useState({});

  const columns = [
    { key: 'regNo', header: 'Reg. No', render: (val) => <span style={{fontWeight: 700}}>{val}</span> },
    { key: 'name', header: 'Name / Model' },
    { key: 'type', header: 'Type' },
    { key: 'capacity', header: 'Capacity (kg)', render: (val) => val.toLocaleString() },
    { key: 'odometer', header: 'Odometer (km)', render: (val) => val.toLocaleString() },
    { key: 'status', header: 'Status', render: (val) => <Badge variant={STATUS_COLORS[val]}>{val}</Badge> },
    { key: 'actions', header: '', align: 'right', render: (_, row) => (
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <Button size="sm" variant="secondary" onClick={() => handleEdit(row)}>Edit</Button>
        <Button size="sm" variant="ghost" onClick={() => handleDelete(row.id)} style={{ color: 'var(--d-danger)' }}>Delete</Button>
      </div>
    )}
  ];

  const validateForm = () => {
    const errs = {};
    if (!form.regNo.trim()) errs.regNo = 'Registration number is required.';
    // Check uniqueness
    if (form.regNo && vehicles.some(v => v.regNo.toLowerCase() === form.regNo.toLowerCase() && v.id !== editingId)) {
      errs.regNo = 'This registration number already exists.';
    }
    if (!form.name.trim()) errs.name = 'Name/Model is required.';
    if (!form.capacity || Number(form.capacity) <= 0) errs.capacity = 'Valid capacity is required.';
    if (!form.odometer || Number(form.odometer) < 0) errs.odometer = 'Valid odometer is required.';
    
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (field) => (e) => {
    setForm(f => ({ ...f, [field]: e.target.value }));
    if (errors[field]) setErrors(e => ({ ...e, [field]: '' }));
  };

  const handleOpenModal = () => {
    setForm({ regNo: '', name: '', type: 'Van', capacity: '', odometer: '', cost: '' });
    setErrors({});
    setEditingId(null);
    setModalOpen(true);
  };

  const handleEdit = (vehicle) => {
    setForm({
      regNo: vehicle.regNo,
      name: vehicle.name,
      type: vehicle.type,
      capacity: vehicle.capacity.toString(),
      odometer: vehicle.odometer.toString(),
      cost: vehicle.cost?.toString() || ''
    });
    setErrors({});
    setEditingId(vehicle.id);
    setModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      setVehicles(prev => prev.filter(v => v.id !== id));
    }
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    if (editingId) {
      setVehicles(prev => prev.map(v => v.id === editingId ? {
        ...v,
        regNo: form.regNo,
        name: form.name,
        type: form.type,
        capacity: Number(form.capacity),
        odometer: Number(form.odometer),
        cost: Number(form.cost) || 0
      } : v));
    } else {
      setVehicles(prev => [...prev, {
        id: `v${Date.now()}`,
        regNo: form.regNo,
        name: form.name,
        type: form.type,
        capacity: Number(form.capacity),
        odometer: Number(form.odometer),
        cost: Number(form.cost) || 0,
        status: 'Available'
      }]);
    }
    setModalOpen(false);
  };

  return (
    <div>
      <div className="d-page-header">
        <div>
          <div className="d-page-header-title">Vehicle Registry</div>
          <div className="d-page-header-sub">Manage your fleet — add, edit and monitor all vehicles</div>
        </div>
        <Button leftIcon="➕" onClick={handleOpenModal}>Add Vehicle</Button>
      </div>

      <DataTable 
        title="Fleet Overview"
        columns={columns}
        data={vehicles}
        searchable={true}
        searchKeys={['regNo', 'name', 'type', 'status']}
        emptyTitle="No vehicles found"
        emptyDesc="Start by adding a vehicle to your registry."
      />

      <ModalDialog
        open={isModalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Edit Vehicle' : 'Add Vehicle'}
        footer={
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit}>{editingId ? 'Save Changes' : 'Add Vehicle'}</Button>
          </>
        }
      >
        <div className="d-form-grid">
          <Input 
            label="Registration No" 
            placeholder="e.g. VAN-05" 
            value={form.regNo} 
            onChange={handleChange('regNo')}
            error={errors.regNo}
            required
          />
          <SelectDropdown
            label="Vehicle Type"
            options={VEHICLE_TYPES}
            value={form.type}
            onChange={handleChange('type')}
            required
          />
          <Input 
            label="Name / Model" 
            placeholder="e.g. Ford Transit" 
            value={form.name} 
            onChange={handleChange('name')}
            error={errors.name}
            required
            className="d-form-grid-full"
          />
          <Input 
            label="Load Capacity (kg)" 
            type="number"
            min="0"
            placeholder="500" 
            value={form.capacity} 
            onChange={handleChange('capacity')}
            error={errors.capacity}
            required
          />
          <Input 
            label="Initial Odometer (km)" 
            type="number"
            min="0"
            placeholder="0" 
            value={form.odometer} 
            onChange={handleChange('odometer')}
            error={errors.odometer}
            required
          />
          <Input 
            label="Acquisition Cost ($)" 
            type="number"
            min="0"
            placeholder="0" 
            value={form.cost} 
            onChange={handleChange('cost')}
          />
        </div>
      </ModalDialog>
    </div>
  );
};

export default VehiclesPage;
