import { apiService } from './api.service';
import { API_ENDPOINTS } from '../config/api.config';
import { Product } from '../types/Product';

export class ProductService {
  public async getAllProducts(): Promise<Product[]> {
    return apiService.get<Product[]>(API_ENDPOINTS.PRODUCTS);
  }

  public async getProductById(id: number): Promise<Product> {
    return apiService.get<Product>(API_ENDPOINTS.PRODUCT_BY_ID(id));
  }

  public async createProduct(product: Omit<Product, 'id'>): Promise<Product> {
    return apiService.post<Product>(API_ENDPOINTS.PRODUCTS, product);
  }

  public async updateProduct(id: number, product: Partial<Product>): Promise<Product> {
    return apiService.put<Product>(API_ENDPOINTS.PRODUCT_BY_ID(id), product);
  }

  public async deleteProduct(id: number): Promise<void> {
    return apiService.delete(API_ENDPOINTS.PRODUCT_BY_ID(id));
  }
}

export const productService = new ProductService();
