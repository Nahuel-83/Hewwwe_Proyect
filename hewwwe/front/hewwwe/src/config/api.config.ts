export const API_BASE_URL = 'http://localhost:8080';

export const API_ENDPOINTS = {
  // Products
  PRODUCTS: '/api/products',
  PRODUCT_BY_ID: (id: number) => `/api/products/${id}`,
  
  // Categories
  CATEGORIES: '/api/categories',
  CATEGORY_BY_ID: (id: number) => `/api/categories/${id}`,
  
  // Users
  USERS: '/api/users',
  USER_BY_ID: (id: number) => `/api/users/${id}`,
  
  // Cart
  CART: '/api/cart',
  
  // Exchange
  EXCHANGES: '/api/exchanges',
  EXCHANGE_BY_ID: (id: number) => `/api/exchanges/${id}`,
  
};
