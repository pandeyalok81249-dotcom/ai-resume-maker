import { apiRequest } from './client';

export const aiApi = {
  generateSummary: async (payload) => {
    return apiRequest('/ai/generate-summary', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  generateBullets: async (payload) => {
    return apiRequest('/ai/generate-bullets', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  improveContent: async (payload) => {
    return apiRequest('/ai/improve-content', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  analyzeAts: async (payload) => {
    return apiRequest('/ai/ats-analysis', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  matchJob: async (payload) => {
    return apiRequest('/ai/job-match', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  generateCareerObjective: async (payload) => {
    return apiRequest('/ai/career-objective', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  generateCoverLetter: async (payload) => {
    return apiRequest('/ai/cover-letter', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  generateLinkedInSummary: async (payload) => {
    return apiRequest('/ai/linkedin-summary', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  generateInterviewPrep: async (payload) => {
    return apiRequest('/ai/interview-prep', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  evaluateAnswer: async (payload) => {
    return apiRequest('/ai/evaluate-answer', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  tailorResume: async (payload) => {
    return apiRequest('/ai/tailor-resume', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  generateSalaryInsights: async (payload) => {
    return apiRequest('/ai/salary-insights', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};

