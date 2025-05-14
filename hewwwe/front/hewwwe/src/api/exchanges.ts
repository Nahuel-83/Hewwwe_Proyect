import api from './axios';
import type { Exchange } from '../types';

export const getAllExchanges = () => api.get<Exchange[]>('/api/exchanges');
export const getExchangeById = (exchangeId: number) => api.get<Exchange>(`/api/exchanges/${exchangeId}`);
export const createExchange = (exchange: Partial<Exchange>) => 
  api.post<Exchange>('/api/exchanges', exchange);
export const updateExchangeStatus = (id: number, status: string) => 
  api.put<Exchange>(`/api/exchanges/${id}/status`, { status });
export const deleteExchange = (id: number) => api.delete(`/api/exchanges/${id}`);
export const getUserExchanges = (userId: number) => api.get<Exchange[]>(`/api/exchanges/user/${userId}`);

export const proposeExchange = (
  ownerId: number,    // Usuario dueño del producto deseado
  requesterId: number, // Usuario que solicita el intercambio
  ownerProductId: number, // Producto que el solicitante desea obtener
  requesterProductId: number // Producto que el solicitante ofrece a cambio
) => api.post<Exchange>('/api/exchanges', {
  ownerId,
  requesterId,
  ownerProductId,
  requesterProductId
});

export const acceptExchange = (exchangeId: number) => 
  api.put<Exchange>(`/api/exchanges/${exchangeId}/accept`);

export const rejectExchange = (exchangeId: number) => 
  api.put<Exchange>(`/api/exchanges/${exchangeId}/reject`);

export const cancelExchange = (exchangeId: number) => 
  api.delete(`/api/exchanges/${exchangeId}`);
