/**
 * TripsPage — Phase 4 CRUD for Trips.
 * Includes business rule validation and mocked auto-status transitions.
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
  { id: 'v1', regNo: 'VAN-05', name: 'Ford Transit', capacity: 500, status: 'Available' },
  { id: 'v2', regNo: 'TRK-12', name: 'Volvo FH16', capacity: 15000, status: 'On Trip' },
  { id: 'v3', regNo: 'VAN-08', name: 'Mercedes Sprinter', capacity: 800, status: 'In Shop' },
  { id: 'v4', regNo: 'TRK-09', name: 'Scania R500', capacity: 20000, status: 'Available' },
];

const MOCK_DRIVERS = [
  { id: 'd1', name: 'Sam Rivera', status: 'Available' },
  { id: 'd2', name: 'Jordan Lee', status: 'On Trip' },
  { id: 'd3', name: 'Taylor Swift', status: 'Available' },
  { id: 'd4', name: 'Chris Evans', status: 'Suspended' },
];

const INITIAL_TRIPS = [
  { id: 't1', source: 'Warehouse A', dest: 'Store B', vehicleId: 'v1', driverId: 'd1', weight: 450, status: 'Draft' },
  { id: 't2', source: 'Port C', dest: 'Factory D', vehicleId: 'v2', driverId: 'd2', weight: 12000, status: 'Dispatched' },
];

const STATUS_COLORS = {
  'Draft': 'neutral',
  'Dispatched': 'info',
  'Completed': 'success',
  'Cancelled': 'danger',
};

const TripsPage = () => {
  const [trips, setTrips] = useState(INITIAL_TRIPS);
  const [vehicles, setVehicles] = useState(MOCK_VEHICLES);
  const [drivers, setDrivers] = useState(MOCK_DRIVERS);
  
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Form state
  const [form, setForm] = useState({
    source: '', dest: '', vehicleId: '', driverId: '', weight: ''
  });
  const [errors, setErrors] = useState({});

  // Helper to get names for the table
  const getVehicleName = (id) => {
    const v = vehicles.find((v) => v.id === id);
    return v ? `${v.regNo} (${v.name})` : 'Unknown';
  };
  const getDriverName = (id) => drivers.find((d) => d.id === id)?.name || 'Unknown';

  const handleStatusChange = (tripId, newStatus) => {
    const trip = trips.find(t => t.id === tripId);
    if (!trip) return;

    if (newStatus === 'Dispatched') {
      // Set vehicle/driver to 'On Trip'
      setVehicles(prev => prev.map(v => v.id === trip.vehicleId ? { ...v, status: 'On Trip' } : v));
      setDrivers(prev => prev.map(d => d.id === trip.driverId ? { ...d, status: 'On Trip' } : d));
    } else if (newStatus === 'Completed' || newStatus === 'Cancelled') {
      // Revert vehicle/driver to 'Available' ONLY if they were dispatched
      if (trip.status === 'Dispatched') {
        setVehicles(prev => prev.map(v => v.id === trip.vehicleId ? { ...v, status: 'Available' } : v));
        setDrivers(prev => prev.map(d => d.id === trip.driverId ? { ...d, status: 'Available' } : d));
      }
    }
    
    setTrips(prev => prev.map(t => t.id === tripId ? { ...t, status: newStatus } : t));
  };

  const columns = [
    { key: 'route', header: 'Route', render: (_, row) => (
      <div>
        <div style={{ fontWeight: 700, color: 'var(--d-text)' }}>{row.source}</div>
        <div style={{ fontSize: '0.75rem', color: 'var(--d-muted)', marginTop: 4 }}>↓ {row.dest}</div>
      </div>
    )},
    { key: 'assignment', header: 'Assignment', render: (_, row) => (
      <div>
        <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>🚛 {getVehicleName(row.vehicleId)}</div>
        <div style={{ fontSize: '0.8rem', color: 'var(--d-muted)', marginTop: 4 }}>👤 {getDriverName(row.driverId)}</div>
      </div>
    )},
    { key: 'weight', header: 'Cargo (kg)', render: (val) => val.toLocaleString() },
    { key: 'status', header: 'Status', render: (val) => <Badge variant={STATUS_COLORS[val]}>{val}</Badge> },
    { key: 'actions', header: '', align: 'right', render: (_, row) => (
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', flexWrap: 'wrap', maxWidth: 200 }}>
        {row.status === 'Draft' && (
          <>
            <Button size="sm" onClick={() => handleStatusChange(row.id, 'Dispatched')}>Dispatch</Button>
            <Button size="sm" variant="secondary" onClick={() => handleEdit(row)}>Edit</Button>
            <Button size="sm" variant="ghost" style={{ color: 'var(--d-danger)' }} onClick={() => handleDelete(row.id)}>Delete</Button>
          </>
        )}
        {row.status === 'Dispatched' && (
          <>
            <Button size="sm" variant="secondary" style={{ color: 'var(--d-success)', borderColor: 'var(--d-success)' }} onClick={() => handleStatusChange(row.id, 'Completed')}>Complete</Button>
            <Button size="sm" variant="ghost" style={{ color: 'var(--d-danger)' }} onClick={() => handleStatusChange(row.id, 'Cancelled')}>Cancel</Button>
          </>
        )}
      </div>
    )}
  ];

  const validateForm = () => {
    const errs = {};
    if (!form.source.trim()) errs.source = 'Source is required.';
    if (!form.dest.trim()) errs.dest = 'Destination is required.';
    if (!form.vehicleId) errs.vehicleId = 'Please assign a vehicle.';
    if (!form.driverId) errs.driverId = 'Please assign a driver.';
    if (!form.weight || Number(form.weight) <= 0) {
      errs.weight = 'Valid cargo weight is required.';
    } else if (form.vehicleId) {
      // Business Rule: Cargo capacity check
      const selectedVehicle = vehicles.find(v => v.id === form.vehicleId);
      if (selectedVehicle && Number(form.weight) > selectedVehicle.capacity) {
        errs.weight = `Weight exceeds vehicle capacity (${selectedVehicle.capacity.toLocaleString()}kg max).`;
      }
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (field) => (e) => {
    setForm(f => ({ ...f, [field]: e.target.value }));
    if (errors[field]) setErrors(e => ({ ...e, [field]: '' }));
    
    // Auto-revalidate weight if vehicle changes
    if (field === 'vehicleId' && form.weight) {
      const selectedVehicle = vehicles.find(v => v.id === e.target.value);
      if (selectedVehicle && Number(form.weight) > selectedVehicle.capacity) {
        setErrors(errs => ({ ...errs, weight: `Weight exceeds vehicle capacity (${selectedVehicle.capacity.toLocaleString()}kg max).` }));
      } else {
        setErrors(errs => ({ ...errs, weight: '' }));
      }
    }
  };

  const handleOpenModal = () => {
    setForm({ source: '', dest: '', vehicleId: '', driverId: '', weight: '' });
    setErrors({});
    setEditingId(null);
    setModalOpen(true);
  };

  const handleEdit = (trip) => {
    setForm({
      source: trip.source,
      dest: trip.dest,
      vehicleId: trip.vehicleId,
      driverId: trip.driverId,
      weight: trip.weight.toString()
    });
    setErrors({});
    setEditingId(trip.id);
    setModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this draft trip?')) {
      setTrips(prev => prev.filter(t => t.id !== id));
    }
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    if (editingId) {
      setTrips(prev => prev.map(t => t.id === editingId ? {
        ...t,
        source: form.source,
        dest: form.dest,
        vehicleId: form.vehicleId,
        driverId: form.driverId,
        weight: Number(form.weight)
      } : t));
    } else {
      setTrips(prev => [{
        id: `t${Date.now()}`,
        source: form.source,
        dest: form.dest,
        vehicleId: form.vehicleId,
        driverId: form.driverId,
        weight: Number(form.weight),
        status: 'Draft'
      }, ...prev]);
    }
    setModalOpen(false);
  };

  // Prepare dropdown options
  // Enable options if they are Available, or if they are currently assigned to the trip being edited
  const vehicleOptions = vehicles.map(v => {
    const isEditingThis = editingId && trips.find(t => t.id === editingId)?.vehicleId === v.id;
    const isAvailable = v.status === 'Available' || isEditingThis;
    return {
      value: v.id,
      label: `${v.regNo} — Cap: ${v.capacity}kg (${v.status})`,
      disabled: !isAvailable
    };
  });

  const driverOptions = drivers.map(d => {
    const isEditingThis = editingId && trips.find(t => t.id === editingId)?.driverId === d.id;
    const isAvailable = d.status === 'Available' || isEditingThis;
    return {
      value: d.id,
      label: `${d.name} (${d.status})`,
      disabled: !isAvailable
    };
  });

  return (
    <div>
      <div className="d-page-header">
        <div>
          <div className="d-page-header-title">Trip Management</div>
          <div className="d-page-header-sub">Dispatch trips and monitor their status in real time</div>
        </div>
        <Button leftIcon="➕" onClick={handleOpenModal}>Create Trip</Button>
      </div>

      <DataTable 
        title="Active & Past Trips"
        columns={columns}
        data={trips}
        searchable={true}
        searchKeys={['source', 'dest', 'status']}
        emptyTitle="No trips found"
        emptyDesc="Create a new draft trip to get started."
      />

      <ModalDialog
        open={isModalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Edit Draft Trip' : 'Create Trip'}
        footer={
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit}>{editingId ? 'Save Changes' : 'Save as Draft'}</Button>
          </>
        }
      >
        <div className="d-form-grid">
          <Input 
            label="Source Location" 
            placeholder="e.g. Warehouse A" 
            value={form.source} 
            onChange={handleChange('source')}
            error={errors.source}
            required
            className="d-form-grid-full"
          />
          <Input 
            label="Destination" 
            placeholder="e.g. Store B" 
            value={form.dest} 
            onChange={handleChange('dest')}
            error={errors.dest}
            required
            className="d-form-grid-full"
          />
          <SelectDropdown
            label="Assign Vehicle"
            options={vehicleOptions}
            value={form.vehicleId}
            onChange={handleChange('vehicleId')}
            error={errors.vehicleId}
            required
          />
          <SelectDropdown
            label="Assign Driver"
            options={driverOptions}
            value={form.driverId}
            onChange={handleChange('driverId')}
            error={errors.driverId}
            required
          />
          <Input 
            label="Cargo Weight (kg)" 
            type="number"
            min="0"
            placeholder="500" 
            value={form.weight} 
            onChange={handleChange('weight')}
            error={errors.weight}
            required
            className="d-form-grid-full"
          />
          
          {errors.weight && (
            <div className="d-form-grid-full">
              <div className="d-alert d-alert-error" style={{ marginBottom: 0 }}>
                ⚠️ {errors.weight}
              </div>
            </div>
          )}
        </div>
      </ModalDialog>
    </div>
  );
};

export default TripsPage;
