import { API_BASE_URL } from '../config/env';

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

async function parseResponse(response) {
  if (response.status === 204) return null;
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) return null;
  return response.json();
}

function getAuthToken() {
  return localStorage.getItem('sfr_token');
}

export async function apiRequest(endpoint, options = {}) {
  const { skipAuth, headers, ...fetchOptions } = options;
  const token = !skipAuth ? getAuthToken() : null;
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...fetchOptions,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(headers || {}),
    },
  });

  const data = await parseResponse(response);
  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('sfr_token');
      localStorage.removeItem('sfr_user');
      window.dispatchEvent(new Event('sfr:logout'));
    }
    const message = data?.message || data?.error || `Error HTTP ${response.status}`;
    throw new ApiError(message, response.status, data);
  }
  return data;
}

export const http = {
  get: (endpoint, options) => apiRequest(endpoint, options),
  post: (endpoint, body, options) => apiRequest(endpoint, { method: 'POST', body: JSON.stringify(body), ...(options || {}) }),
  put: (endpoint, body, options) => apiRequest(endpoint, { method: 'PUT', body: JSON.stringify(body), ...(options || {}) }),
  delete: (endpoint, options) => apiRequest(endpoint, { method: 'DELETE', ...(options || {}) }),
};

