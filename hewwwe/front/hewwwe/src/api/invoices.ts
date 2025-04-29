import api from './axios';
import { Invoice } from '../types';

export const getAllInvoices = () => api.get<Invoice[]>('/api/invoices');
export const getInvoiceById = (id: number) => api.get<Invoice>(`/api/invoices/${id}`);
export const createInvoice = (invoice: Partial<Invoice>) => api.post<Invoice>('/api/invoices', invoice);
export const updateInvoice = (id: number, invoice: Partial<Invoice>) => api.put<Invoice>(`/api/invoices/${id}`, invoice);
export const deleteInvoice = (id: number) => api.delete(`/api/invoices/${id}`);
export const downloadInvoice = (id: number) => api.get<Blob>(`/api/invoices/${id}/pdf`, {
  responseType: 'blob'
});
export const getUserInvoices = (userId: number) => api.get<Invoice[]>(`/api/users/${userId}/invoices`);
