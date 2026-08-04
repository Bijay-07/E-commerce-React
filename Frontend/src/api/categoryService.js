import axiosInstance from './axios';

const categoryService = {
  getCategories: () => axiosInstance.get('/category'),
  getCategoryById: (id) => axiosInstance.get(`/category/${id}`),
  createCategory: (data) => axiosInstance.post('/category', data),
  updateCategory: (id, data) => axiosInstance.put(`/category/${id}`, data),
  deleteCategory: (id) => axiosInstance.delete(`/category/${id}`),
};

export default categoryService;