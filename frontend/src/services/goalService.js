import api from './api';

const goalService = {
  getAllGoals: async (params) => {
    const response = await api.get('/goals', { params });
    return response.data;
  },

  getGoalById: async (id) => {
    const response = await api.get(`/goals/${id}`);
    return response.data;
  },

  createGoal: async (goalData) => {
    const response = await api.post('/goals', goalData);
    return response.data;
  },

  updateGoal: async (id, goalData) => {
    const response = await api.put(`/goals/${id}`, goalData);
    return response.data;
  },

  deleteGoal: async (id) => {
    const response = await api.delete(`/goals/${id}`);
    return response.data;
  },

  addContribution: async (id, contributionData) => {
    const response = await api.post(`/goals/${id}/contribute`, contributionData);
    return response.data;
  },

  getGoalStats: async () => {
    const response = await api.get('/goals/stats/summary');
    return response.data;
  },
};

export default goalService;
