import axiosInstance from './axios';

const userService = {
  getUsers: () => axiosInstance.get('/user'),
  getUserById: (id) => axiosInstance.get(`/user/${id}`),
  createUser: (data) => axiosInstance.post('/user', data),
  updateUser: (id, data) => axiosInstance.put(`/user/${id}`, data),
  deleteUser: (id) => axiosInstance.delete(`/user/${id}`),
};

export default userService;