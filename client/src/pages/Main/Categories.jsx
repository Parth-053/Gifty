import React, { useState, useRef, useEffect } from 'react';
import CategoryHeader from '../../components/categories/CategoryHeader';
import { Star } from 'lucide-react';

// --- MOCK DATA ---
const CATEGORIES_DATA = [
  {
    id: 'popular',
    name: "Popular",
    image: "https://cdn-icons-png.flaticon.com/512/477/477406.png",
    subCategories: [
      { name: "Kurtis", image: "https://cdn-icons-png.flaticon.com/512/9431/9431172.png" },
      { name: "Sarees", image: "https://cdn-icons-png.flaticon.com/512/9332/9332470.png" },
      { name: "Smartwatches", image: "https://cdn-icons-png.flaticon.com/512/2953/2953363.png" },
      { name: "Headphones", image: "https://cdn-icons-png.flaticon.com/512/189/189622.png" },
      { name: "Shoes", image: "https://cdn-icons-png.flaticon.com/512/5499/5499242.png" },
      { name: "T-Shirts", image: "https://cdn-icons-png.flaticon.com/512/892/892458.png" },
    ]
  },
  {
    id: 'women-ethnic',
    name: "Women Ethnic",
    image: "https://cdn-icons-png.flaticon.com/512/4200/4200926.png", 
    subCategories: [
      { name: "Sarees", image: "https://cdn-icons-png.flaticon.com/512/9332/9332470.png" },
      { name: "Kurtis", image: "https://cdn-icons-png.flaticon.com/512/9431/9431172.png" },
      { name: "Lehengas", image: "https://cdn-icons-png.flaticon.com/512/8826/8826558.png" },
      { name: "Blouses", image: "https://cdn-icons-png.flaticon.com/512/5267/5267439.png" },
      { name: "Dupattas", image: "https://cdn-icons-png.flaticon.com/512/7506/7506691.png" },
      { name: "Ethnic Skirts", image: "https://cdn-icons-png.flaticon.com/512/4333/4333999.png" },
    ]
  },
  {
    id: 'women-western',
    name: "Women Western",
    image: "https://cdn-icons-png.flaticon.com/512/3233/3233508.png",
    subCategories: [
      { name: "Tops", image: "https://cdn-icons-png.flaticon.com/512/3345/3345610.png" },
      { name: "Dresses", image: "https://cdn-icons-png.flaticon.com/512/2784/2784403.png" },
      { name: "Jeans", image: "https://cdn-icons-png.flaticon.com/512/3345/3345579.png" },
      { name: "Jumpsuits", image: "https://cdn-icons-png.flaticon.com/512/2806/2806229.png" },
    ]
  },
  {
    id: 'men',
    name: "Men",
    image: "https://cdn-icons-png.flaticon.com/512/263/263142.png",
    subCategories: [
      { name: "Shirts", image: "https://cdn-icons-png.flaticon.com/512/2503/2503600.png" },
      { name: "T-Shirts", image: "https://cdn-icons-png.flaticon.com/512/892/892458.png" },
      { name: "Jeans", image: "https://cdn-icons-png.flaticon.com/512/3345/3345579.png" },
      { name: "Shoes", image: "https://cdn-icons-png.flaticon.com/512/5499/5499242.png" },
      { name: "Watches", image: "https://cdn-icons-png.flaticon.com/512/2953/2953363.png" },
    ]
  },
  {
    id: 'kids',
    name: "Kids",
    image: "https://cdn-icons-png.flaticon.com/512/2990/2990295.png",
    subCategories: [
      { name: "Toys", image: "https://cdn-icons-png.flaticon.com/512/3081/3081840.png" },
      { name: "Baby Care", image: "https://cdn-icons-png.flaticon.com/512/2829/2829841.png" },
      { name: "Dresses", image: "https://cdn-icons-png.flaticon.com/512/103/103399.png" },
    ]
  },
  {
    id: 'home',
    name: "Home",
    image: "https://cdn-icons-png.flaticon.com/512/114/114903.png",
    subCategories: [
      { name: "Bedhseets", image: "https://cdn-icons-png.flaticon.com/512/2558/2558062.png" },
      { name: "Curtains", image: "https://cdn-icons-png.flaticon.com/512/2558/2558022.png" },
      { name: "Decor", image: "https://cdn-icons-png.flaticon.com/512/4005/4005937.png" },
      { name: "Tools", image: "https://cdn-icons-png.flaticon.com/512/1532/1532486.png" },
    ]
  },
  {
    id: 'beauty',
    name: "Beauty",
    image: "https://cdn-icons-png.flaticon.com/512/3233/3233515.png",
    subCategories: [
      { name: "Makeup", image: "https://cdn-icons-png.flaticon.com/512/263/263124.png" },
      { name: "Skincare", image: "https://cdn-icons-png.flaticon.com/512/3050/3050239.png" },
      { name: "Sanitizers", image: "https://cdn-icons-png.flaticon.com/512/2913/2913465.png" },
    ]
  },
];

