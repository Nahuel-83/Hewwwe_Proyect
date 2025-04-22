import api from './axios';
import { Product, Category, User, Exchange } from '../types';

// Products
export const getAllProducts = () => api.get<Product[]>('/products');
export const getProductById = (id: number) => api.get<Product>(`/products/${id}`);
export const createProduct = (product: Partial<Product>) => api.post<Product>('/products', product);
export const updateProduct = (id: number, product: Partial<Product>) => api.put<Product>(`/products/${id}`, product);
export const deleteProduct = (id: number) => api.delete(`/products/${id}`);
export const searchProducts = (keyword: string) => api.get<Product[]>(`/products/search?keyword=${keyword}`);
export const getProductsByCategory = (categoryId: number) => api.get<Product[]>(`/products/category/${categoryId}`);
export const getProductsByUser = (userId: number) => api.get<Product[]>(`/products/user/${userId}`);

// Categories
export const getAllCategories = () => api.get<Category[]>('/categories');
export const getCategoryById = (id: number) => api.get<Category>(`/categories/${id}`);
export const createCategory = (category: Partial<Category>) => api.post<Category>('/categories', category);
export const updateCategory = (id: number, category: Partial<Category>) => api.put<Category>(`/categories/${id}`, category);
export const deleteCategory = (id: number) => api.delete(`/categories/${id}`);

// Users
export const getAllUsers = () => api.get<User[]>('/users');
export const getUserById = (id: number) => api.get<User>(`/users/${id}`);
export const createUser = (user: Partial<User>) => api.post<User>('/users', user);
export const updateUser = (id: number, user: Partial<User>) => api.put<User>(`/users/${id}`, user);
export const deleteUser = (id: number) => api.delete(`/users/${id}`);

// Exchanges
export const getAllExchanges = () => api.get<Exchange[]>('/exchanges');
export const getExchangeById = (id: number) => api.get<Exchange>(`/exchanges/${id}`);
export const createExchange = (exchange: Partial<Exchange>) => api.post<Exchange>('/exchanges', exchange);
export const updateExchange = (id: number, exchange: Partial<Exchange>) => api.put<Exchange>(`/exchanges/${id}`, exchange);
export const deleteExchange = (id: number) => api.delete(`/exchanges/${id}`);
export const getExchangesByOwner = (userId: number) => api.get<Exchange[]>(`/exchanges/user/${userId}/owned`);
