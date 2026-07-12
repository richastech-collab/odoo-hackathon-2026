/**
 * mockDb.js — In-browser mock database for TransitOps
 *
 * Provides a realistic fallback when the backend is unavailable.
 * - Data is persisted to localStorage so it survives page reloads.
 * - All fields exactly match the backend Pydantic model schemas.
 * - handleMockRequest() is a drop-in REST emulator used by client.js.
 */

/* ── Helpers ──────────────────────────────────────────────────── */
const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);

const store = {
  get: (key) => { try { return JSON.parse(localStorage.getItem(`transitops_${key}`)); } catch { return null; } },
  set: (key, val) => localStorage.setItem(`transitops_${key}`, JSON.stringify(val)),
};

/* ── Seed data (matches backend Pydantic schemas exactly) ─────── */
const SEED_VEHICLES = [
  { id: 'v1', regNo: 'TRK-001', name: 'Volvo FH16 750', type: 'Truck',   capacity: 20000, odometer: 134200, cost: 125000, status: 'Available' },
  { id: 'v2', regNo: 'VAN-005', name: 'Ford Transit 350', type: 'Van',    capacity: 1500,  odometer: 62400,  cost: 38000,  status: 'Available' },
  { id: 'v3', regNo: 'TRK-009', name: 'Scania R500',      type: 'Truck',  capacity: 18000, odometer: 210700, cost: 115000, status: 'On Trip'   },
  { id: 'v4', regNo: 'VAN-008', name: 'Mercedes Sprinter', type: 'Van',   capacity: 1200,  odometer: 44800,  cost: 42000,  status: 'In Shop'   },
  { id: 'v5', regNo: 'TRL-002', name: 'Fruehauf 40T',     type: 'Trailer', capacity: 40000, odometer: 320000, cost: 85000, status: 'Available' },
  { id: 'v6', regNo: 'VAN-011', name: 'Toyota HiAce',     type: 'Van',    capacity: 900,   odometer: 31200,  cost: 29000,  status: 'Available' },
  { id: 'v7', regNo: 'TRK-012', name: 'MAN TGX 18.440',   type: 'Truck',  capacity: 22000, odometer: 178300, cost: 132000, status: 'Available' },
  { id: 'v8', regNo: 'CAR-003', name: 'Toyota Camry',     type: 'Car',    capacity: 400,   odometer: 28900,  cost: 22000,  status: 'Available' },
];

const SEED_DRIVERS = [
  { id: 'd1', name: 'Arjun Mehta',    licenseNo: 'DL-MH-0092', category: 'Class A', expiryDate: '2026-07-17', safetyScore: 92, status: 'Available' },
  { id: 'd2', name: 'Sara Collins',   licenseNo: 'DL-DL-0031', category: 'Class B', expiryDate: '2026-07-30', safetyScore: 87, status: 'Available' },
  { id: 'd3', name: 'Vijay Sharma',   licenseNo: 'DL-KA-0057', category: 'Class A', expiryDate: '2026-08-09', safetyScore: 78, status: 'On Trip'   },
  { id: 'd4', name: 'Sam Rivera',     licenseNo: 'DL-TN-0114', category: 'Class B', expiryDate: '2027-03-22', safetyScore: 95, status: 'Available' },
  { id: 'd5', name: 'Priya Nair',     licenseNo: 'DL-MH-0205', category: 'Class C', expiryDate: '2027-01-14', safetyScore: 82, status: 'Off Duty'  },
  { id: 'd6', name: 'Ravi Kumar',     licenseNo: 'DL-DL-0088', category: 'Class A', expiryDate: '2025-12-01', safetyScore: 44, status: 'Suspended' },
  { id: 'd7', name: 'Leo Fernandez',  licenseNo: 'DL-GJ-0033', category: 'Class A', expiryDate: '2028-06-11', safetyScore: 98, status: 'Available' },
  { id: 'd8', name: 'Meena Pillai',   licenseNo: 'DL-KL-0072', category: 'Class C', expiryDate: '2027-09-19', safetyScore: 91, status: 'Off Duty'  },
];

