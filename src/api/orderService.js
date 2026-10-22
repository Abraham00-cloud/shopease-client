import axiosInstance from './axiosInstance';

export const orderService = {
  // POST /api/v1/order/checkout/purchase
  createOrder: async () => {
    const response = await axiosInstance.post('/order/checkout/purchase');
    return response.data;
  },

  // GET /api/v1/order/mine
  getMyOrders: async (page = 0, size = 10) => {
    const response = await axiosInstance.get('/order/mine', {
      params: { page, size },
    });
    return response.data;
  },

  // GET /api/v1/order/all (VENDOR / ADMIN)
  getAllOrders: async (page = 0, size = 10) => {
    const response = await axiosInstance.get('/order/all', {
      params: { page, size },
    });
    return response.data;
  },

  // GET /api/v1/order/{orderId}
  getOrderById: async (orderId) => {
    const response = await axiosInstance.get(`/order/${orderId}`);
    return response.data;
  },

  // PATCH /api/v1/order/{orderId}/status (VENDOR / ADMIN)
  updateOrderStatus: async (orderId, status) => {
    const response = await axiosInstance.patch(`/order/${orderId}/status`, JSON.stringify(status), {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data;
  },

  // DELETE /api/v1/order/{orderId}
  cancelOrder: async (orderId) => {
    const response = await axiosInstance.delete(`/order/${orderId}`);
    return response.data;
  },
};