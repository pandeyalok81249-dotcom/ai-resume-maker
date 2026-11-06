import { handleOfflineFallback } from './offlineFallback';

const API_BASE = import.meta.env.VITE_API_BASE || '/api';

export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('resumeai_token');
  
  const headers = {
    ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
    ...(options.headers || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      if (!window.location.pathname.includes('/login') && 
          !window.location.pathname.includes('/register') && 
          window.location.pathname !== '/' &&
          !window.location.hostname.includes('github.io')) {
        localStorage.removeItem('resumeai_token');
        localStorage.removeItem('resumeai_user');
        window.location.href = '/login?expired=true';
      }
    }

    if (response.headers.get('content-type')?.includes('application/pdf')) {
      return response.blob();
    }

    if (response.status === 404 || response.status >= 500) {
      // Fallback for static hosts without backend proxy
      if (window.location.hostname.includes('github.io') || !API_BASE.startsWith('http')) {
        return handleOfflineFallback(endpoint, options);
      }
    }

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMsg = data?.message || data?.error || `Request failed with status ${response.status}`;
      throw new Error(errorMsg);
    }

    return data;
  } catch (err) {
    // When offline, running on GitHub Pages, or server disconnected
    if (window.location.hostname.includes('github.io') || err.message?.includes('Failed to fetch') || err.message?.includes('NetworkError')) {
      return handleOfflineFallback(endpoint, options);
    }
    throw err;
  }
}

