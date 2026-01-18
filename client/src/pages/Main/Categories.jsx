import React, { useState, useEffect } from 'react';

// Components
import CategoryHeader from '../../components/categories/CategoryHeader';
import CategorySidebar from '../../components/categories/CategorySidebar';
import CategoryGrid from '../../components/categories/CategoryGrid';

// DATA (Same as before - keeping it short here for readability)
// ... (Paste your full CATEGORY_DATA array here inside or import it)
const CATEGORY_DATA = [
    {
      id: 'popular',
      name: 'Popular',
      icon: 'https://cdn-icons-png.flaticon.com/512/2111/2111646.png',
      subCategories: [
        { name: 'Best Sellers', img: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=300' },
        { name: 'New Arrivals', img: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=300' },
        { name: 'Same Day Delivery', img: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=300' },
        { name: 'Gift Combos', img: 'https://images.unsplash.com/photo-1602751584552-8ba731f0e535?w=300' },
        { name: 'Corporate Gifts', img: 'https://images.unsplash.com/photo-1577056923819-2015df3083e9?w=300' },
        { name: 'Premium Gifts', img: 'https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?w=300' },
      ]
    },
    {
      id: 'occasions',
      name: 'Occasions',
      icon: 'https://cdn-icons-png.flaticon.com/512/4213/4213958.png',
      subCategories: [
        { name: 'Birthday', img: 'https://images.unsplash.com/photo-1530103862676-de3c9da59af7?w=300' },
        { name: 'Anniversary', img: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=300' },
        { name: 'Wedding', img: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=300' },
        { name: 'Housewarming', img: 'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=300' },
        { name: 'Baby Shower', img: 'https://images.unsplash.com/photo-1595967784013-4dc39f28df35?w=300' },
        { name: 'Retirement', img: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=300' },
        { name: 'Graduation', img: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=300' },
        { name: 'Farewell', img: 'https://images.unsplash.com/photo-1506869649526-bd3e7329ebd5?w=300' },
      ]
    },
    {
      id: 'recipient',
      name: 'Recipient',
      icon: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
      subCategories: [
        { name: 'For Him', img: 'https://images.unsplash.com/photo-1505022610485-0249ba5b3675?w=300' },
        { name: 'For Her', img: 'https://images.unsplash.com/photo-1571781564998-d33f7d1a21df?w=300' },
        { name: 'Kids', img: 'https://images.unsplash.com/photo-1560851691-ebb6487e47f5?w=300' },
        { name: 'Couples', img: 'https://images.unsplash.com/photo-1516589178581-28affaf46708?w=300' },
        { name: 'Mom', img: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=300' },
        { name: 'Dad', img: 'https://images.unsplash.com/photo-1473492201326-7c01dd2a596e?w=300' },
        { name: 'Husband', img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300' },
        { name: 'Wife', img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300' },
      ]
    },
    {
      id: 'personalized',
      name: 'Personalized',
      icon: 'https://cdn-icons-png.flaticon.com/512/1004/1004733.png',
      subCategories: [
        { name: 'Photo Frames', img: 'https://images.unsplash.com/photo-1534349762942-5d22f6723b73?w=300' },
        { name: 'Mugs', img: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=300' },
        { name: 'Cushions', img: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e6?w=300' },
        { name: 'Keychains', img: 'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=300' },
        { name: '3D Lamps', img: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=300' },
        { name: 'Caricatures', img: 'https://images.unsplash.com/photo-1544785176-b74304db9b9c?w=300' },
        { name: 'Engraved Pens', img: 'https://images.unsplash.com/photo-1565536421961-1f165e0c981e?w=300' },
        { name: 'Wallets', img: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=300' },
      ]
    },
    {
      id: 'cakes_flowers',
      name: 'Cakes & Flowers',
      icon: 'https://cdn-icons-png.flaticon.com/512/10752/10752182.png',
      subCategories: [
        { name: 'Red Roses', img: 'https://images.unsplash.com/photo-1559563362-c667ba5f5480?w=300' },
        { name: 'Chocolate Cake', img: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300' },
        { name: 'Orchids', img: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=300' },
        { name: 'Mixed Flowers', img: 'https://images.unsplash.com/photo-1562690868-60bbe7624e68?w=300' },
        { name: 'Truffle Cake', img: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=300' },
        { name: 'Cupcakes', img: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=300' },
        { name: 'Photo Cakes', img: 'https://images.unsplash.com/photo-1535141192574-5d4897c12636?w=300' },
        { name: 'Indoor Plants', img: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=300' },
      ]
    },
    {
      id: 'jewelry',
      name: 'Jewelry',
      icon: 'https://cdn-icons-png.flaticon.com/512/610/610365.png',
      subCategories: [
        { name: 'Pendants', img: 'https://images.unsplash.com/photo-1599643478518-17488fbbcd75?w=300' },
        { name: 'Rings', img: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=300' },
        { name: 'Earrings', img: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=300' },
        { name: 'Bracelets', img: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=300' },
        { name: 'Silver Jewelry', img: 'https://images.unsplash.com/photo-1576184511244-c48c34914a5f?w=300' },
        { name: 'Men\'s Jewelry', img: 'https://images.unsplash.com/photo-1618453292459-53424b68bb45?w=300' },
      ]
    },
    {
      id: 'home_living',
      name: 'Home & Living',
      icon: 'https://cdn-icons-png.flaticon.com/512/2558/2558012.png',
      subCategories: [
        { name: 'Wall Decor', img: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=300' },
        { name: 'Table Lamps', img: 'https://images.unsplash.com/photo-1507473888900-52a11b0363d9?w=300' },
        { name: 'Clocks', img: 'https://images.unsplash.com/photo-1563861826100-9cb868c72876?w=300' },
        { name: 'Showpieces', img: 'https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=300' },
        { name: 'Kitchenware', img: 'https://images.unsplash.com/photo-1556910103-1c02745a30bf?w=300' },
        { name: 'Spiritual', img: 'https://images.unsplash.com/photo-1603228254119-e6a4d095dc59?w=300' },
      ]
    }
  ];

const Categories = () => {
  const [activeTabId, setActiveTabId] = useState(CATEGORY_DATA[0].id);

  // 🔥 Function: Handle Click on Sidebar
  const handleScrollToCategory = (id) => {
    setActiveTabId(id); // Sidebar immediate update
    const element = document.getElementById(id);
    if (element) {
      // Scroll right container to that element
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // 🔥 Effect: Watch Scroll on Right Side & Update Left Side
  useEffect(() => {
    const container = document.getElementById('right-scroll-container');
    
    const handleScroll = () => {
      // Check position of each category section
      CATEGORY_DATA.forEach((cat) => {
        const element = document.getElementById(cat.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          // If top of element is near top of viewport (approx 200px offset)
          if (rect.top >= 0 && rect.top < 300) {
            setActiveTabId(cat.id);
          }
        }
      });
    };

    if (container) {
      container.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (container) container.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="bg-white h-screen flex flex-col">
      <CategoryHeader />

      <div className="flex flex-1 overflow-hidden">
        
        {/* Sidebar calls handleScrollToCategory on click */}
        <CategorySidebar 
          data={CATEGORY_DATA} 
          activeTab={activeTabId} 
          onSelect={handleScrollToCategory} 
        />

        {/* Grid receives ALL data now */}
        <CategoryGrid 
          data={CATEGORY_DATA}
        />

      </div>
    </div>
  );
};

export default Categories;