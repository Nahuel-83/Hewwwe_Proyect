import api from './axios';

export const getAllExchanges = () => api.get('/exchanges');
export const getExchangeById = (id: number) => api.get(`/exchanges/${id}`);
export const createExchange = (exchange: any) => api.post('/exchanges', exchange);
export const updateExchange = (id: number, exchange: any) => api.put(`/exchanges/${id}`, exchange);
export const deleteExchange = (id: number) => api.delete(`/exchanges/${id}`);
export const getExchangesByRequesterId = (userId: number) => api.get(`/exchanges/user/${userId}/requested`);
export const getExchangesByOwnerId = (userId: number) => api.get(`/exchanges/user/${userId}/owned`);
export const getExchangeProducts = (id: number) => api.get(`/exchanges/${id}/products`);
export const updateExchangeStatus = (id: number, status: string) => 
  api.put(`/exchanges/${id}/status`, null, { params: { status } });
