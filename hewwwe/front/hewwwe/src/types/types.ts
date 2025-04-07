export interface User {
  id: string;
  email: string;
  name: string;
  password: string;
  location: string;
  photoURL?: string;
  createdAt: string;
  rating: number;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  brand: string;
  size: string;
  condition: 'New' | 'Used - Like New' | 'Used - Excellent' | 'Used - Good' | 'Used - Fair';
  images: string[];
  category: string;
  sellerId: string;
  createdAt: string;
  status: 'available' | 'sold' | 'reserved';
  exchangePreferences?: string[];
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface Review {
  id: string;
  userId: string;
  targetId: string; // Can be a user ID or product ID
  rating: number;
  comment: string;
  createdAt: string;
  type: 'user' | 'product';
}

export interface FilterOptions {
  categoryId?: number;
  size?: string[];
  status?: string[];
  minPrice?: number;
  maxPrice?: number;
}
