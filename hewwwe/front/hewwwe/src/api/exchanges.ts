import api from './axios';
import { Exchange } from '../types';

export const getAllExchanges = () => api.get<Exchange[]>('/api/exchanges');
export const getExchangeById = (id: number) => api.get<Exchange>(`/api/exchanges/${id}`);
export const createExchange = (exchange: Partial<Exchange>) => 
  api.post<Exchange>('/api/exchanges', exchange);
export const updateExchangeStatus = (id: number, status: string) => 
  api.put<Exchange>(`/api/exchanges/${id}/status`, { status });
export const deleteExchange = (id: number) => api.delete(`/api/exchanges/${id}`);
export const getUserExchanges = (userId: number) => 
  api.get<Exchange[]>(`/api/users/${userId}/exchanges`);
