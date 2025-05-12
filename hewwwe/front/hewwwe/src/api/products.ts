import api from './axios';
import type { Product } from '../types';

export const getAllProducts = () => api.get<Product[]>('/api/products');
export const getAllProductsForAdmin = () => api.get<Product[]>('/api/products/admin/all');
export const getProductById = (id: number) => api.get<Product>(`/api/products/${id}`);
export const createProduct = (product: Partial<Product>) => api.post<Product>('/api/products', product);
export const updateProduct = (id: number, product: Partial<Product>) => api.put<Product>(`/api/products/${id}`, product);
export const deleteProduct = (id: number) => api.delete(`/api/products/${id}`);
export const searchProducts = (query: string) => api.get<Product[]>(`/api/products/search?keyword=${encodeURIComponent(query)}`);