const SEED_TRIPS = [
  { id: 't1', source: 'Warehouse A, Mumbai',  dest: 'Distribution Hub, Pune',    vehicleId: 'v1', driverId: 'd1', weight: 12000, status: 'Completed'  },
  { id: 't2', source: 'Factory Gate, Chennai', dest: 'Port C, Tuticorin',         vehicleId: 'v3', driverId: 'd3', weight: 16000, status: 'On Trip'    },
  { id: 't3', source: 'Cold Store, Hyderabad', dest: 'Retail Depot, Bangalore',   vehicleId: 'v2', driverId: 'd4', weight: 800,   status: 'Draft'      },
  { id: 't4', source: 'Plant B, Nagpur',       dest: 'Rail Yard, Itarsi',         vehicleId: 'v7', driverId: 'd7', weight: 19000, status: 'Completed'  },
  { id: 't5', source: 'Airport Cargo, Delhi',  dest: 'Fulfilment Centre, Noida',  vehicleId: 'v6', driverId: 'd2', weight: 650,   status: 'Cancelled'  },
  { id: 't6', source: 'Warehouse A, Mumbai',   dest: 'Store Front, Thane',        vehicleId: 'v8', driverId: 'd5', weight: 200,   status: 'Completed'  },
];

const SEED_MAINTENANCE = [
  { id: 'm1', vehicleId: 'v4', serviceType: 'Engine Repair',       date: '2026-07-10', cost: 3200,  description: 'Turbocharger replacement and full service', status: 'Pending'   },
  { id: 'm2', vehicleId: 'v1', serviceType: 'Routine Inspection',  date: '2026-06-28', cost: 450,   description: 'Scheduled 250,000 km full inspection',       status: 'Completed' },
  { id: 'm3', vehicleId: 'v3', serviceType: 'Tire Replacement',    date: '2026-07-01', cost: 1800,  description: 'All 6 rear tires replaced with Michelin X',   status: 'Completed' },
  { id: 'm4', vehicleId: 'v7', serviceType: 'Body Work',           date: '2026-07-08', cost: 620,   description: 'Minor cab dent repair after parking incident',  status: 'Completed' },
  { id: 'm5', vehicleId: 'v2', serviceType: 'Routine Inspection',  date: '2026-07-12', cost: 280,   description: 'Annual safety check — oil, brakes, lights',    status: 'Pending'   },
];

const SEED_EXPENSES = [
  { id: 'e1', vehicleId: 'v1', date: '2026-07-11', type: 'Fuel',         amount: 312.50, liters: 125, costPerLiter: 2.50, desc: null },
  { id: 'e2', vehicleId: 'v3', date: '2026-07-10', type: 'Fuel',         amount: 225.00, liters: 90,  costPerLiter: 2.50, desc: null },
  { id: 'e3', vehicleId: 'v7', date: '2026-07-09', type: 'Fuel',         amount: 374.00, liters: 136, costPerLiter: 2.75, desc: null },
  { id: 'e4', vehicleId: 'v2', date: '2026-07-08', type: 'Tolls',        amount: 48.00,  liters: null, costPerLiter: null, desc: 'Highway NH-48 toll both ways' },
  { id: 'e5', vehicleId: 'v1', date: '2026-07-07', type: 'Tolls',        amount: 120.00, liters: null, costPerLiter: null, desc: 'Expressway charges — full trip' },
  { id: 'e6', vehicleId: 'v8', date: '2026-07-06', type: 'Meals',        amount: 35.00,  liters: null, costPerLiter: null, desc: 'Driver meal allowance — overnight' },
  { id: 'e7', vehicleId: 'v6', date: '2026-07-05', type: 'Fuel',         amount: 155.00, liters: 62,  costPerLiter: 2.50, desc: null },
  { id: 'e8', vehicleId: 'v4', date: '2026-07-04', type: 'Maintenance',  amount: 3200.00,liters: null, costPerLiter: null, desc: 'Turbocharger repair — VAN-008' },
  { id: 'e9', vehicleId: 'v3', date: '2026-07-03', type: 'Lodging',      amount: 75.00,  liters: null, costPerLiter: null, desc: 'Driver overnight stay — long haul' },
  { id: 'e10',vehicleId: 'v7', date: '2026-07-02', type: 'Fuel',         amount: 288.75, liters: 105, costPerLiter: 2.75, desc: null },
];

/* Demo user credentials → matches login page DEMO_USERS */
const DEMO_USERS = [
  { id: 'u1', email: 'fm@transitops.com',      password: 'fleet123', name: 'Richa Singh',   role: 'Fleet Manager'     },
  { id: 'u2', email: 'driver@transitops.com',  password: 'drive123', name: 'Sam Rivera',    role: 'Driver'            },
  { id: 'u3', email: 'safety@transitops.com',  password: 'safe123',  name: 'Priya Nair',    role: 'Safety Officer'    },
  { id: 'u4', email: 'finance@transitops.com', password: 'fin123',   name: 'Leo Fernandez', role: 'Financial Analyst' },
];

