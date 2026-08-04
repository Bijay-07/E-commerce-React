import axiosInstance from './axios';

const cartService = {
  getCart: (userId) => axiosInstance.get(`/cart/${userId}`),
  addItem: (userId, productId, quantity = 1) =>
    axiosInstance.post(`/cart/${userId}`, { productId, quantity }),
  updateItem: (userId, productId, quantity) =>
    axiosInstance.patch(`/cart/${userId}`, { productId, quantity }),
  removeItem: (userId, productId) =>
    axiosInstance.delete(`/cart/${userId}/items/${productId}`),
  clearCart: (userId) => axiosInstance.delete(`/cart/${userId}`),
};

export default cartService;