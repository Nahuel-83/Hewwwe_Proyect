export interface Product {
  productId: number;
  name: string;
  description: string;
  price: number;
  image: string;
  size: string;
  status: string;
  publicationDate: string;
  userId: number;
  categoryId: number;
  cartId?: number;
  exchangeId?: number;
}