import axiosInstance from './axiosInstance';

export const cartService = {
  // GET /api/v1/cart
  getCart: async () => {
    const response = await axiosInstance.get('/cart');
    return response.data;
  },

  // POST /api/v1/cart/items
  addItemToCart: async (productId, quantity = 1) => {
    const response = await axiosInstance.post('/cart/items', {
      productId,
      quantity,
    });
    return response.data;
  },

  // PUT /api/v1/cart/items/{itemId}
  updateCartItemQuantity: async (itemId, quantity) => {
    const response = await axiosInstance.put(`/cart/items/${itemId}`, {
      quantity,
    });
    return response.data;
  },

  // DELETE /api/v1/cart/items/{itemId}
  removeCartItem: async (itemId) => {
    const response = await axiosInstance.delete(`/cart/items/${itemId}`);
    return response.data;
  },

  // DELETE /api/v1/cart/clear
  clearCart: async () => {
    const response = await axiosInstance.delete('/cart/clear');
    return response.data;
  },
};