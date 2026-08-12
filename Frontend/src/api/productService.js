import axiosInstance from './axios';

const productService = {
  // params can include { category, search }
  getProducts: (params = {}) => axiosInstance.get('/product', { params }),
  getProductById: (id) => axiosInstance.get(`/product/${id}`),

  // Product creation expects multipart/form-data — the backend's multer
  // middleware reads a single file from the field name "images".
  createProduct: (formData) =>
    axiosInstance.post('/product', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  // NOTE: updateProduct has no multer middleware on the backend, so the
  // image cannot be changed here — only text/number fields.
  updateProduct: (id, data) => axiosInstance.put(`/product/${id}`, data),
  deleteProduct: (id) => axiosInstance.delete(`/product/${id}`),
};

export default productService;