import api from './axios';
import { Address } from '../types';

export const getAllAddresses = () => api.get<Address[]>('/api/addresses');
export const getAddressById = (id: number) => api.get<Address>(`/api/addresses/${id}`);
export const createAddress = (address: Partial<Address>) => api.post<Address>('/api/addresses', address);
export const updateAddress = (id: number, address: Partial<Address>) => api.put<Address>(`/api/addresses/${id}`, address);
export const deleteAddress = (id: number) => api.delete(`/api/addresses/${id}`);
