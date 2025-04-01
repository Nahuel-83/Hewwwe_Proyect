export interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  avatar?: string;
  rating: number;
  favorites: number[];
  uploadedProducts: number[];
  location: string;
  joinedDate: string;
  bio: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  images: string[];
  category: string;
  condition: 'new' | 'like new' | 'good' | 'fair';
  size: string;
  brand: string;
  ownerId: number;
  status: 'available' | 'sold' | 'reserved';
  views: number;
  favorites: number;
  createdAt: string;
  updatedAt: string;
  tags: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string;
}

export interface Filter {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  size?: string[];
  condition?: string[];
  brand?: string[];
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'popular';
}

export interface Trade {
  id: number;
  requesterId: number;
  receiverId: number;
  offeredProducts: number[];
  desiredProducts: number[];
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  messages: TradeMessage[];
}

export interface TradeMessage {
  id: number;
  userId: number;
  content: string;
  createdAt: string;
}

export interface Review {
  id: number;
  reviewerId: number;
  reviewedId: number;
  tradeId: number;
  rating: number;
  content: string;
  createdAt: string;
}

export interface Notification {
  id: number;
  userId: number;
  type: 'trade_request' | 'trade_accepted' | 'trade_rejected' | 'new_message' | 'new_review';
  content: string;
  read: boolean;
  relatedId: number;
  createdAt: string;
}
