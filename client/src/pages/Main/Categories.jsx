import React from 'react';
import CategoryGrid from '../../components/categories/CategoryGrid';
import { Layers } from 'lucide-react';

const Categories = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 pb-24 md:pb-8">
      <div className="mb-8 text-center sm:text-left">
        <h1 className="text-3xl font-black text-gray-900 flex items-center justify-center sm:justify-start gap-3">
          <Layers className="text-blue-600" /> Browse Categories
        </h1>
        <p className="text-gray-500 mt-2 max-w-2xl">
          Explore our collection by category to find exactly what you need.
        </p>
      </div>

      <CategoryGrid />
    </div>
  );
};

export default Categories;