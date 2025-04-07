import React, { useState } from 'react';
import { FilterOptions } from '../types/types';

interface FilterBarProps {
  onFilterChange: (filters: FilterOptions) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ onFilterChange }) => {
  const [filters, setFilters] = useState<FilterOptions>({});

  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const categories = [
    { id: 0, name: 'All' },
    { id: 1, name: 'Sneakers' },
    { id: 2, name: 'Jackets' },
    { id: 3, name: 'T-Shirts' },
    { id: 4, name: 'Pants' },
    { id: 5, name: 'Accessories' }
  ];

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const statuses = ['New', 'Like New', 'Good', 'Fair'];

  return (
    <div className="space-y-4">
      {/* Categories */}
      <div className="flex gap-4 overflow-x-auto pb-2">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => handleFilterChange('categoryId', category.name === 'All' ? undefined : category.id)}
            className={`px-4 py-2 rounded-full shadow-sm transition-all whitespace-nowrap
              ${filters.categoryId === category.id ? 'bg-blue-500 text-white' : 'bg-white hover:bg-gray-50'}`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Sizes */}
      <div className="flex gap-2 flex-wrap">
        {sizes.map(size => (
          <button
            key={size}
            onClick={() => {
              const currentSizes = filters.size || [];
              const newSizes = currentSizes.includes(size)
                ? currentSizes.filter(s => s !== size)
                : [...currentSizes, size];
              handleFilterChange('size', newSizes);
            }}
            className={`px-3 py-1 rounded-full text-sm shadow-sm transition-all
              ${(filters.size || []).includes(size) ? 'bg-blue-500 text-white' : 'bg-white hover:bg-gray-50'}`}
          >
            {size}
          </button>
        ))}
      </div>

      {/* Status */}
      <div className="flex gap-2 flex-wrap">
        {statuses.map(status => (
          <button
            key={status}
            onClick={() => {
              const currentStatuses = filters.status || [];
              const newStatuses = currentStatuses.includes(status)
                ? currentStatuses.filter(s => s !== status)
                : [...currentStatuses, status];
              handleFilterChange('status', newStatuses);
            }}
            className={`px-3 py-1 rounded-full text-sm shadow-sm transition-all
              ${(filters.status || []).includes(status) ? 'bg-blue-500 text-white' : 'bg-white hover:bg-gray-50'}`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Price Range */}
      <div className="flex gap-4">
        <input
          type="number"
          placeholder="Min Price"
          className="px-3 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => handleFilterChange('minPrice', e.target.value ? Number(e.target.value) : undefined)}
        />
        <input
          type="number"
          placeholder="Max Price"
          className="px-3 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => handleFilterChange('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
        />
      </div>
    </div>
  );
};

export default FilterBar;
