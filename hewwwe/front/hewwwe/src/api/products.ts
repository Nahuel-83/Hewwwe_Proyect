import api from './axios';

export const getAllProducts = () => api.get('/products');
export const getProductById = (id: number) => api.get(`/products/${id}`);
export const createProduct = (product: any) => api.post('/products', product);
export const updateProduct = (id: number, product: any) => api.put(`/products/${id}`, product);
export const deleteProduct = (id: number) => api.delete(`/products/${id}`);
export const searchProducts = (keyword: string) => api.get(`/products/search?keyword=${keyword}`);
export const getProductsByCategory = (categoryId: number) => api.get(`/products/category/${categoryId}`);
export const getProductsByUser = (userId: number) => api.get(`/products/user/${userId}`);
