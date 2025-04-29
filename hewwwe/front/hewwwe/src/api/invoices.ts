import api from './axios';
import { Invoice } from '../types';

export const getAllInvoices = () => api.get<Invoice[]>('/invoices');
export const getInvoiceById = (id: number) => api.get<Invoice>(`/invoices/${id}`);
export const getUserInvoices = (userId: number) => api.get<Invoice[]>(`/users/${userId}/invoices`);
export const downloadInvoice = (invoiceId: number) => 
  api.get(`/invoices/${invoiceId}/download`, { responseType: 'blob' })
    .then(response => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${invoiceId}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });

export const createInvoice = (invoice: Omit<Invoice, 'invoiceId'>) => 
  api.post<Invoice>('/invoices', invoice);

export const updateInvoiceStatus = (id: number, status: 'PENDING' | 'PAID' | 'CANCELLED') => 
  api.patch<Invoice>(`/invoices/${id}/status`, { status });
