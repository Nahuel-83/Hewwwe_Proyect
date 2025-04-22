import api from './axios';

export const getAllCategories = () => api.get('/categories');
export const getCategoryById = (id: number) => api.get(`/categories/${id}`);
export const createCategory = (category: any) => api.post('/categories', category);
export const updateCategory = (id: number, category: any) => api.put(`/categories/${id}`, category);
export const deleteCategory = (id: number) => api.delete(`/categories/${id}`);
export const getCategoryProducts = (id: number) => api.get(`/categories/${id}/products`);
