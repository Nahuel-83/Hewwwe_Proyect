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
  categoryId: number;
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
  username: string;
  email: string;
  password: string;
  role: 'USER' | 'ADMIN';
}

export interface Exchange {
  exchangeId: number;
  status: string;
  requestDate: string;
  ownerId: number;
  requesterId: number;
  products: Product[];
}
