import api from './axios';

export const getAllCarts = () => api.get('/carts');
export const getCartById = (id: number) => api.get(`/carts/${id}`);
export const createCart = (cart: any) => api.post('/carts', cart);
export const updateCart = (id: number, cart: any) => api.put(`/carts/${id}`, cart);
export const deleteCart = (id: number) => api.delete(`/carts/${id}`);
export const addProductToCart = (cartId: number, productId: number) => 
  api.post(`/carts/${cartId}/products/${productId}`);
export const removeProductFromCart = (cartId: number, productId: number) => 
  api.delete(`/carts/${cartId}/products/${productId}`);
