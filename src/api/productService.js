import axiosInstance from './axiosInstance';

export const productService = {
  // GET /api/v1/products?page=0&size=10
  getAllProducts: async (page = 0, size = 10) => {
    const response = await axiosInstance.get('/products', {
      params: { page, size },
    });
    return response.data;
  },

  // GET /api/v1/products/{id}
  getProductById: async (id) => {
    const response = await axiosInstance.get(`/products/${id}`);
    return response.data;
  },

  // POST /api/v1/products (VENDOR / ADMIN)
  createProduct: async (productData) => {
    const response = await axiosInstance.post('/products', productData);
    return response.data;
  },

  // PUT /api/v1/products/{id} (VENDOR / ADMIN)
  updateProduct: async (id, productData) => {
    const response = await axiosInstance.put(`/products/${id}`, productData);
    return response.data;
  },

  // DELETE /api/v1/products/{id} (VENDOR / ADMIN)
  deleteProduct: async (id) => {
    const response = await axiosInstance.delete(`/products/${id}`);
    return response.data;
  },

  // POST /api/v1/products/{productId}/images
  addImage: async (productId, imageUrl) => {
    const response = await axiosInstance.post(`/products/${productId}/images`, imageUrl);
    return response.data;
  },

  // GET /api/v1/products/{productId}/images
  getImages: async (productId, page = 0, size = 10) => {
    const response = await axiosInstance.get(`/products/${productId}/images`, {
      params: { page, size },
    });
    return response.data;
  },

  // DELETE /api/v1/products/{productId}/images/{imageId}
  deleteImage: async (productId, imageId) => {
    const response = await axiosInstance.delete(`/products/${productId}/images/${imageId}`);
    return response.data;
  },
};