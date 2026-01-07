import api from './api';

const transactionService = {
  getAllTransactions: async (params) => {
    const response = await api.get('/transactions', { params });
    // Normaliser les données pour le frontend (categories -> category)
    return response.data.map(t => ({
      ...t,
      category: t.categories?.[0] || null
    }));
  },

  getTransactionById: async (id) => {
    const response = await api.get(`/transactions/${id}`);
    return {
      ...response.data,
      category: response.data.categories?.[0] || null
    };
  },

  createTransaction: async (transactionData) => {
    // Convertir category en categories (tableau) pour le backend
    const dataToSend = { ...transactionData };
    if (dataToSend.category) {
      dataToSend.categories = [dataToSend.category];
      delete dataToSend.category;
    }
    const response = await api.post('/transactions', dataToSend);
    return {
      ...response.data,
      category: response.data.categories?.[0] || null
    };
  },

  updateTransaction: async (id, transactionData) => {
    // Convertir category en categories (tableau) pour le backend
    const dataToSend = { ...transactionData };
    if (dataToSend.category) {
      dataToSend.categories = [dataToSend.category];
      delete dataToSend.category;
    }
    const response = await api.put(`/transactions/${id}`, dataToSend);
    return {
      ...response.data,
      category: response.data.categories?.[0] || null
    };
  },

  deleteTransaction: async (id) => {
    const response = await api.delete(`/transactions/${id}`);
    return response.data;
  },

  getTransactionStats: async (params) => {
    const response = await api.get('/transactions/stats/summary', { params });
    return response.data;
  },
};

export default transactionService;
