import api from './axios';
import { Category, Product } from '../types';

export const getAllCategories = () => api.get<Category[]>('/api/categories');
export const getCategoryById = (id: number) => api.get<Category>(`/api/categories/${id}`);
export const createCategory = (category: Partial<Category>) => api.post<Category>('/api/categories', category);
export const updateCategory = (id: number, category: Partial<Category>) => api.put<Category>(`/api/categories/${id}`, category);
export const deleteCategory = (id: number) => api.delete(`/api/categories/${id}`);
export const getCategoryProducts = (id: number) => api.get<Product[]>(`/api/categories/${id}/products`);
