import React, { useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';

const FilterSection = ({ title, options }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="border-b border-gray-100 py-4 px-5">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full mb-3"
      >
        <span className="font-bold text-gray-800 text-sm">{title}</span>
        <ChevronDown size={16} className={`transition-transform duration-200 text-gray-400 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="space-y-3">
          {options.map((opt, idx) => (
            <label key={idx} className="flex items-center gap-3 cursor-pointer group">
              <div className="relative flex items-center justify-center">
                <input 
                  type="checkbox" 
                  className="peer w-5 h-5 border-2 border-gray-300 rounded checked:bg-purple-600 checked:border-purple-600 appearance-none transition-all cursor-pointer" 
                />
                <Check size={12} className="absolute text-white opacity-0 peer-checked:opacity-100 pointer-events-none transform scale-50 peer-checked:scale-100 transition-transform" />
              </div>
              <span className="text-sm text-gray-600 group-hover:text-purple-600 transition-colors">{opt}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

const ProductFilters = () => {
  return (
    <div className="pb-4">
      <FilterSection title="Price" options={["Under ₹500", "₹500 - ₹1000", "₹1000 - ₹5000", "Over ₹5000"]} />
      <FilterSection title="Brand" options={["Nike", "Adidas", "Puma", "Reebok", "Zara", "H&M"]} />
      <FilterSection title="Discount" options={["10% or more", "30% or more", "50% or more", "70% or more"]} />
      <FilterSection title="Customer Ratings" options={["4★ & above", "3★ & above", "2★ & above"]} />
      <FilterSection title="Availability" options={["Include Out of Stock"]} />
    </div>
  );
};

export default ProductFilters;