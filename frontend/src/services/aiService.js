import api from './api';

const aiService = {
  getFinancialAdvice: async (data) => {
    const response = await api.post('/ai/advice', data);
    return response.data;
  },

  analyzeSpending: async (data) => {
    const response = await api.post('/ai/analyze-spending', data);
    return response.data;
  },

  recommendBudget: async (data) => {
    const response = await api.post('/ai/recommend-budget', data);
    return response.data;
  },

  getSavingsTips: async () => {
    const response = await api.get('/ai/savings-tips');
    return response.data;
  },
};

export default aiService;
