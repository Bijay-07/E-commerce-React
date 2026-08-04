import axiosInstance from './axios';

const productService = {
  // params can include { category, search }
  getProducts: (params = {}) => axiosInstance.get('/product', { params }),
  getProductById: (id) => axiosInstance.get(`/product/${id}`),
  createProduct: (data) => axiosInstance.post('/product', data),
  updateProduct: (id, data) => axiosInstance.put(`/product/${id}`, data),
  deleteProduct: (id) => axiosInstance.delete(`/product/${id}`),
};

export default productService;