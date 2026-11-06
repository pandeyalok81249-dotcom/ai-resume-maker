import { apiRequest } from './client';

export const resumeAuditApi = {
  uploadAndAnalyze: async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    return apiRequest('/resumes/upload-and-analyze', {
      method: 'POST',
      body: formData,
    });
  },

  importParsedResume: async (parsedResume) => {
    return apiRequest('/resumes/import-parsed', {
      method: 'POST',
      body: JSON.stringify(parsedResume),
    });
  },
};

