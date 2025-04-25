import api from './axios';
import { AddressCreateDTO, AddressResponseDTO } from '../types/dtos';

export const getAllAddresses = () => api.get<AddressResponseDTO[]>('/addresses');
export const getAddressById = (id: number) => api.get<AddressResponseDTO>(`/addresses/${id}`);
export const createAddress = (userId: number, address: AddressCreateDTO) => 
  api.post<AddressResponseDTO>(`/addresses/user/${userId}`, address);
export const updateAddress = (id: number, address: AddressCreateDTO) => 
  api.put<AddressResponseDTO>(`/addresses/${id}`, address);
export const deleteAddress = (id: number) => api.delete(`/addresses/${id}`);
