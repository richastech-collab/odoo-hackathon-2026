/**
 * DriversPage — Phase 3 CRUD for Drivers.
 */
import React, { useState } from 'react';
import DataTable from '../components/ui/DataTable';
import Button from '../components/ui/Button';
import ModalDialog from '../components/ui/ModalDialog';
import Input from '../components/ui/Input';
import SelectDropdown from '../components/ui/SelectDropdown';
import Badge from '../components/ui/Badge';

// Initial mock data
const INITIAL_DRIVERS = [
  { id: 'd1', name: 'Sam Rivera', licenseNo: 'DL-93821', category: 'Class A', expiryDate: '2028-11-15', safetyScore: 98, status: 'Available' },
  { id: 'd2', name: 'Jordan Lee', licenseNo: 'DL-44210', category: 'Class B', expiryDate: '2025-02-10', safetyScore: 85, status: 'On Trip' },
  { id: 'd3', name: 'Taylor Swift', licenseNo: 'DL-77321', category: 'Class A', expiryDate: '2026-08-22', safetyScore: 72, status: 'Off Duty' },
  { id: 'd4', name: 'Chris Evans', licenseNo: 'DL-11002', category: 'Class C', expiryDate: '2024-12-01', safetyScore: 45, status: 'Suspended' },
];

const LICENSE_CATEGORIES = [
  { value: 'Class A', label: 'Class A (Heavy)' },
  { value: 'Class B', label: 'Class B (Medium)' },
  { value: 'Class C', label: 'Class C (Light)' },
];

const STATUS_COLORS = {
  'Available': 'success',
  'On Trip': 'info',
  'Off Duty': 'neutral',
  'Suspended': 'danger',
};

const DriversPage = () => {
  const [drivers, setDrivers] = useState(INITIAL_DRIVERS);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Form state
  const [form, setForm] = useState({
    name: '', licenseNo: '', category: 'Class A', expiryDate: '', safetyScore: ''
  });
  const [errors, setErrors] = useState({});

  const columns = [
    { key: 'name', header: 'Name', render: (val) => <span style={{fontWeight: 700}}>{val}</span> },
    { key: 'licenseNo', header: 'License No.' },
    { key: 'category', header: 'Category' },
    { key: 'expiryDate', header: 'Expiry Date', render: (val) => {
      const isExpired = new Date(val) < new Date();
      return <span style={{ color: isExpired ? 'var(--d-danger)' : 'inherit', fontWeight: isExpired ? 600 : 400 }}>{val} {isExpired && '⚠️'}</span>
    }},
    { key: 'safetyScore', header: 'Safety Score', render: (val) => {
      let color = 'var(--d-success)';
      if (val < 80) color = 'var(--d-warning)';
      if (val < 50) color = 'var(--d-danger)';
      return <span style={{ color, fontWeight: 700 }}>{val}/100</span>
    }},
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
    if (!form.name.trim()) errs.name = 'Driver name is required.';
    
    if (!form.licenseNo.trim()) errs.licenseNo = 'License number is required.';
    if (form.licenseNo && drivers.some(d => d.licenseNo.toLowerCase() === form.licenseNo.toLowerCase() && d.id !== editingId)) {
      errs.licenseNo = 'This license number is already registered.';
    }
    
    if (!form.expiryDate) errs.expiryDate = 'Expiry date is required.';
    
    if (!form.safetyScore || Number(form.safetyScore) < 0 || Number(form.safetyScore) > 100) {
      errs.safetyScore = 'Safety score must be between 0 and 100.';
    }
    
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (field) => (e) => {
    setForm(f => ({ ...f, [field]: e.target.value }));
    if (errors[field]) setErrors(e => ({ ...e, [field]: '' }));
  };

  const handleOpenModal = () => {
    setForm({ name: '', licenseNo: '', category: 'Class A', expiryDate: '', safetyScore: '100' });
    setErrors({});
    setEditingId(null);
    setModalOpen(true);
  };

  const handleEdit = (driver) => {
    setForm({
      name: driver.name,
      licenseNo: driver.licenseNo,
      category: driver.category,
      expiryDate: driver.expiryDate,
      safetyScore: driver.safetyScore.toString()
    });
    setErrors({});
    setEditingId(driver.id);
    setModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to remove this driver?')) {
      setDrivers(prev => prev.filter(d => d.id !== id));
    }
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    if (editingId) {
      setDrivers(prev => prev.map(d => d.id === editingId ? {
        ...d,
        name: form.name,
        licenseNo: form.licenseNo,
        category: form.category,
        expiryDate: form.expiryDate,
        safetyScore: Number(form.safetyScore)
      } : d));
    } else {
      setDrivers(prev => [...prev, {
        id: `d${Date.now()}`,
        name: form.name,
        licenseNo: form.licenseNo,
        category: form.category,
        expiryDate: form.expiryDate,
        safetyScore: Number(form.safetyScore),
        status: 'Available'
      }]);
    }
    setModalOpen(false);
  };

  return (
    <div>
      <div className="d-page-header">
        <div>
          <div className="d-page-header-title">Driver Management</div>
          <div className="d-page-header-sub">Track driver licenses, safety scores and duty status</div>
        </div>
        <Button leftIcon="➕" onClick={handleOpenModal}>Add Driver</Button>
      </div>

      <DataTable 
        title="Driver Directory"
        columns={columns}
        data={drivers}
        searchable={true}
        searchKeys={['name', 'licenseNo', 'status']}
        emptyTitle="No drivers found"
        emptyDesc="Add a new driver to start managing your workforce."
      />

      <ModalDialog
        open={isModalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Edit Driver' : 'Add Driver'}
        footer={
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit}>{editingId ? 'Save Changes' : 'Add Driver'}</Button>
          </>
        }
      >
        <div className="d-form-grid">
          <Input 
            label="Full Name" 
            placeholder="e.g. Sam Rivera" 
            value={form.name} 
            onChange={handleChange('name')}
            error={errors.name}
            required
            className="d-form-grid-full"
          />
          <Input 
            label="License Number" 
            placeholder="e.g. DL-93821" 
            value={form.licenseNo} 
            onChange={handleChange('licenseNo')}
            error={errors.licenseNo}
            required
          />
          <SelectDropdown
            label="License Category"
            options={LICENSE_CATEGORIES}
            value={form.category}
            onChange={handleChange('category')}
            required
          />
          <Input 
            label="Expiry Date" 
            type="date"
            value={form.expiryDate} 
            onChange={handleChange('expiryDate')}
            error={errors.expiryDate}
            required
          />
          <Input 
            label="Safety Score (0-100)" 
            type="number"
            min="0"
            max="100"
            placeholder="100" 
            value={form.safetyScore} 
            onChange={handleChange('safetyScore')}
            error={errors.safetyScore}
            required
          />
        </div>
      </ModalDialog>
    </div>
  );
};

export default DriversPage;
