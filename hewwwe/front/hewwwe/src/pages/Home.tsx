import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiFilter, FiX } from 'react-icons/fi';
import { Product, Filter } from '../types';
import { getProducts } from '../services/api';

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<Filter>({});

  const categories = [
    'All',
    'Women',
    'Men',
    'Kids',
    'Accessories',
    'Shoes',
  ];

  const conditions = ['new', 'like new', 'good', 'fair'];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts(filters);
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters]);

  const handleFilterChange = (key: keyof Filter, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Filters - Mobile Toggle */}
      <button
        className="md:hidden flex items-center gap-2 text-gray-600 mb-4"
        onClick={() => setShowFilters(!showFilters)}
      >
        {showFilters ? <FiX size={20} /> : <FiFilter size={20} />}
        {showFilters ? 'Close Filters' : 'Show Filters'}
      </button>

      {/* Filters - Desktop */}
      <aside className={`${showFilters ? 'block' : 'hidden'} md:block w-64 space-y-6`}>
        <div className="bg-white rounded-lg shadow-sm p-4 space-y-4">
          <h2 className="font-domine text-xl font-semibold">Filters</h2>
          
          {/* Categories */}
          <div>
            <h3 className="font-semibold mb-2">Category</h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <label key={category} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="category"
                    value={category.toLowerCase()}
                    checked={filters.category === category.toLowerCase()}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="text-blue-500"
                  />
                  {category}
                </label>
              ))}
            </div>
          </div>

          {/* Condition */}
          <div>
            <h3 className="font-semibold mb-2">Condition</h3>
            <div className="space-y-2">
              {conditions.map((condition) => (
                <label key={condition} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    value={condition}
                    checked={filters.condition?.includes(condition)}
                    onChange={(e) => {
                      const current = filters.condition || [];
                      const value = e.target.value;
                      handleFilterChange(
                        'condition',
                        current.includes(value)
                          ? current.filter((c) => c !== value)
                          : [...current, value]
                      );
                    }}
                    className="text-blue-500"
                  />
                  {condition.charAt(0).toUpperCase() + condition.slice(1)}
                </label>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <h3 className="font-semibold mb-2">Price Range</h3>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min"
                value={filters.minPrice || ''}
                onChange={(e) => handleFilterChange('minPrice', e.target.value ? Number(e.target.value) : undefined)}
                className="w-full px-3 py-2 border rounded-md"
              />
              <input
                type="number"
                placeholder="Max"
                value={filters.maxPrice || ''}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
          </div>
        </div>
      </aside>

      {/* Product Grid */}
      <div className="flex-1">
        {products.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-domine mb-2">No products found</h2>
            <p className="text-gray-600">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                className="group bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="aspect-w-1 aspect-h-1">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:opacity-75 transition-opacity"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-domine text-lg font-semibold truncate">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-2">{product.brand}</p>
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-semibold">${product.price}</span>
                      {product.originalPrice > product.price && (
                        <span className="text-sm text-gray-500 line-through ml-2">
                          ${product.originalPrice}
                        </span>
                      )}
                    </div>
                    <span className="text-sm text-gray-500 capitalize">{product.condition}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
