import axiosInstance from './axiosInstance';

export const categoryService = {
  // GET /api/v1/categories
  getAllCategories: async (page = 0, size = 50) => {
    const response = await axiosInstance.get('/categories', {
      params: { page, size },
    });
    return response.data;
  },

  // GET /api/v1/categories/{id}
  getCategoryById: async (id) => {
    const response = await axiosInstance.get(`/categories/${id}`);
    return response.data;
  },

  // POST /api/v1/categories (ADMIN)
  createCategory: async (categoryData) => {
    const response = await axiosInstance.post('/categories', categoryData);
    return response.data;
  },

  // PUT /api/v1/categories/{id} (ADMIN)
  updateCategory: async (id, categoryData) => {
    const response = await axiosInstance.put(`/categories/${id}`, categoryData);
    return response.data;
  },

  // DELETE /api/v1/categories/{id} (ADMIN)
  deleteCategory: async (id) => {
    const response = await axiosInstance.delete(`/categories/${id}`);
    return response.data;
  },
};