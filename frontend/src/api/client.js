const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Automatically refreshes the access token when it expires (401 error).
// Uses the refresh_token stored in localStorage to get a new access_token silently.
async function refreshAccessToken() {
  const refresh_token = localStorage.getItem('refresh_token');
  if (!refresh_token) throw new Error('No refresh token available.');

  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token }),
  });

  if (!response.ok) {
    // Refresh token itself is expired — force logout
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    window.location.href = '/';
    throw new Error('Session expired. Please login again.');
  }

  const data = await response.json();
  localStorage.setItem('token', data.token);
  localStorage.setItem('refresh_token', data.refresh_token);
  return data.token;
}

export async function apiRequest(endpoint, options = {}, _retry = false) {
  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    cache: 'no-store', // Prevent browser from caching dynamic API responses (fixes 304 stale bugs)
    ...options,
    headers,
  });

  // If token expired (401) and we haven't retried yet, refresh and retry once
  if (response.status === 401 && !_retry) {
    try {
      await refreshAccessToken();
      return apiRequest(endpoint, options, true); // Retry once with new token
    } catch {
      throw new Error('Session expired. Please login again.');
    }
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP Error ${response.status}`);
  }

  return response.json();
}
