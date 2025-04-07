import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import FilterBar from '../components/FilterBar';
import { Product } from '../types/Product';
import { FilterOptions } from '../types/types';
import { productService } from '../services/product.service';

const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productService.getAllProducts();
        setProducts(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch products');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product: Product) => {
    if (filters.categoryId && product.categoryId !== filters.categoryId) return false;
    if (filters.size && filters.size.length > 0 && !filters.size.includes(product.size)) return false;
    if (filters.status && filters.status.length > 0 && !filters.status.includes(product.status)) return false;
    if (filters.minPrice && product.price < filters.minPrice) return false;
    if (filters.maxPrice && product.price > filters.maxPrice) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }


  return (
    <div>
      <header className="mb-8">
        <h1 className="text-4xl font-domine font-bold mb-4">Discover Unique Style</h1>
        <p className="text-gray-600">Find pre-loved fashion pieces at great prices</p>
        <FilterBar onFilterChange={setFilters} />
      </header>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product: Product) => (
            <ProductCard key={product.productId} product={product} />
          ))}
        </div>
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-600">No products found</h2>
            <p className="text-gray-500 mt-2">Try adjusting your filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
