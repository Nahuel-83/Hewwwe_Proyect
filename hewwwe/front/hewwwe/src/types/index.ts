// Entity Interfaces
export interface User {
  userId: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  role: UserRole;
  registrationDate: string;
  isActive: boolean;
  products?: Product[];
  addresses?: Address[];
  cart?: Cart;
}

export interface Product {
  productId: number;
  name: string;
  description: string;
  price: number;
  image: string;
  status: ProductStatus;
  size: string;
  publicationDate: string;
  user: User;
  category: Category;
  exchanges?: Exchange[];
  cart?: Cart;
}

export interface Category {
  categoryId: number;
  name: string;
  description: string;
  products?: Product[];
}

export interface Address {
  addressId: number;
  street: string;
  number: string;
  city: string;
  country: string;
  postalCode: string;
  user?: User;
}

export interface Cart {
  cartId: number;
  cartDate: string;
  status: CartStatus;
  user: User;
  products: Product[];
}

export interface Exchange {
  exchangeId: number;
  exchangeDate: string;
  completionDate?: string;
  status: ExchangeStatus;
  owner: User;
  requester: User;
  products: Product[];
}

export interface Invoice {
  invoiceId: number;
  invoiceDate: string;
  totalAmount: number;
  status: InvoiceStatus;
  type: InvoiceType;
  user: User;
  address: Address;
  products: Product[];
}

// DTOs
export interface UserCreateDTO {
  name: string;
  email: string;
  phone: string;
  username: string;
  password: string;
  address: AddressCreateDTO;
}

export interface UserUpdateDTO {
  name?: string;
  email?: string;
  phone?: string;
  role?: UserRole;
  isActive?: boolean;
}

export interface AddressCreateDTO {
  street: string;
  number: string;
  city: string;
  country: string;
  postalCode: string;
}

export interface ProductCreateDTO {
  name: string;
  description: string;
  price: number;
  image: string;
  size: string;
  categoryId: number;
}

// Enums
export type UserRole = 'USER' | 'ADMIN';
export type ProductStatus = 'AVAILABLE' | 'RESERVED' | 'SOLD' | 'EXCHANGED';
export type CartStatus = 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
export type ExchangeStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED';
export type InvoiceStatus = 'PENDING' | 'PAID' | 'CANCELLED';
export type InvoiceType = 'PURCHASE' | 'EXCHANGE';

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  errors?: string[];
}
