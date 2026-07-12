import React, { useState, useEffect } from 'react';
import { apiClient } from '../../api/client';
import DataTable from '../components/ui/DataTable';
import Button from '../components/ui/Button';
import ModalDialog from '../components/ui/ModalDialog';
import Input from '../components/ui/Input';
import SelectDropdown from '../components/ui/SelectDropdown';
import Badge from '../components/ui/Badge';

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
  'Maintenance': 'warning',
  'Active': 'success'
};

const VehiclesPage = () => {
  const [vehicles, setVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [form, setForm] = useState({
    regNo: '', name: '', type: 'Van', capacity: '', odometer: '', cost: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      setIsLoading(true);
      const data = await apiClient.get('/vehicles');
      setVehicles(data || []);
    } catch (e) {
      console.error('Error fetching vehicles:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const columns = [
    { key: 'regNo',     header: 'Reg. No',        sortable: true, render: (val) => <span style={{fontWeight: 700}}>{val}</span> },
    { key: 'name',      header: 'Name / Model',    sortable: true },
    { key: 'type',      header: 'Type',            sortable: true },
    { key: 'capacity',  header: 'Capacity (kg)',   sortable: true, render: (val) => Number(val).toLocaleString() },
    { key: 'odometer',  header: 'Odometer (km)',   sortable: true, render: (val) => Number(val).toLocaleString() },
    { key: 'status',    header: 'Status',          sortable: true, render: (val) => <Badge variant={STATUS_COLORS[val] || 'neutral'}>{val}</Badge> },

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
      capacity: vehicle.capacity?.toString() || '',
      odometer: vehicle.odometer?.toString() || '',
      cost: vehicle.cost?.toString() || ''
    });
    setErrors({});
    setEditingId(vehicle.id);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      try {
        await apiClient.delete(`/vehicles/${id}`);
        fetchVehicles();
      } catch (e) {
        alert(e.message);
      }
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    try {
      const payload = {
        regNo: form.regNo,
        name: form.name,
        type: form.type,
        capacity: Number(form.capacity),
        odometer: Number(form.odometer),
        cost: Number(form.cost) || 0
      };

      if (editingId) {
        await apiClient.put(`/vehicles/${editingId}`, payload);
      } else {
        await apiClient.post('/vehicles', payload);
      }
      setModalOpen(false);
      fetchVehicles();
    } catch (e) {
      setErrors({ regNo: e.message });
    }
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

      {isLoading ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading vehicles...</div>
      ) : (
        <DataTable 
          title="Fleet Overview"
          columns={columns}
          data={vehicles}
          searchable={true}
          searchKeys={['regNo', 'name', 'type', 'status']}
          emptyTitle="No vehicles found"
          emptyDesc="Start by adding a vehicle to your registry."
        />
      )}

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
