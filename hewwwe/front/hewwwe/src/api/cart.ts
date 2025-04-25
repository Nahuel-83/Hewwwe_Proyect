import api from './axios';
import { Cart, Product } from '../types';

export const getCartById = (id: number) => api.get<Cart>(`/carts/${id}`);
export const getUserCart = (userId: number) => api.get<Cart>(`/users/${userId}/cart`);
export const addProductToCart = (cartId: number, productId: number) => 
  api.post<Cart>(`/carts/${cartId}/products/${productId}`);
export const removeProductFromCart = (cartId: number, productId: number) => 
  api.delete(`/carts/${cartId}/products/${productId}`);
