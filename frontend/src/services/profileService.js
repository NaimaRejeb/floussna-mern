import api from './api';

const profileService = {
  getMyProfile: async () => {
    const response = await api.get('/profiles/me');
    return response.data;
  },

  getProfileByUserId: async (userId) => {
    const response = await api.get(`/profiles/user/${userId}`);
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await api.put('/profiles/me', profileData);
    return response.data;
  },

  uploadPhoto: async (formData) => {
    const response = await api.post('/profiles/photo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

export default profileService;
