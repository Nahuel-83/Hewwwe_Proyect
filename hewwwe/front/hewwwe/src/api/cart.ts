import api from './axios';
import { Cart } from '../types';

export const getUserCart = (userId: number) => api.get<Cart>(`/api/users/${userId}/cart`);
export const addToCart = (productId: number) => api.post<Cart>('/api/cart', { productId });
export const updateCartItem = (id: number, quantity: number) => api.put<Cart>(`/api/cart/${id}`, { quantity });
export const removeFromCart = (id: number) => api.delete(`/api/cart/${id}`);
export const clearCart = () => api.delete('/api/cart');
