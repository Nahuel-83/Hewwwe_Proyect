import axios, { AxiosError } from 'axios';
import { Product, User, Filter, Trade, Review, Category, Notification } from '../types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Auth token management
const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';

export const setAuthToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export const clearAuthToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  delete api.defaults.headers.common['Authorization'];
};

// Initialize token from localStorage
const token = localStorage.getItem(TOKEN_KEY);
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// Auth endpoints
export const login = async (email: string, password: string) => {
  try {
    const response = await api.post<{ user: User; token: string }>('/login', { email, password });
    setAuthToken(response.data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(response.data.user));
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const register = async (userData: {
  username: string;
  email: string;
  password: string;
  name: string;
}) => {
  try {
    const response = await api.post<{ user: User; token: string }>('/users', userData);
    setAuthToken(response.data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(response.data.user));
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const logout = () => {
  clearAuthToken();
};

// Product endpoints
export const getProducts = async (filters?: Filter) => {
  try {
    const response = await api.get<Product[]>('/products', { params: filters });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getProduct = async (id: string) => {
  try {
    const response = await api.get<Product>(`/products/${id}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const createProduct = async (productData: FormData) => {
  try {
    const response = await api.post<Product>('/products', productData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updateProduct = async (id: string, productData: FormData) => {
  try {
    const response = await api.put<Product>(`/products/${id}`, productData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const deleteProduct = async (id: string) => {
  try {
    await api.delete(`/products/${id}`);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Trade endpoints
export const createTradeRequest = async (data: {
  receiverId: number;
  offeredProducts: number[];
  desiredProducts: number[];
}) => {
  try {
    const response = await api.post<Trade>('/trades', data);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updateTradeStatus = async (id: string, status: 'accepted' | 'rejected' | 'cancelled') => {
  try {
    const response = await api.patch<Trade>(`/trades/${id}`, { status });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getUserTrades = async () => {
  try {
    const response = await api.get<Trade[]>('/trades');
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Review endpoints
export const createReview = async (data: {
  reviewedId: number;
  tradeId: number;
  rating: number;
  content: string;
}) => {
  try {
    const response = await api.post<Review>('/reviews', data);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// User endpoints
export const getCurrentUser = () => {
  const userData = localStorage.getItem(USER_KEY);
  return userData ? JSON.parse(userData) : null;
};

export const updateProfile = async (userData: FormData) => {
  try {
    const response = await api.put<User>('/users/profile', userData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    localStorage.setItem(USER_KEY, JSON.stringify(response.data));
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const toggleFavorite = async (productId: string) => {
  try {
    const response = await api.post<{ isFavorited: boolean }>(`/products/${productId}/favorite`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Category endpoints
export const getCategories = async () => {
  try {
    const response = await api.get<Category[]>('/categories');
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Notification endpoints
export const getNotifications = async () => {
  try {
    const response = await api.get<Notification[]>('/notifications');
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const markNotificationAsRead = async (id: string) => {
  try {
    await api.patch(`/notifications/${id}`, { read: true });
  } catch (error) {
    throw handleApiError(error);
  }
};

// Error handling
const handleApiError = (error: unknown) => {
  if (error instanceof AxiosError) {
    if (error.response?.status === 401) {
      clearAuthToken();
    }
    return new Error(error.response?.data?.message || 'An error occurred');
  }
  return new Error('An unexpected error occurred');
};
