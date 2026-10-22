import axiosInstance from './axiosInstance';

export const paymentService = {
  // POST /api/v1/payments/initialize/{orderId}
  initializePayment: async (orderId) => {
    const response = await axiosInstance.post(`/payments/initialize/${orderId}`);
    return response.data; // Expects { status: "success", authorization_url: "https://checkout.paystack.com/..." }
  },
};