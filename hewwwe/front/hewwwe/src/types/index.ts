export interface Product {
  productId: number;
  name: string;
  description: string;
  price: number;
  image: string;
  size: string;
  status: 'AVAILABLE' | 'SOLD' | 'RESERVED';
  publicationDate: string;
  userId: number;
  user?: {
    name: string;
    email: string;
  };
  categoryId: number;
  category?: {
    name: string;
  };
  cartId?: number;
  exchangeId?: number;
}

export interface Category {
  categoryId: number;
  name: string;
  description: string;
}

export interface User {
  userId: number;
  name: string;
  email: string;
  phone: string;
  role: 'USER' | 'ADMIN';
  registrationDate: string;
  password?: string;
  cart?: Cart;
  addresses?: Address[];
  products?: Product[];
}

export interface Cart {
  cartId: number;
  cartDate: string;
  status: 'ACTIVE' | 'PENDING' | 'COMPLETED';
  userId: number;
  products: Product[];
}

export interface Address {
  addressId: number;
  street: string;
  number: string;
  city: string;
  country: string;
  postalCode: string;
  userId: number;
}

export interface Exchange {
  exchangeId: number;
  status: string;
  requestDate: string;
  ownerId: number;
  requesterId: number;
  products: Product[];
}
