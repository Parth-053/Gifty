import React, { useState, useEffect } from 'react';

// Components (Ensure these exist in src/components/categories/)
import CategoryHeader from '../../components/categories/CategoryHeader';
import CategorySidebar from '../../components/categories/CategorySidebar';
import CategoryGrid from '../../components/categories/CategoryGrid';

const CATEGORY_DATA = [
    {
      id: 'popular',
      name: 'Popular',
      icon: 'https://cdn-icons-png.flaticon.com/512/2111/2111646.png',
      subCategories: [
        { name: 'Best Sellers', img: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=300' },
        { name: 'New Arrivals', img: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=300' },
        { name: 'Gift Combos', img: 'https://images.unsplash.com/photo-1602751584552-8ba731f0e535?w=300' },
      ]
    },
    {
      id: 'occasions',
      name: 'Occasions',
      icon: 'https://cdn-icons-png.flaticon.com/512/4213/4213958.png',
      subCategories: [
        { name: 'Birthday', img: 'https://images.unsplash.com/photo-1530103862676-de3c9da59af7?w=300' },
        { name: 'Anniversary', img: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=300' },
      ]
    },
    // ... (Keep your full list)
];

const Categories = () => {
  const [activeTabId, setActiveTabId] = useState(CATEGORY_DATA[0].id);

  const handleScrollToCategory = (id) => {
    setActiveTabId(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    const container = document.getElementById('right-scroll-container');
    
    const handleScroll = () => {
      CATEGORY_DATA.forEach((cat) => {
        const element = document.getElementById(cat.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top >= 0 && rect.top < 300) {
            setActiveTabId(cat.id);
          }
        }
      });
    };

    if (container) container.addEventListener('scroll', handleScroll);
    return () => {
      if (container) container.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="bg-white h-screen flex flex-col">
      <CategoryHeader />

      <div className="flex flex-1 overflow-hidden">
        <CategorySidebar 
          data={CATEGORY_DATA} 
          activeTab={activeTabId} 
          onSelect={handleScrollToCategory} 
        />
        <CategoryGrid data={CATEGORY_DATA} />
      </div>
    </div>
  );
};

export default Categories;