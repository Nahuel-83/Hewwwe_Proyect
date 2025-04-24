import api from './axios';
import { Category, Product } from '../types';

export const getAllCategories = () => api.get<Category[]>('/categories');
export const getCategoryById = (id: number) => api.get<Category>(`/categories/${id}`);
export const createCategory = (category: Partial<Category>) => api.post<Category>('/categories', category);
export const updateCategory = (id: number, category: Partial<Category>) => api.put<Category>(`/categories/${id}`, category);
export const deleteCategory = (id: number) => api.delete(`/categories/${id}`);
export const getCategoryProducts = (id: number) => api.get<Product[]>(`/categories/${id}/products`);
