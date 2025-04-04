import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types/types';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { id, title, price, images, condition, brand, size } = product;

  return (
    <Link to={`/product/${id}`} className="group">
      <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 group-hover:scale-[1.02]">
        <div className="relative">
          <img 
            src={images[0]} 
            alt={title} 
            className="w-full h-48 object-cover" 
          />
          <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded-full text-xs">
            {condition}
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-lg font-domine font-bold group-hover:text-blue-600 transition-colors">
            {title}
          </h3>
          <p className="text-gray-600 text-sm mt-1">{brand} · Size {size}</p>
          <p className="text-lg font-semibold mt-2">
            ${price.toLocaleString()}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
