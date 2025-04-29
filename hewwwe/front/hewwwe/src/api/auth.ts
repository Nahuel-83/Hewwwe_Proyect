import api from './axios';
import type { User } from '../types';

export interface LoginRequest {
  nameOrEmail: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  data: User;
  message: string;
}

export const login = (credentials: LoginRequest) => 
  api.post<LoginResponse>('/api/auth/login', credentials);
