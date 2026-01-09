import React from 'react';
import TopHeader from '../../components/home/TopHeader';
import HeroBanner from '../../components/home/HeroBanner';
import CategoryRail from '../../components/home/CategoryRail';

// ✅ Fix: Import the reusable ProductCard
import ProductCard from '../../components/product/ProductCard';

// Dummy Products Data
const featuredProducts = [
  { id: '1', name: "Personalized Lamp", price: 499, originalPrice: 999, discount: 50, rating: 4.5, reviews: 120, image: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=500" },
  { id: '2', name: "Chocolate Hamper", price: 899, originalPrice: 1299, discount: 30, rating: 4.8, reviews: 85, image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500" },
  { id: '3', name: "Gold Plated Pendant", price: 1499, originalPrice: 2999, discount: 50, rating: 4.2, reviews: 45, image: "https://images.unsplash.com/photo-1602751584552-8ba731f0e535?w=500" },
  { id: '4', name: "Cute Teddy Bear", price: 599, originalPrice: 899, discount: 33, rating: 4.6, reviews: 200, image: "https://images.unsplash.com/photo-1559563458-52c6959b8136?w=500" },
];

const Home = () => {
  return (
    <div className="bg-[#F9F9F9] min-h-screen pb-24">
      
      {/* 1. Sticky Header */}
      <TopHeader />

      {/* 2. Scrollable Content */}
      <div className="space-y-2">
        
        {/* Banner */}
        <HeroBanner />

        {/* Categories */}
        <CategoryRail />

        {/* Featured Section */}
        <div className="mt-6 px-4">
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-bold text-gray-800 text-lg">Featured Gifts</h2>
            <span className="text-xs text-[#FF6B6B] font-semibold">View All</span>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 gap-4">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>

        {/* Second Banner / Ad */}
        <div className="px-4 py-4">
           <div className="w-full h-32 bg-[#4ECDC4]/10 rounded-xl border border-[#4ECDC4] border-dashed flex items-center justify-center">
              <span className="text-[#4ECDC4] font-bold">✨ AI Customization Ad ✨</span>
           </div>
        </div>

      </div>
    </div>
  );
};

export default Home;