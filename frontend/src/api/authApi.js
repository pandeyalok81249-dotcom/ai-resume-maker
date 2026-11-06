import { apiRequest } from './client';

export const authApi = {
  login: async (email, password) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  register: async (userData) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  getCurrentUser: async () => {
    return apiRequest('/auth/me');
  },

  logout: async () => {
    return apiRequest('/auth/logout', { method: 'POST' });
  },

  requestPasswordReset: async (email) => {
    return apiRequest('/auth/reset-password-request', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  resetPassword: async (email, resetToken, newPassword) => {
    return apiRequest('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email, resetToken, newPassword }),
    });
  },
};

