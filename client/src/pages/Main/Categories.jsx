import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'; // 1. Import useNavigate
import { fetchCategories } from '../../store/categorySlice';
import CategoryHeader from '../../components/categories/CategoryHeader';
import { Loader2 } from 'lucide-react';

const EMPTY_ARRAY = [];

const Categories = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // 2. Initialize navigate hook
  
  const rightPanelRef = useRef(null);
  const leftPanelRef = useRef(null);
  const isClickScrolling = useRef(false);

  const { items, loading } = useSelector((state) => state.categories);
  const rawCategories = items || EMPTY_ARRAY;

  // Build Category Tree
  const categoryTree = useMemo(() => {
    if (!rawCategories.length) return EMPTY_ARRAY;

    const roots = rawCategories.filter(
      (cat) => !cat.parentId || (typeof cat.parentId === 'object' && !cat.parentId._id)
    );

    return roots.map((root) => {
      const children = rawCategories.filter((cat) => {
        const pId = typeof cat.parentId === 'object' ? cat.parentId?._id : cat.parentId;
        return pId === root._id;
      });

      return {
        ...root,
        subCategories: children
      };
    });
  }, [rawCategories]);

  const [manualActiveId, setManualActiveId] = useState(null);
  const activeId = manualActiveId || (categoryTree.length > 0 ? categoryTree[0]._id : '');

  useEffect(() => {
    if (rawCategories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch, rawCategories.length]);

  // Click & Scroll Handlers
  const handleCategoryClick = (id) => {
    setManualActiveId(id);
    isClickScrolling.current = true;
    const element = document.getElementById(`cat-${id}`);
    if (element && rightPanelRef.current) {
      rightPanelRef.current.scrollTo({ top: element.offsetTop, behavior: 'smooth' });
      setTimeout(() => { isClickScrolling.current = false; }, 500);
    }
  };

  const handleRightScroll = () => {
    if (isClickScrolling.current) return;
    const container = rightPanelRef.current;
    if (!container) return;
    const currentScroll = container.scrollTop + 20; 
    let currentId = activeId;
    for (let i = 0; i < categoryTree.length; i++) {
        const cat = categoryTree[i];
        const element = document.getElementById(`cat-${cat._id}`);
        if (element && element.offsetTop <= currentScroll) {
            currentId = cat._id;
        } else if (element) {
            break;
        }
    }
    if (currentId !== activeId) setManualActiveId(currentId);
  };

  useEffect(() => {
    if (leftPanelRef.current && activeId) {
      const activeElement = document.getElementById(`nav-item-${activeId}`);
      if (activeElement) {
        activeElement.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
      }
    }
  }, [activeId]);

  if (loading && rawCategories.length === 0) {
    return (
      <div className="h-[calc(100dvh-5rem)] flex items-center justify-center bg-white">
        <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-white h-[calc(100dvh-5rem)] flex flex-col overflow-hidden">
      <div className="flex-none z-20 relative bg-white shadow-sm">
        <CategoryHeader />
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        
        {/* --- LEFT SIDEBAR --- */}
        <div ref={leftPanelRef} className="w-[28%] bg-gray-50 border-r border-gray-200 overflow-y-auto no-scrollbar pb-24">
          {categoryTree.map((cat) => {
            const isActive = activeId === cat._id;
            return (
              <div
                key={cat._id}
                id={`nav-item-${cat._id}`}
                onClick={() => handleCategoryClick(cat._id)}
                className={`flex flex-col items-center justify-center py-4 px-1 cursor-pointer transition-all border-l-4 relative ${isActive ? 'bg-white border-purple-600' : 'bg-gray-50 border-transparent hover:bg-gray-100'}`}
              >
                {isActive && <div className="absolute right-2 top-2 w-1.5 h-1.5 rounded-full bg-purple-600"></div>}
                <div className={`w-10 h-10 rounded-full mb-1 p-1 flex items-center justify-center transition-transform duration-200 overflow-hidden ${isActive ? 'bg-purple-50 scale-110' : 'bg-gray-200'}`}>
                  {cat.image?.url ? (
                    <img src={cat.image.url} alt={cat.name} className="w-full h-full object-cover rounded-full" />
                  ) : (
                    <div className="text-[10px] text-gray-500 font-bold">{cat.name.substring(0,2).toUpperCase()}</div>
                  )}
                </div>
                <span className={`text-[10px] text-center font-medium leading-tight px-1 mt-1 line-clamp-2 ${isActive ? 'text-purple-700 font-bold' : 'text-gray-500'}`}>
                  {cat.name}
                </span>
              </div>
            );
          })}
        </div>

        {/* --- RIGHT CONTENT --- */}
        <div ref={rightPanelRef} onScroll={handleRightScroll} className="w-[72%] bg-white overflow-y-auto pb-24 scroll-smooth">
          {categoryTree.map((cat, index) => (
            <div key={cat._id} id={`cat-${cat._id}`} className={`pt-2 pb-6 ${index !== 0 ? 'border-t border-gray-100' : ''}`}>
              
              <div className="flex items-center gap-2 px-4 mb-4 sticky top-0 bg-white/95 backdrop-blur-sm z-10 py-3 shadow-sm">
                <h2 className={`text-sm font-bold uppercase tracking-wide ${activeId === cat._id ? 'text-purple-700' : 'text-gray-800'}`}>
                  {cat.name}
                </h2>
              </div>

              <div className="grid grid-cols-3 gap-x-2 gap-y-4 px-4">
                {cat.subCategories && cat.subCategories.length > 0 ? (
                  cat.subCategories.map((sub) => (
                    <div 
                      key={sub._id} 
                      // 3. Navigate to Shop Page with Category ID
                      onClick={() => navigate(`/search/results?q=${encodeURIComponent(sub.name)}`)}
                      className="flex flex-col items-center gap-2 group cursor-pointer"
                    >
                      <div className="w-16 h-16 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center p-2 group-hover:border-purple-200 group-hover:bg-purple-50 transition-all overflow-hidden">
                        {sub.image?.url ? (
                            <img src={sub.image.url} alt={sub.name} className="w-full h-full object-cover rounded-full mix-blend-multiply" />
                        ) : (
                            <span className="text-xs text-gray-400 font-bold">{sub.name.substring(0,1)}</span>
                        )}
                      </div>
                      <span className="text-[10px] text-center text-gray-600 font-medium leading-tight group-hover:text-purple-700 line-clamp-2 w-full">
                        {sub.name}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="col-span-3 text-center py-4 text-xs text-gray-400">
                    No subcategories found.
                  </div>
                )}
              </div>
            </div>
          ))}
          <div className="h-[60vh]"></div>
        </div>
      </div>
    </div>
  );
};

export default Categories;