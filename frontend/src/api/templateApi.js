import { apiRequest } from './client';

export const templateApi = {
  getTemplates: async () => {
    return apiRequest('/templates');
  },

  getTemplate: async (key) => {
    return apiRequest(`/templates/${key}`);
  },
};

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

