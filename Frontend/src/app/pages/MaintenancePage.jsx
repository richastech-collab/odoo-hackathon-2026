import React, { useState, useEffect } from 'react';
import { apiClient } from '../../api/client';
import DataTable from '../components/ui/DataTable';
import Button from '../components/ui/Button';
import ModalDialog from '../components/ui/ModalDialog';
import Input from '../components/ui/Input';
import SelectDropdown from '../components/ui/SelectDropdown';
import Badge from '../components/ui/Badge';

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
  const [logs, setLogs] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [form, setForm] = useState({
    vehicleId: '', serviceType: 'Routine Inspection', date: '', cost: '', description: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [logsData, vehiclesData] = await Promise.all([
        apiClient.get('/maintenance'),
        apiClient.get('/vehicles'),
      ]);
      setLogs(logsData || []);
      setVehicles(vehiclesData || []);
    } catch (e) {
      console.error('Error fetching maintenance data:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const getVehicleName = (id) => {
    const v = vehicles.find((v) => v.id === id);
    return v ? `${v.regNo} (${v.name})` : 'Unknown';
  };

  const handleStatusChange = async (logId, newStatus) => {
    // Only support complete for now, wait, the API has a complete endpoint?
    // Looking at backend router, we don't have a specific complete endpoint, wait.
    // Wait, earlier I wrote `routers/maintenance.py` but I didn't add a /complete endpoint.
    // I added a general `PUT /{log_id}` to update the whole thing.
    // So I can just send PUT with the updated status.
    try {
      const logToUpdate = logs.find(l => l.id === logId);
      if (newStatus === 'Completed' && logToUpdate) {
        await apiClient.put(`/maintenance/${logId}`, {
          ...logToUpdate,
          status: 'Completed'
        });
        
        // We also need to update the vehicle status back to 'Available' 
        // We can do this in the backend, but backend PUT /maintenance/:id does not do it right now!
        // So I'll also do a PUT to vehicle to change status back.
        const vehicle = vehicles.find(v => v.id === logToUpdate.vehicleId);
        if (vehicle) {
           await apiClient.put(`/vehicles/${vehicle.id}`, {
             ...vehicle,
             status: 'Available'
           });
        }
        
      }
      fetchData();
    } catch (e) {
      alert(e.message);
    }
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
      cost: log.cost?.toString() || '',
      description: log.description || ''
    });
    setErrors({});
    setEditingId(log.id);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this maintenance record?')) {
      try {
        const log = logs.find(l => l.id === id);
        await apiClient.delete(`/maintenance/${id}`);
        
        if (log && log.status === 'Pending') {
           const vehicle = vehicles.find(v => v.id === log.vehicleId);
           if (vehicle) {
              await apiClient.put(`/vehicles/${vehicle.id}`, { ...vehicle, status: 'Available' });
           }
        }
        fetchData();
      } catch (e) {
        alert(e.message);
      }
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const payload = {
        vehicleId: form.vehicleId,
        serviceType: form.serviceType,
        date: form.date,
        cost: Number(form.cost),
        description: form.description
      };

      if (editingId) {
        await apiClient.put(`/maintenance/${editingId}`, payload);
      } else {
        await apiClient.post('/maintenance', payload);
      }
      setModalOpen(false);
      fetchData();
    } catch (e) {
      setErrors({ date: e.message });
    }
  };

  const vehicleOptions = vehicles.map(v => {
    const isEditingThis = editingId && logs.find(l => l.id === editingId)?.vehicleId === v.id;
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

      {isLoading ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading maintenance logs...</div>
      ) : (
        <DataTable 
          title="Service History & Active Work"
          columns={columns}
          data={logs}
          searchable={true}
          searchKeys={['serviceType', 'status', 'description']}
          emptyTitle="No maintenance logs found"
          emptyDesc="Log a service to start tracking vehicle health."
        />
      )}

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
