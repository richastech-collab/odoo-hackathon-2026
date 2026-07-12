/**
 * client.js — TransitOps API Client
 *
 * Automatically falls back to mockDb when the real backend is unavailable
 * (network error, 5xx, or the server is simply not running).
 * The fallback is transparent — React components receive identical data shapes
 * and require zero changes when switching back to the real backend.
 */
import { handleMockRequest, getMockSession, clearMockSession } from './mockDb';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

/** Returns true for errors that indicate the backend is totally unreachable */
const isNetworkError = (err) =>
  err instanceof TypeError ||
  err.message?.toLowerCase().includes('failed to fetch') ||
  err.message?.toLowerCase().includes('network') ||
  err.message?.toLowerCase().includes('econnrefused');

/** Returns true for 5xx / gateway errors (backend crashed / not started) */
const isServerError = (status) => status === 0 || status >= 500;

/* ── Low-level fetch wrapper with fallback ────────────────────── */
async function request(endpoint, options = {}) {
  const token = sessionStorage.getItem('token') || localStorage.getItem('token');

  // ── Bypass backend entirely if using a mock session ──
  if (token && token.startsWith('mock_')) {
    console.warn(`[TransitOps] Mock Session Active — routing to mockDb: ${options.method || 'GET'} ${endpoint}`);
    const method = (options.method || 'GET').toUpperCase();
    const body   = options.body ? (typeof options.body === 'string' ? JSON.parse(options.body) : options.body) : undefined;
    return handleMockRequest(method, endpoint, body);
  }

  const headers = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (options.body && typeof options.body === 'string') {
    headers['Content-Type'] = 'application/json';
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: { ...headers, ...(options.headers || {}) },
    });

    if (isServerError(response.status)) {
      // Server is up but erroring (5xx) → fall back to mock
      throw new Error(`Server error ${response.status}`);
    }

    if (!response.ok) {
      let errorMsg = 'An error occurred';
      try {
        const errorData = await response.json();
        errorMsg = errorData.detail || errorData.message || errorMsg;
      } catch {
        errorMsg = response.statusText;
      }
      throw new Error(errorMsg);
    }

    const text = await response.text();
    return text ? JSON.parse(text) : null;

  } catch (err) {
    if (isNetworkError(err) || err.message?.startsWith('Server error')) {
      // ── Fallback: route to in-browser mock database ──
      console.warn(`[TransitOps] Backend unavailable — using mock data for: ${options.method || 'GET'} ${endpoint}`);
      const method = (options.method || 'GET').toUpperCase();
      const body   = options.body ? (typeof options.body === 'string' ? JSON.parse(options.body) : options.body) : undefined;
      return handleMockRequest(method, endpoint, body);
    }
    // Real application error (e.g. 400 wrong credentials) — propagate normally
    throw err;
  }
}

/* ── Form-encoded POST with fallback (used for /auth/login) ───── */
async function requestForm(endpoint, formData) {
  const token = sessionStorage.getItem('token') || localStorage.getItem('token');

  // ── Bypass backend entirely if logging in as a demo user ──
  if (endpoint === '/auth/login') {
    const username = formData.get('username');
    const demoEmails = ['fm@transitops.com', 'driver@transitops.com', 'safety@transitops.com', 'finance@transitops.com'];
    if (demoEmails.includes(username)) {
      console.warn(`[TransitOps] Demo login detected — routing to mockDb: POST ${endpoint}`);
      return handleMockRequest('POST', endpoint, formData);
    }
  }

  const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      body: formData,
      headers,
    });

    if (isServerError(response.status)) throw new Error(`Server error ${response.status}`);

    if (!response.ok) {
      let errorMsg = 'An error occurred';
      try {
        const errorData = await response.json();
        errorMsg = errorData.detail || errorData.message || errorMsg;
      } catch {
        errorMsg = response.statusText;
      }
      throw new Error(errorMsg);
    }

    const text = await response.text();
    return text ? JSON.parse(text) : null;

  } catch (err) {
    if (isNetworkError(err) || err.message?.startsWith('Server error')) {
      console.warn(`[TransitOps] Backend unavailable — using mock auth for: POST ${endpoint}`);
      return handleMockRequest('POST', endpoint, formData);
    }
    throw err;
  }
}

/* ── Public API Client ────────────────────────────────────────── */
export const apiClient = {
  get:      (endpoint)        => request(endpoint, { method: 'GET' }),
  post:     (endpoint, body)  => request(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  put:      (endpoint, body)  => request(endpoint, { method: 'PUT',  body: JSON.stringify(body) }),
  delete:   (endpoint)        => request(endpoint, { method: 'DELETE' }),
  postForm: (endpoint, formData) => requestForm(endpoint, formData),
};

/* Re-export helpers so AuthContext can reach them */
export { getMockSession, clearMockSession };
