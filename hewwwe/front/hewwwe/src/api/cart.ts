import api from './axios';
import { Cart } from '../types';

export const getAllCarts = () => api.get<Cart[]>('/carts');
export const getCartById = (id: number) => api.get<Cart>(`/carts/${id}`);
export const createCart = (cart: Partial<Cart>) => api.post<Cart>('/carts', cart);
export const updateCart = (id: number, cart: Partial<Cart>) => api.put<Cart>(`/carts/${id}`, cart);
export const deleteCart = (id: number) => api.delete(`/carts/${id}`);

export const addProductToCart = (cartId: number, productId: number) => 
  api.post(`/carts/${cartId}/products/${productId}`);
export const removeProductFromCart = (cartId: number, productId: number) => 
  api.delete(`/carts/${cartId}/products/${productId}`);
