import api from './axios';
import { User, Product, Address } from '../types';

export const getAllUsers = () => api.get<User[]>('/api/users');
export const getUserById = (id: number) => api.get<User>(`/api/users/${id}`);
export const createUser = (user: Partial<User>) => api.post<User>('/api/users', user);
export const updateUser = (id: number, user: Partial<User>) => api.put<User>(`/api/users/${id}`, user);
export const deleteUser = (id: number) => api.delete(`/api/users/${id}`);

// Productos del usuario
export const getUserProducts = (userId: number) => api.get<Product[]>(`/api/users/${userId}/products`);

// Direcciones del usuario
export const getUserAddresses = (userId: number) => api.get<Address[]>(`/api/users/${userId}/addresses`);
export const createAddress = (userId: number, address: Partial<Address>) => 
  api.post<Address>(`/api/users/${userId}/addresses`, address);
export const linkAddressToUser = (userId: number, addressId: number) => 
  api.post<void>(`/api/users/${userId}/addresses/${addressId}/link`);
export const unlinkAddressFromUser = (userId: number, addressId: number) => 
  api.delete(`/api/users/${userId}/addresses/${addressId}`);
