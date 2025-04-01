import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FiHeart, FiMessageCircle } from 'react-icons/fi';
import { Product } from '../types';
import { getProduct } from '../services/api';
import { useApp } from '../context/AppContext';

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const { dispatch } = useApp();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (id) {
          const response = await getProduct(id);
          setProduct(response.data);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      dispatch({
        type: 'ADD_TO_CART',
        payload: {
          id: crypto.randomUUID(),
          product,
          quantity: 1,
        },
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-domine text-gray-900">Product not found</h2>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-w-1 aspect-h-1 w-full rounded-lg overflow-hidden">
            <img
              src={product.images[selectedImage]}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`aspect-w-1 aspect-h-1 rounded-md overflow-hidden ${
                  selectedImage === index
                    ? 'ring-2 ring-primary-500'
                    : 'ring-1 ring-gray-200'
                }`}
              >
                <img
                  src={image}
                  alt={`Product ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-domine font-bold text-gray-900">
              {product.title}
            </h1>
            <p className="text-3xl font-semibold text-primary-600 mt-2">
              ${product.price.toFixed(2)}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm">
              <span className="text-gray-500">Condition:</span>
              <span className="font-medium capitalize">{product.condition}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <span className="text-gray-500">Size:</span>
              <span className="font-medium">{product.size}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <span className="text-gray-500">Brand:</span>
              <span className="font-medium">{product.brand}</span>
            </div>
          </div>

          <div>
            <h2 className="font-medium text-gray-900">Description</h2>
            <p className="mt-2 text-gray-600">{product.description}</p>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={handleAddToCart}
              className="btn-primary flex-1"
            >
              Add to Cart
            </button>
            <button className="btn-secondary p-3">
              <FiHeart className="w-5 h-5" />
            </button>
          </div>

          {/* Seller Info */}
          <div className="border-t pt-6">
            <div className="flex items-center space-x-4">
              <img
                src={product.seller.avatar || 'https://via.placeholder.com/40'}
                alt={product.seller.username}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="font-medium text-gray-900">
                  {product.seller.username}
                </p>
                <div className="flex items-center space-x-1 text-sm text-gray-500">
                  <span>⭐ {product.seller.rating.toFixed(1)}</span>
                  <span>•</span>
                  <span>
                    Joined{' '}
                    {new Date(product.seller.joinedDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
            <button className="w-full btn-secondary mt-4 flex items-center justify-center space-x-2">
              <FiMessageCircle />
              <span>Message Seller</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
