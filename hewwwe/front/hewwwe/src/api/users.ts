import api from './axios';
import { User, Cart, Address, Product, Exchange } from '../types';

interface UserCreateRequest {
  name: string;
  email: string;
  phone: string;
  role: 'USER' | 'ADMIN';
  password?: string;
}

export const getAllUsers = () => api.get<User[]>('/users');
export const getUserById = (id: number) => api.get<User>(`/users/${id}`);
export const createUser = (user: UserCreateRequest) => api.post<User>('/users', {
  ...user,
  registrationDate: new Date().toISOString()
});
export const updateUser = (id: number, user: Partial<UserCreateRequest>) => 
  api.put<User>(`/users/${id}`, user);
export const deleteUser = (id: number) => api.delete(`/users/${id}`);

export const getUserCart = (id: number) => api.get<Cart>(`/users/${id}/cart`);
export const getUserAddresses = (id: number) => api.get<Address[]>(`/users/${id}/addresses`);
export const getUserProducts = (id: number) => api.get<Product[]>(`/users/${id}/products`);
export const getUserExchanges = (id: number) => api.get<Exchange[]>(`/users/${id}/exchanges`);

export const createAddress = (userId: number, address: Partial<Address>) => 
  api.post<Address>(`/users/${userId}/addresses`, address);

export const linkAddressToUser = (userId: number, addressId: number) => 
  api.post<void>(`/users/${userId}/addresses/${addressId}/link`);

export const unlinkAddressFromUser = (userId: number, addressId: number) => 
  api.delete(`/users/${userId}/addresses/${addressId}`);
