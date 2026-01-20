import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between bg-white px-4 py-4 border-t border-gray-100 rounded-b-2xl">
      <div className="hidden sm:flex flex-1 items-center justify-between">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
          Page <span className="text-gray-900">{currentPage}</span> of {totalPages}
        </p>
        <nav className="inline-flex gap-1">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-xl border border-gray-100 disabled:opacity-30 hover:bg-gray-50 transition-all"
          >
            <ChevronLeft size={18} />
          </button>
          
          {/* Industry Standard logic for numeric pages */}
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i + 1}
              onClick={() => onPageChange(i + 1)}
              className={`w-9 h-9 rounded-xl text-xs font-black transition-all ${
                currentPage === i + 1 ? 'bg-gray-900 text-white shadow-lg' : 'hover:bg-gray-50 text-gray-400'
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-xl border border-gray-100 disabled:opacity-30 hover:bg-gray-50 transition-all"
          >
            <ChevronRight size={18} />
          </button>
        </nav>
      </div>
    </div>
  );
};

export default Pagination;