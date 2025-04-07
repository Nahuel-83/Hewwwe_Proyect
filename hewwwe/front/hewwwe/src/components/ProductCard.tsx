import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types/Product';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <Link to={`/product/${product.productId}`} className="group">
      <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 group-hover:scale-[1.02]">
        <div className="relative">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-48 object-cover" 
          />
          <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded-full text-xs">
            {product.status}
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-lg font-domine font-bold group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
          <p className="text-gray-600 text-sm mt-1">{product.description}</p>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold">${product.price.toLocaleString()}</span>
              <span className="text-sm text-gray-500">Size: {product.size}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
