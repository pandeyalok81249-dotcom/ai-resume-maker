import { apiRequest } from './client';

export const resumeApi = {
  getResumes: async () => {
    return apiRequest('/resumes');
  },

  getResume: async (id) => {
    return apiRequest(`/resumes/${id}`);
  },

  createResume: async (data) => {
    return apiRequest('/resumes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateResume: async (id, data) => {
    return apiRequest(`/resumes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  deleteResume: async (id) => {
    return apiRequest(`/resumes/${id}`, {
      method: 'DELETE',
    });
  },

  duplicateResume: async (id) => {
    return apiRequest(`/resumes/${id}/duplicate`, {
      method: 'POST',
    });
  },

  downloadPdf: async (id) => {
    return apiRequest(`/resumes/${id}/download`);
  },

  getPublicResume: async (id) => {
    return apiRequest(`/resumes/public/${id}`);
  },

  togglePublic: async (id) => {
    return apiRequest(`/resumes/${id}/toggle-public`, {
      method: 'POST',
    });
  },
};

