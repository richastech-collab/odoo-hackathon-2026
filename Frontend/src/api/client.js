const API_BASE_URL = 'http://127.0.0.1:8000/api';

/**
 * Utility to make API requests with automatic Authorization header inclusion.
 */
export const apiClient = {
  get: async (endpoint) => request(endpoint, { method: 'GET' }),
  post: async (endpoint, body, options = {}) => request(endpoint, { method: 'POST', body: JSON.stringify(body), ...options }),
  put: async (endpoint, body) => request(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
  delete: async (endpoint) => request(endpoint, { method: 'DELETE' }),
  postForm: async (endpoint, formData) => {
    // URLSearchParams must be sent with explicit Content-Type for FastAPI OAuth2PasswordRequestForm
    const token = sessionStorage.getItem('token') || localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      body: formData,
      headers,
    });
    if (!response.ok) {
      let errorMsg = 'An error occurred';
      try {
        const errorData = await response.json();
        errorMsg = errorData.detail || errorData.message || errorMsg;
      } catch (e) {
        errorMsg = response.statusText;
      }
      throw new Error(errorMsg);
    }
    const text = await response.text();
    return text ? JSON.parse(text) : null;
  }
};

async function request(endpoint, options = {}) {
  const token = sessionStorage.getItem('token') || localStorage.getItem('token');
  
  const headers = {};
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  // Default to JSON for POST/PUT unless body is already a string with explicit type
  if (options.body && typeof options.body === 'string') {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: { ...headers, ...(options.headers || {}) },
  });

  if (!response.ok) {
    let errorMsg = 'An error occurred';
    try {
      const errorData = await response.json();
      errorMsg = errorData.detail || errorData.message || errorMsg;
    } catch (e) {
      errorMsg = response.statusText;
    }
    throw new Error(errorMsg);
  }

  // Handle 204 No Content or empty responses
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}
