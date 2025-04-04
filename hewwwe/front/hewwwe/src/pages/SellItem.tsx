import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CONDITIONS = ['New', 'Like New', 'Good', 'Acceptable'] as const;
type Condition = typeof CONDITIONS[number];

const CATEGORIES = ['Sneakers', 'T-Shirts', 'Hoodies', 'Pants', 'Jackets'] as const;
type Category = typeof CATEGORIES[number];

const SellItem: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const itemData = {
      title: formData.get('title'),
      description: formData.get('description'),
      price: parseFloat(formData.get('price') as string),
      category: formData.get('category'),
      condition: formData.get('condition'),
      size: formData.get('size'),
      brand: formData.get('brand'),
      acceptsExchange: formData.get('acceptsExchange') === 'true',
    };

    try {
      // TODO: Implement API call to create item
      console.log('Item data:', itemData);
      navigate('/');
    } catch (err) {
      setError('Failed to create listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-domine font-bold mb-8">Create New Listing</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow rounded-lg p-6">
        <div>
          <label htmlFor="title" className="block text-sm font-semibold mb-1">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-semibold mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            required
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="price" className="block text-sm font-semibold mb-1">
              Price (€)
            </label>
            <input
              type="number"
              id="price"
              name="price"
              min="0"
              step="0.01"
              required
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label htmlFor="brand" className="block text-sm font-semibold mb-1">
              Brand
            </label>
            <input
              type="text"
              id="brand"
              name="brand"
              required
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="category" className="block text-sm font-semibold mb-1">
              Category
            </label>
            <select
              id="category"
              name="category"
              required
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select category</option>
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="condition" className="block text-sm font-semibold mb-1">
              Condition
            </label>
            <select
              id="condition"
              name="condition"
              required
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select condition</option>
              {CONDITIONS.map((condition) => (
                <option key={condition} value={condition}>
                  {condition}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="size" className="block text-sm font-semibold mb-1">
            Size
          </label>
          <input
            type="text"
            id="size"
            name="size"
            required
            placeholder="e.g., M, L, 42, 9.5"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="acceptsExchange"
              value="true"
              className="rounded text-green-500 focus:ring-green-500"
            />
            <span className="text-sm font-semibold">Accept exchanges</span>
          </label>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Photos</label>
          <div className="border-2 border-dashed border-gray-300 rounded p-4 text-center">
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              id="photos"
              name="photos"
            />
            <label
              htmlFor="photos"
              className="cursor-pointer text-gray-600 hover:text-green-500"
            >
              Click to upload photos
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 disabled:opacity-50"
        >
          {loading ? 'Creating Listing...' : 'Create Listing'}
        </button>
      </form>
    </div>
  );
};

export default SellItem;