/* ── DB Initialization ────────────────────────────────────────── */
function initDb() {
  if (!store.get('vehicles'))    store.set('vehicles',    SEED_VEHICLES);
  if (!store.get('drivers'))     store.set('drivers',     SEED_DRIVERS);
  if (!store.get('trips'))       store.set('trips',       SEED_TRIPS);
  if (!store.get('maintenance')) store.set('maintenance', SEED_MAINTENANCE);
  if (!store.get('expenses'))    store.set('expenses',    SEED_EXPENSES);
}

/* ── Core CRUD helpers ────────────────────────────────────────── */
const db = {
  list:   (col)       => store.get(col) || [],
  get:    (col, id)   => (store.get(col) || []).find(r => r.id === id) || null,
  create: (col, data) => {
    const rec = { id: uid(), ...data };
    const all = store.get(col) || [];
    all.push(rec);
    store.set(col, all);
    return rec;
  },
  update: (col, id, data) => {
    const all = store.get(col) || [];
    const idx = all.findIndex(r => r.id === id);
    if (idx === -1) return null;
    all[idx] = { ...all[idx], ...data, id };
    store.set(col, all);
    return all[idx];
  },
  delete: (col, id) => {
    const all = store.get(col) || [];
    const next = all.filter(r => r.id !== id);
    store.set(col, next);
    return next.length < all.length;
  },
};

/* ── Mock token management ────────────────────────────────────── */
// Store active mock session (email → user) in sessionStorage
const SESSION_KEY = 'transitops_mock_session';
const setMockSession = (user) => sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
const getMockSession = () => { try { return JSON.parse(sessionStorage.getItem(SESSION_KEY)); } catch { return null; } };
const clearMockSession = () => sessionStorage.removeItem(SESSION_KEY);

/* ── Main request handler ─────────────────────────────────────── */
/**
 * Simulates a REST API response for a given method + endpoint + body.
 * Returns the same shape the real backend would return.
 */
