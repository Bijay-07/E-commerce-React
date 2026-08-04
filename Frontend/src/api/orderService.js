import axiosInstance from './axios';

const orderService = {
  // pass { user: userId } to filter orders for a specific user
  getOrders: (params = {}) => axiosInstance.get('/order', { params }),
  getOrderById: (id) => axiosInstance.get(`/order/${id}`),
  createOrder: (data) => axiosInstance.post('/order', data),
  updateOrderStatus: (id, orderStatus) =>
    axiosInstance.patch(`/order/${id}`, { orderStatus }),
  deleteOrder: (id) => axiosInstance.delete(`/order/${id}`),
};

export default orderService;