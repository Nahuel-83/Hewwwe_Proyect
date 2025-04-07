import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Product as ProductType } from '../types/Product';
import { productService } from '../services/product.service';

const Product: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<ProductType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (!id) throw new Error('Product ID is required');
        const data = await productService.getProductById(parseInt(id, 10));
        setProduct(data);
      } catch (err) {
        setError('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-electric-blue"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500">{error || 'Product not found'}</p>
      </div>
    );
  }

  return (
    <div className="p-6 flex flex-col md:flex-row gap-6">
      <img 
        src={product.image} 
        alt={product.name} 
        className="w-full md:w-1/2 object-cover rounded shadow-lg"
      />
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-3xl font-domine font-bold mb-2">{product.name}</h1>
          <p className="text-xl font-nunito text-electric-blue font-semibold">
            ${product.price.toLocaleString()}
          </p>
        </div>

        <div className="space-y-2">
          <p className="font-nunito text-gray-700">{product.description}</p>
          <div className="flex gap-4 text-sm text-gray-600">
            <span>Size: {product.size}</span>
            <span>Status: {product.status}</span>
          </div>
        </div>

        <button className="bg-electric-blue hover:bg-neon-pink transition-colors duration-300 text-white px-6 py-3 rounded-lg font-nunito font-semibold mt-4">
          Buy Now
        </button>
      </div>
    </div>
  );
};

export default Product;
