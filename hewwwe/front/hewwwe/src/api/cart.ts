import api from './axios';
import { Cart, CartResponseDTO } from '../types';

// Cart API endpoints
export const getUserCart = (userId: number) => api.get<CartResponseDTO>(`/api/carts/user/${userId}`);
export const addToCart = (userId: number, productId: number) => api.post<CartResponseDTO>(`/api/carts/user/${userId}/products/${productId}`);
export const removeFromCart = (userId: number, productId: number) => api.delete<CartResponseDTO>(`/api/carts/user/${userId}/products/${productId}`);
export const clearCart = (userId: number) => api.delete(`/api/carts/user/${userId}/clear`);

// Checkout endpoint
export const checkout = (userId: number, checkoutData: { addressId: number }) => {
  return api.post(`/api/carts/user/${userId}/checkout`, checkoutData);
};

// Admin endpoints
export const getAllCarts = () => api.get<Cart[]>('/api/carts/all');
export const deleteCart = (cartId: number) => api.delete(`/api/carts/${cartId}`);
