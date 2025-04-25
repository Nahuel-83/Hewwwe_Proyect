export interface Product {
  productId: number;
  name: string;
  description: string;
  price: number;
  image: string;
  size: string;
  status: string;
  publicationDate: string;
  user: {
    userId: number;
    name: string;
    email?: string;
  };
  cart?: {
    cartId: number;
    status: string;
  };
  category: {
    categoryId: number;
    name: string;
  };
}

export interface User {
  userId: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  registrationDate: string;
  products: {
    productId: number;
    name: string;
    price: number;
    status: string;
  }[];
  addresses?: Address[];
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
  user?: {
    userId: number;
    name: string;
  };
}

export interface Cart {
  cartId: number;
  cartDate: string;
  status: string;
  user: {
    userId: number;
    name: string;
  };
  products: Product[];
}

export interface Exchange {
  exchangeId: number;
  status: string;
  requestDate: string;
  owner: {
    userId: number;
    name: string;
  };
  requester: {
    userId: number;
    name: string;
  };
  products: Product[];
}
