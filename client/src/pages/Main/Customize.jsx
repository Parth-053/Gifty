import React, { useState, useEffect, useMemo } from 'react'; // Added useMemo
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

// Components
import CustomizeHeader from '../../components/customize/CustomizeHeader';
import ProductGrid from '../../components/customize/ProductGrid';
import LivePreview from '../../components/customize/LivePreview';
import ToolsPanel from '../../components/customize/ToolsPanel';
import Loader from '../../components/common/Loader';

// Actions
import { fetchProducts } from '../../store/productSlice';
import { addToCart } from '../../store/cartSlice';

const Customize = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 1. Correct State Selection
  const { list, loading } = useSelector((state) => state.products || {});

  // 2. FIX: Memoize 'products' to satisfy ESLint and prevent infinite loops
  const products = useMemo(() => {
    if (Array.isArray(list)) return list;
    if (list?.products) return list.products;
    if (list?.docs) return list.docs;
    return [];
  }, [list]);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [layers, setLayers] = useState([]); 
  const [saving, setSaving] = useState(false);

  // Fetch products
  useEffect(() => {
    dispatch(fetchProducts({ limit: 20, sort: 'newest' })); 
  }, [dispatch]);

  // Set default product
  useEffect(() => {
    if (products.length > 0 && !selectedProduct) {
      setSelectedProduct(products[0]);
    }
  }, [products, selectedProduct]);

  const handleAddText = (text) => {
    setLayers([...layers, { id: Date.now(), type: 'text', content: text, x: '50%', y: '50%' }]);
  };

  const handleAddImage = (url) => {
    setLayers([...layers, { id: Date.now(), type: 'image', content: url, x: '50%', y: '50%' }]);
  };

  const handleRemoveLayer = (id) => {
    setLayers(layers.filter(l => l.id !== id));
  };

  const handleReset = () => {
    if (window.confirm("Reset all changes?")) setLayers([]);
  };

  const handleSave = async () => {
    if (!selectedProduct) return;
    if (layers.length === 0) {
      toast.error("Add some design elements first!");
      return;
    }

    setSaving(true);
    try {
      await dispatch(addToCart({ 
        productId: selectedProduct._id, 
        quantity: 1,
        variant: 'Custom Design', 
        customization: { layers } 
      })).unwrap();
      
      toast.success("Design saved to cart!");
      navigate('/cart');
    } catch (error) {
      console.error(error);
      toast.error("Failed to add to cart");
    } finally {
      setSaving(false);
    }
  };

  // Loading State
  if (loading && products.length === 0) return <Loader fullScreen />;

  return (
    <div className="flex flex-col h-screen bg-white">
      <CustomizeHeader onReset={handleReset} onSave={handleSave} loading={saving} />
      
      {/* Product Grid Area */}
      <div className="h-40 border-b border-gray-100 flex-shrink-0">
         <ProductGrid 
            products={products} 
            selectedProduct={selectedProduct} 
            onSelect={setSelectedProduct} 
         />
      </div>

      {/* Workspace */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-gray-50">
        <LivePreview 
            baseProduct={selectedProduct} 
            layers={layers} 
            onRemoveLayer={handleRemoveLayer} 
        />
        
        <div className="h-[40vh] md:h-full md:w-[350px] flex-shrink-0 z-20 shadow-lg md:shadow-none bg-white border-l border-gray-100">
          <ToolsPanel onAddText={handleAddText} onAddImage={handleAddImage} />
        </div>
      </div>
    </div>
  );
};

export default Customize;