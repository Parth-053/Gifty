import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingBag } from 'lucide-react';

// Context Hooks
import { useCart } from '../../hooks/useCart';
import { useWishlist } from '../../hooks/useWishlist';

// Components
import ProductImages from '../../components/product/ProductImages';
import ProductInfo from '../../components/product/ProductInfo';
import ReviewsList from '../../components/product/ReviewsList';
import ProductCard from '../../components/product/ProductCard';

// 🔥 DUMMY DB (Temporary Data for Page)
const PRODUCT_DB = [
  { 
    id: 'p1', 
    name: "Personalized LED Lamp with Photo", 
    price: 999, originalPrice: 1999, discount: 50, rating: 4.5, reviews: 128,
    image: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=500", // For Card
    images: [ // For Slider
      "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=500",
      "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=500",
      "https://images.unsplash.com/photo-1544785176-b74304db9b9c?w=500"
    ],
    description: "Light up your memories with this customized 3D LED lamp. Perfect for anniversaries and birthdays."
  },
  { 
    id: 'p2', 
    name: "Couple Mug Set", 
    price: 499, originalPrice: 999, discount: 50, rating: 4.8, reviews: 45,
    image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500",
    images: ["https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500"],
    description: "Perfect couple mugs for coffee lovers."
  },
  { 
    id: 'p3', 
    name: "Custom T-Shirt", 
    price: 699, originalPrice: 1299, discount: 40, rating: 4.2, reviews: 80,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
    images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500"],
    description: "High quality cotton t-shirt with custom print."
  }
];

const ProductDetails = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  
  // Context
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);

  useEffect(() => {
    // 1. Find Current Product
    const found = PRODUCT_DB.find(p => p.id === productId) || PRODUCT_DB[0];
    setProduct(found);

    // 2. Load Similar Products (Excluding current one)
    const similar = PRODUCT_DB.filter(p => p.id !== found.id);
    setSimilarProducts(similar);

    window.scrollTo(0, 0);
  }, [productId]);

  if (!product) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="bg-white min-h-screen pb-10">
      
      {/* 1. Sticky Header */}
      <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-md p-4 flex justify-between items-center shadow-sm">
         <button onClick={() => navigate(-1)} className="text-gray-600 p-1 rounded-full hover:bg-gray-100">
            <ArrowLeft size={24} />
         </button>
         <div className="flex gap-2">
            <button onClick={() => navigate('/cart')} className="text-gray-600 p-1 rounded-full hover:bg-gray-100">
               <ShoppingBag size={24} />
            </button>
         </div>
      </div>

      <div className="px-4 pt-2">
         {/* 2. Images Section */}
         <ProductImages images={product.images} />

         {/* 3. Info Section */}
         <div className="mt-6">
            <ProductInfo 
               product={product} 
               onAddToCart={(p, qty) => {
                  addToCart(p, qty);
                  alert("Added to Cart!");
               }}
               onToggleWishlist={toggleWishlist}
               isInWishlist={isInWishlist(product.id)}
            />
         </div>

         {/* 4. Reviews Section */}
         <ReviewsList />

         {/* 5. Similar Products Section (Uses ProductCard) */}
         {similarProducts.length > 0 && (
           <div className="mt-8 pt-6 border-t border-gray-100">
             <h3 className="text-lg font-bold text-gray-800 mb-4">You Might Also Like</h3>
             <div className="grid grid-cols-2 gap-4">
                {similarProducts.map(p => (
                   <ProductCard key={p.id} product={p} />
                ))}
             </div>
           </div>
         )}
      </div>

    </div>
  );
};

export default ProductDetails;