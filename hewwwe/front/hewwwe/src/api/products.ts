import api from './axios';
 import { Product } from '../types';

export const getAllProducts = () => api.get<Product[]>('/products?expand=user,category');
export const getProductById = (id: number) => api.get<Product>(`/products/${id}?expand=user,category`);
export const createProduct = (product: any) => api.post('/products', product);
export const updateProduct = (id: number, product: any) => api.put(`/products/${id}`, product);
export const deleteProduct = (id: number) => api.delete(`/products/${id}`);
export const searchProducts = (keyword: string) => api.get(`/products/search?keyword=${keyword}`);
export const getProductsByCategory = (categoryId: number) => 
  api.get<Product[]>(`/products/category/${categoryId}?expand=user`);
export const getProductsByUser = (userId: number) => 
  api.get<Product[]>(`/products/user/${userId}?expand=category`);
