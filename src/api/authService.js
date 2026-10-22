import axiosInstance from './axiosInstance';

export const authService = {
  login: async (credentials) => {
    // credentials: { email, password }
    const response = await axiosInstance.post('/users/login', credentials);
    return response.data;
  },

  register: async (userData) => {
    // userData: { firstName, lastName, email, password, role }
    const response = await axiosInstance.post('/users/register', userData);
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await axiosInstance.put('/users/update/profile', profileData);
    return response.data;
  },
};