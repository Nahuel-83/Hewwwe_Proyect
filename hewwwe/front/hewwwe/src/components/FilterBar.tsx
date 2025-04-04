import React from 'react';
import { FilterOptions } from '../types/types';

interface FilterBarProps {
  onFilterChange: (filters: FilterOptions) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ onFilterChange }) => {
  const handleCategoryChange = (category: string | undefined) => {
    onFilterChange({ category });
  };

  const categories = [
    'All',
    'Sneakers',
    'Jackets',
    'T-Shirts',
    'Pants',
    'Accessories'
  ];

  return (
    <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
      {categories.map(category => (
        <button
          key={category}
          onClick={() => handleCategoryChange(category === 'All' ? undefined : category)}
          className="px-4 py-2 rounded-full bg-white shadow-sm hover:shadow-md transition-shadow
                   focus:outline-none focus:ring-2 focus:ring-blue-500 whitespace-nowrap"
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default FilterBar;
