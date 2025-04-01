import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiHeart } from 'react-icons/fi';
import { Product } from '../types';

// This would normally come from an API
const mockFavorites: Product[] = [
  {
    id: '1',
    title: 'Nike Running Shoes',
    description: 'Comfortable running shoes in great condition',
    price: 45.99,
    images: ['https://via.placeholder.com/300'],
    size: '42',
    condition: 'good',
    brand: 'Nike',
    category: 'shoes',
    seller: {
      id: '1',
      username: 'john_doe',
      email: 'john@example.com',
      rating: 4.5,
      joinedDate: new Date('2024-01-01'),
    },
    createdAt: new Date(),
    status: 'available',
  },
  // Add more mock favorites as needed
];

const Favorites = () => {
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const fetchFavorites = async () => {
      try {
        // This would be an API call in a real application
        setFavorites(mockFavorites);
      } catch (error) {
        console.error('Error fetching favorites:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const removeFavorite = (productId: string) => {
    // This would be an API call in a real application
    setFavorites((prev) => prev.filter((item) => item.id !== productId));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="text-center py-12">
        <FiHeart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-domine text-gray-900 mb-4">
          No favorites yet
        </h2>
        <p className="text-gray-600 mb-8">
          Start adding items to your favorites to keep track of what you like.
        </p>
        <Link to="/" className="btn-primary">
          Discover Items
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-domine font-bold text-gray-900 mb-6">
        My Favorites
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {favorites.map((product) => (
          <div key={product.id} className="group relative">
            <Link to={`/product/${product.id}`}>
              <div className="card overflow-hidden">
                <div className="aspect-w-1 aspect-h-1 w-full">
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 truncate">
                    {product.title}
                  </h3>
                  <p className="text-primary-600 font-semibold mt-1">
                    ${product.price.toFixed(2)}
                  </p>
                  <div className="flex items-center mt-1 text-sm text-gray-500">
                    <span className="capitalize">{product.condition}</span>
                    <span className="mx-2">•</span>
                    <span>{product.size}</span>
                  </div>
                </div>
              </div>
            </Link>
            <button
              onClick={() => removeFavorite(product.id)}
              className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors duration-200"
            >
              <FiHeart className="w-5 h-5 text-primary-600" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Favorites;