const Categories = () => {
  const [activeId, setActiveId] = useState(CATEGORIES_DATA[0].id);
  const rightPanelRef = useRef(null);
  const leftPanelRef = useRef(null);
  const isClickScrolling = useRef(false);

  // --- 1. Click Handling (Scrolls right side to target) ---
  const handleCategoryClick = (id) => {
    setActiveId(id);
    isClickScrolling.current = true; // Lock the scroll listener
    
    const element = document.getElementById(`cat-${id}`);
    if (element && rightPanelRef.current) {
      // Calculate position to snap to top (Adjusted offset for sticky header)
      const offsetTop = element.offsetTop; 
      
      rightPanelRef.current.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });

      // Unlock listener after animation
      setTimeout(() => {
        isClickScrolling.current = false;
      }, 500);
    }
  };

  // --- 2. Handle Scroll on Right Side (Update Left Side) ---
  const handleRightScroll = () => {
    if (isClickScrolling.current) return;

    const container = rightPanelRef.current;
    if (!container) return;

    // Small buffer for better UX
    const currentScroll = container.scrollTop + 20; 

    let currentId = CATEGORIES_DATA[0].id;
    
    for (let i = 0; i < CATEGORIES_DATA.length; i++) {
        const cat = CATEGORIES_DATA[i];
        const element = document.getElementById(`cat-${cat.id}`);
        if (element) {
            // Check if element is at or above the scroll top
            if (element.offsetTop <= currentScroll) {
                currentId = cat.id;
            } else {
                break;
            }
        }
    }

    if (currentId !== activeId) {
      setActiveId(currentId);
    }
  };

  // --- 3. Auto-Scroll Left Sidebar ---
  useEffect(() => {
    if (leftPanelRef.current) {
      const activeElement = document.getElementById(`nav-item-${activeId}`);
      if (activeElement) {
        activeElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'nearest'
        });
      }
    }
  }, [activeId]);

  return (
    <div className="bg-white h-screen overflow-hidden flex flex-col">
      
      <CategoryHeader />

      <div className="flex flex-1 overflow-hidden relative">
        
        {/* --- LEFT SIDEBAR --- */}
        <div 
          ref={leftPanelRef}
          className="w-[28%] bg-gray-50 border-r border-gray-200 overflow-y-auto no-scrollbar pb-20"
        >
          {CATEGORIES_DATA.map((cat) => {
            const isActive = activeId === cat.id;
            return (
              <div
                key={cat.id}
                id={`nav-item-${cat.id}`}
                onClick={() => handleCategoryClick(cat.id)}
                className={`
                  flex flex-col items-center justify-center py-4 px-1 cursor-pointer transition-all border-l-4 relative
                  ${isActive 
                    ? 'bg-white border-purple-600' 
                    : 'bg-gray-50 border-transparent hover:bg-gray-100'}
                `}
              >
                {isActive && (
                    <div className="absolute right-2 top-2 w-1.5 h-1.5 rounded-full bg-purple-600"></div>
                )}

                <div className={`
                  w-10 h-10 rounded-full mb-1 p-1 flex items-center justify-center transition-transform duration-200
                  ${isActive ? 'bg-purple-50 scale-110' : 'bg-gray-200'}
                `}>
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-contain" />
                </div>
                
                <span className={`
                  text-[10px] text-center font-medium leading-tight px-1 mt-1
                  ${isActive ? 'text-purple-700 font-bold' : 'text-gray-500'}
                `}>
                  {cat.name}
                </span>
              </div>
            );
          })}
        </div>

        {/* --- RIGHT CONTENT --- */}
        <div 
          ref={rightPanelRef}
          onScroll={handleRightScroll}
          className="w-[72%] bg-white overflow-y-auto pb-24 scroll-smooth"
        >
          {CATEGORIES_DATA.map((cat, index) => (
            <div 
                key={cat.id} 
                id={`cat-${cat.id}`} 
                // CHANGE: Removed min-h-[50vh] to remove extra space.
                // Added only necessary padding.
                className={`pt-2 pb-6 ${index !== 0 ? 'border-t border-gray-100' : ''}`}
            >
              
              {/* Sticky Section Header */}
              <div className="flex items-center gap-2 px-4 mb-4 sticky top-0 bg-white/95 backdrop-blur-sm z-10 py-3 shadow-sm">
                <h2 className={`text-sm font-bold uppercase tracking-wide ${activeId === cat.id ? 'text-purple-700' : 'text-gray-800'}`}>
                  {cat.name}
                </h2>
                {cat.id === 'popular' && <Star size={14} className="text-yellow-500 fill-yellow-500" />}
              </div>

              {/* Subcategories Grid */}
              <div className="grid grid-cols-3 gap-x-2 gap-y-4 px-4">
                {cat.subCategories.map((sub, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-2 group cursor-pointer">
                    <div className="w-16 h-16 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center p-2 group-hover:border-purple-200 group-hover:bg-purple-50 transition-all">
                      <img src={sub.image} alt={sub.name} className="w-full h-full object-contain mix-blend-multiply" />
                    </div>
                    <span className="text-[10px] text-center text-gray-600 font-medium leading-tight group-hover:text-purple-700 line-clamp-2 w-full">
                      {sub.name}
                    </span>
                  </div>
                ))}
              </div>
              
            </div>
          ))}
          
          {/* Spacer at bottom (Critical for allowing last item to scroll to top) */}
          <div className="h-[60vh]"></div>
        </div>
      </div>
    </div>
  );
};

export default Categories;