export async function handleMockRequest(method, endpoint, body) {
  // Simulate slight network delay for realism
  await new Promise(r => setTimeout(r, 60 + Math.random() * 80));

  // Strip leading /api if present
  const path = endpoint.replace(/^\/api/, '').replace(/\/$/, '');
  const parts = path.split('/').filter(Boolean); // e.g. ['vehicles', '123']
  const [resource, id, action] = parts;

  /* ──── AUTH ─────────────────────────────────────────────────── */
  if (resource === 'auth') {
    if (id === 'login' && method === 'POST') {
      // body is URLSearchParams
      let username, password;
      if (body instanceof URLSearchParams) {
        username = body.get('username');
        password = body.get('password');
      } else if (typeof body === 'object') {
        username = body.username;
        password = body.password;
      } else {
        const params = new URLSearchParams(body);
        username = params.get('username');
        password = params.get('password');
      }
      const user = DEMO_USERS.find(u => u.email === username && u.password === password);
      if (!user) throw new Error('Incorrect email or password');
      const token = `mock_${user.id}_${Date.now()}`;
      setMockSession({ ...user, token });
      return { access_token: token, token_type: 'bearer' };
    }
    if (id === 'me' && method === 'GET') {
      const session = getMockSession();
      if (!session) throw new Error('Not authenticated');
      // Return same shape as backend /auth/me
      return { id: session.id, email: session.email, name: session.name, role: session.role };
    }
    if (id === 'register' && method === 'POST') {
      return { message: 'User registered successfully' };
    }
  }

  /* ──── VEHICLES ─────────────────────────────────────────────── */
  if (resource === 'vehicles') {
    if (method === 'GET' && !id)  return db.list('vehicles');
    if (method === 'GET' && id)   { const v = db.get('vehicles', id); if (!v) throw new Error('Vehicle not found'); return v; }
    if (method === 'POST')         return db.create('vehicles', { ...body, status: body.status || 'Available' });
    if (method === 'PUT' && id)   { const v = db.update('vehicles', id, body); if (!v) throw new Error('Vehicle not found'); return v; }
    if (method === 'DELETE' && id) { db.delete('vehicles', id); return { message: 'Vehicle deleted' }; }
  }

  /* ──── DRIVERS ──────────────────────────────────────────────── */
  if (resource === 'drivers') {
    if (method === 'GET' && !id)  return db.list('drivers');
    if (method === 'GET' && id)   { const d = db.get('drivers', id); if (!d) throw new Error('Driver not found'); return d; }
    if (method === 'POST')         return db.create('drivers', { ...body, status: body.status || 'Available' });
    if (method === 'PUT' && id)   { const d = db.update('drivers', id, body); if (!d) throw new Error('Driver not found'); return d; }
    if (method === 'DELETE' && id) { db.delete('drivers', id); return { message: 'Driver deleted' }; }
  }

  /* ──── TRIPS ────────────────────────────────────────────────── */
  if (resource === 'trips') {
    if (method === 'GET' && !id)  return db.list('trips');
    if (method === 'GET' && id && !action) { const t = db.get('trips', id); if (!t) throw new Error('Trip not found'); return t; }

    if (method === 'POST' && !id) {
      return db.create('trips', { ...body, status: 'Draft' });
    }

    if (method === 'POST' && id && action === 'dispatch') {
      const trip = db.get('trips', id);
      if (!trip) throw new Error('Trip not found');
      db.update('trips', id, { status: 'On Trip' });
      // Mark vehicle + driver as On Trip
      if (trip.vehicleId) db.update('vehicles', trip.vehicleId, { status: 'On Trip' });
      if (trip.driverId)  db.update('drivers',  trip.driverId,  { status: 'On Trip' });
      return { message: 'Trip Dispatched Successfully' };
    }

    if (method === 'POST' && id && action === 'complete') {
      const trip = db.get('trips', id);
      if (!trip) throw new Error('Trip not found');
      db.update('trips', id, { status: 'Completed' });
      if (trip.vehicleId) db.update('vehicles', trip.vehicleId, { status: 'Available' });
      if (trip.driverId)  db.update('drivers',  trip.driverId,  { status: 'Available' });
      return { message: 'Trip Completed Successfully' };
    }

    if (method === 'POST' && id && action === 'cancel') {
      const trip = db.get('trips', id);
      if (!trip) throw new Error('Trip not found');
      db.update('trips', id, { status: 'Cancelled' });
      if (trip.vehicleId) db.update('vehicles', trip.vehicleId, { status: 'Available' });
      if (trip.driverId)  db.update('drivers',  trip.driverId,  { status: 'Available' });
      return { message: 'Trip Cancelled Successfully' };
    }

    if (method === 'PUT' && id) {
      const t = db.update('trips', id, body);
      if (!t) throw new Error('Trip not found');
      return t;
    }
    if (method === 'DELETE' && id) { db.delete('trips', id); return { message: 'Trip deleted' }; }
  }

  /* ──── MAINTENANCE ──────────────────────────────────────────── */
  if (resource === 'maintenance') {
    if (method === 'GET' && !id)  return db.list('maintenance');
    if (method === 'GET' && id)   { const m = db.get('maintenance', id); if (!m) throw new Error('Maintenance log not found'); return m; }
    if (method === 'POST')         return db.create('maintenance', { ...body, status: body.status || 'Pending' });
    if (method === 'PUT' && id)   { const m = db.update('maintenance', id, body); if (!m) throw new Error('Log not found'); return m; }
    if (method === 'DELETE' && id) { db.delete('maintenance', id); return { message: 'Maintenance log deleted' }; }
  }

  /* ──── EXPENSES ─────────────────────────────────────────────── */
  if (resource === 'expenses') {
    if (method === 'GET' && !id)  return db.list('expenses');
    if (method === 'GET' && id)   { const e = db.get('expenses', id); if (!e) throw new Error('Expense not found'); return e; }
    if (method === 'POST')         return db.create('expenses', body);
    if (method === 'PUT' && id)   { const e = db.update('expenses', id, body); if (!e) throw new Error('Expense not found'); return e; }
    if (method === 'DELETE' && id) { db.delete('expenses', id); return { message: 'Expense deleted' }; }
  }

  /* ──── DASHBOARD / REPORTS ──────────────────────────────────── */
  if (resource === 'dashboard' && method === 'GET') {
    const vehicles    = db.list('vehicles');
    const drivers     = db.list('drivers');
    const trips       = db.list('trips');
    const expenses    = db.list('expenses');
    const maintenance = db.list('maintenance');
    return {
      total_vehicles:     vehicles.length,
      active_trips:       trips.filter(t => t.status === 'On Trip').length,
      total_drivers:      drivers.length,
      monthly_fuel_cost:  expenses.filter(e => e.type === 'Fuel').reduce((s, e) => s + e.amount, 0),
      pending_maintenance:maintenance.filter(m => m.status === 'Pending').length,
      fleet_utilization:  Math.round((vehicles.filter(v => v.status !== 'Retired').length / vehicles.length) * 100),
    };
  }

  throw new Error(`Mock: unhandled ${method} ${path}`);
}

/* ── Initialize on import ─────────────────────────────────────── */
initDb();

export { getMockSession, clearMockSession };
