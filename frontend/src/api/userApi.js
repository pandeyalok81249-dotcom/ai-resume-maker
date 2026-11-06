import { apiRequest } from './client';

export const userApi = {
  getProfile: async () => {
    return apiRequest('/user/profile');
  },

  updateProfile: async (data) => {
    return apiRequest('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  getStats: async () => {
    return apiRequest('/user/stats');
  },
};

