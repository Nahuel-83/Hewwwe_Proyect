import api from './axios';
import type { User } from '../types';

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  name: string;
  phone: string;
  address: {
    street: string;
    number: string;
    city: string;
    country: string;
    postalCode: string;
  };
}

interface RegisterResponse {
  success: boolean;
  user: User;
  message: string;
}

export const register = (userData: RegisterRequest) => 
  api.post<RegisterResponse>('/api/auth/register', userData);
