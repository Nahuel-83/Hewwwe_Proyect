import api from './axios';

export const getAllUsers = () => api.get('/users');
export const getUserById = (id: number) => api.get(`/users/${id}`);
export const createUser = (user: any) => api.post('/users', user);
export const updateUser = (id: number, user: any) => api.put(`/users/${id}`, user);
export const deleteUser = (id: number) => api.delete(`/users/${id}`);
export const getUserCart = (id: number) => api.get(`/users/${id}/cart`);
export const getUserAddresses = (id: number) => api.get(`/users/${id}/addresses`);
export const getUserProducts = (id: number) => api.get(`/users/${id}/products`);
export const getUserExchanges = (id: number) => api.get(`/users/${id}/exchanges`);
