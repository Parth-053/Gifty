import React, { useState, useEffect } from 'react';
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
  const { items: products, loading } = useSelector((state) => state.products);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [layers, setLayers] = useState([]); 
  const [saving, setSaving] = useState(false);

  // Fetch only products available for customization (assuming backend has this filter or just fetch all for now)
  useEffect(() => {
    dispatch(fetchProducts()); 
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
      // Save customization metadata to cart
      await dispatch(addToCart({ 
        productId: selectedProduct._id, 
        quantity: 1,
        // Backend 'cartItem' schema must support a 'customization' object or similar
        variant: 'Custom Design', 
        customization: { layers } 
      })).unwrap();
      
      toast.success("Design saved to cart!");
      navigate('/cart');
    } catch (error) {
      toast.error("Failed to add to cart");
    } finally {
      setSaving(false);
    }
  };

  if (loading && !products.length) return <Loader fullScreen />;

  return (
    <div className="flex flex-col h-screen bg-white">
      <CustomizeHeader onReset={handleReset} onSave={handleSave} loading={saving} />
      <ProductGrid products={products} selectedProduct={selectedProduct} onSelect={setSelectedProduct} />
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        <LivePreview baseProduct={selectedProduct} layers={layers} onRemoveLayer={handleRemoveLayer} />
        <div className="h-[40vh] md:h-full md:w-[350px] flex-shrink-0 z-20 shadow-lg md:shadow-none">
          <ToolsPanel onAddText={handleAddText} onAddImage={handleAddImage} />
        </div>
      </div>
    </div>
  );
};

export default Customize;