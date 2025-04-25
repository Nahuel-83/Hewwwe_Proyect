import api from './axios';
import { Product } from '../types';
import { ProductResponseDTO } from '../types/dtos';

const mapDTOToProduct = (dto: ProductResponseDTO): Product => ({
  productId: dto.productId,
  name: dto.name,
  description: dto.description,
  price: dto.price,
  image: dto.image,
  size: dto.size,
  status: dto.status,
  publicationDate: dto.publicationDate,
  user: {
    userId: dto.userId,
    name: dto.userName,
    email: dto.userEmail
  },
  category: {
    categoryId: dto.categoryId,
    name: dto.categoryName
  }
});

// Updated endpoints without duplicate 'api'
export const getAllProducts = async () => {
  const response = await api.get<ProductResponseDTO[]>('/products');
  return {
    ...response,
    data: response.data.map(mapDTOToProduct)
  };
};

export const getProductById = async (id: number) => {
  const response = await api.get<ProductResponseDTO>(`/products/${id}`);
  return {
    ...response,
    data: mapDTOToProduct(response.data)
  };
};

// Fix other endpoints similarly
export const createProduct = (product: Partial<Product>) => 
  api.post<ProductResponseDTO>('/products', product);

export const updateProduct = (id: number, product: Partial<Product>) => 
  api.put<ProductResponseDTO>(`/products/${id}`, product);

export const deleteProduct = (id: number) => 
  api.delete(`/products/${id}`);

export const searchProducts = (query: string) => 
  api.get<ProductResponseDTO[]>(`/products/search?keyword=${encodeURIComponent(query)}`);
