import api from './axios';
import { User, Cart, Address, Product, Exchange } from '../types';

interface UserCreateRequest {
  name: string;
  email: string;
  phone: string;
  role: 'USER' | 'ADMIN';
  password?: string;
}

export const getAllUsers = () => api.get<User[]>('/api/users');
export const getUserById = (id: number) => api.get<User>(`/api/users/${id}`);
export const createUser = (user: UserCreateRequest) => api.post<User>('/api/users', {
  ...user,
  registrationDate: new Date().toISOString()
});
export const updateUser = (id: number, user: Partial<UserCreateRequest>) => 
  api.put<User>(`/api/users/${id}`, user);
export const deleteUser = (id: number) => api.delete(`/api/users/${id}`);

// Endpoints relacionados
export const getUserCart = (id: number) => api.get<Cart>(`/api/users/${id}/cart`);
export const getUserAddresses = (id: number) => api.get<Address[]>(`/api/users/${id}/addresses`);
export const getUserProducts = (id: number) => api.get<Product[]>(`/api/users/${id}/products`);
export const getUserExchanges = (id: number) => api.get<Exchange[]>(`/api/users/${id}/exchanges`);
