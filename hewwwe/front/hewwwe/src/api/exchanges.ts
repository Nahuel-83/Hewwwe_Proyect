import api from './axios';
import { Exchange } from '../types';
import { ExchangeResponseDTO } from '../types/dtos';

export const getAllExchanges = () => api.get<ExchangeResponseDTO[]>('/exchanges');
export const getExchangeById = (id: number) => api.get<Exchange>(`/exchanges/${id}`);
export const createExchange = (exchange: Partial<Exchange>) => 
  api.post<Exchange>('/exchanges', exchange);
export const updateExchangeStatus = (id: number, status: string) => 
  api.put<Exchange>(`/exchanges/${id}/status`, { status });
export const getUserExchanges = (userId: number) => 
  api.get<Exchange[]>(`/users/${userId}/exchanges`);
export const deleteExchange = (id: number) => api.delete(`/exchanges/${id}`);
