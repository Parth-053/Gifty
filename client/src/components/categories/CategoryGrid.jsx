import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchCategories } from '../../store/categorySlice';
import { ArrowRight, ImageIcon, Loader2 } from 'lucide-react';

const CategoryGrid = () => {
  const dispatch = useDispatch();
  const { items: categories, loading } = useSelector((state) => state.categories);

  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories.length]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-48 bg-gray-100 rounded-3xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (categories.length === 0) {
    return <div className="text-center py-20 text-gray-500 font-medium">No categories found.</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map((category) => (
        <Link 
          key={category._id} 
          to={`/shop?category=${category._id}`}
          className="group relative h-56 sm:h-64 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
        >
          {/* Background Image */}
          <div className="absolute inset-0 bg-gray-200">
            {category.image?.url ? (
              <img 
                src={category.image.url} 
                alt={category.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-50">
                <ImageIcon size={48} />
              </div>
            )}
          </div>
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-6 flex justify-between items-end translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            <div>
              <h3 className="text-2xl font-bold text-white mb-1">{category.name}</h3>
              <p className="text-white/80 text-sm line-clamp-1 opacity-0 group-hover:opacity-100 transition-opacity delay-100">
                {category.description || "Explore Collection"}
              </p>
            </div>
            <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition-all shadow-lg">
              <ArrowRight size={20} className="-rotate-45 group-hover:rotate-0 transition-transform" />
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default CategoryGrid;