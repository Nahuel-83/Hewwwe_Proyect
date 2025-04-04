import { Product, User } from '../types/types';

// Mock Products
export const products: Product[] = [
  {
    id: '1',
    title: 'Nike Air Max 90',
    description: 'Classic Nike sneakers in excellent condition',
    price: 120,
    brand: 'Nike',
    size: '42',
    condition: 'Used - Excellent',
    images: [
      'https://via.placeholder.com/400x300?text=Nike+Air+Max+90',
      'https://via.placeholder.com/400x300?text=Nike+Air+Max+90+Side',
    ],
    category: 'Sneakers',
    sellerId: '1',
    createdAt: new Date('2025-04-01').toISOString(),
    status: 'available',
    exchangePreferences: ['Jordan', 'Adidas'],
  },
  {
    id: '2',
    title: 'Vintage Levi\'s Denim Jacket',
    description: 'Original Levi\'s jacket from the 90s',
    price: 85,
    brand: 'Levi\'s',
    size: 'L',
    condition: 'Used - Good',
    images: [
      'https://via.placeholder.com/400x300?text=Levis+Jacket',
      'https://via.placeholder.com/400x300?text=Levis+Jacket+Back',
    ],
    category: 'Jackets',
    sellerId: '2',
    createdAt: new Date('2025-04-02').toISOString(),
    status: 'available',
    exchangePreferences: ['Denim', 'Vintage'],
  },
];

// Mock Users
export const users: User[] = [
  {
    id: '1',
    email: 'john@example.com',
    name: 'John Doe',
    password: 'password123', // In a real app, this would be hashed
    location: 'New York',
    createdAt: new Date('2025-01-01').toISOString(),
    photoURL: 'https://via.placeholder.com/150?text=John',
    rating: 4.5,
  },
  {
    id: '2',
    email: 'jane@example.com',
    name: 'Jane Smith',
    password: 'password123',
    location: 'Los Angeles',
    createdAt: new Date('2025-01-02').toISOString(),
    photoURL: 'https://via.placeholder.com/150?text=Jane',
    rating: 4.8,
  },
];

// Helper functions to interact with localStorage
export const saveProducts = () => {
  localStorage.setItem('products', JSON.stringify(products));
};

export const loadProducts = (): Product[] => {
  const savedProducts = localStorage.getItem('products');
  return savedProducts ? JSON.parse(savedProducts) : products;
};

export const saveUsers = () => {
  localStorage.setItem('users', JSON.stringify(users));
};

export const loadUsers = (): User[] => {
  const savedUsers = localStorage.getItem('users');
  return savedUsers ? JSON.parse(savedUsers) : users;
};

// Initialize localStorage with mock data if empty
export const initializeMockData = () => {
  if (!localStorage.getItem('products')) {
    saveProducts();
  }
  if (!localStorage.getItem('users')) {
    saveUsers();
  }
};
