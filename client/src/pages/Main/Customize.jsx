import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';

// ✅ Fix: Import useCart
import { useCart } from '../../hooks/useCart';

// Components
import CustomizeHeader from '../../components/customize/CustomizeHeader';
import AIGenerator from '../../components/customize/AIGenerator';
import ProductGrid from '../../components/customize/ProductGrid';
import LivePreview from '../../components/customize/LivePreview';
import ToolsPanel from '../../components/customize/ToolsPanel';

const BASE_PRODUCTS = [
  {
    id: 'mug001',
    name: "Classic Ceramic Mug",
    price: 399,
    image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500",
    type: "mug",
    allowedOptions: ['text', 'color', 'image'],
  },
  {
    id: 'tshirt001',
    name: "Cotton Crew Neck T-Shirt",
    price: 699,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
    type: "tshirt",
    allowedOptions: ['text', 'color', 'image'],
  },
  {
    id: 'pillow001',
    name: "Soft Throw Pillow",
    price: 499,
    image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e6?w=500",
    type: "cushion",
    allowedOptions: ['text', 'color'],
  },
  {
    id: 'frame001',
    name: "Wooden Photo Frame",
    price: 899,
    image: "https://images.unsplash.com/photo-1534349762942-5d22f6723b73?w=500",
    type: "frame",
    allowedOptions: ['text', 'image'],
  }
];

const Customize = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addToCart } = useCart(); // ✅ Hook

  // States
  const [step, setStep] = useState(1);
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [recommendedProducts, setRecommendedProducts] = useState(BASE_PRODUCTS);
  
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [customText, setCustomText] = useState("");
  const [customColor, setCustomColor] = useState("black");
  const [textColor, setTextColor] = useState("#333333");

  useEffect(() => {
    const paramId = searchParams.get('productId');
    if (paramId) {
      const product = BASE_PRODUCTS.find(p => p.id === paramId);
      if (product) handleSelectProduct(product);
    }
  }, [searchParams]);

  const handleGenerate = () => {
    if (!prompt) return;
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      // Dummy Logic
      if (prompt.toLowerCase().includes("coffee")) {
        setRecommendedProducts(BASE_PRODUCTS.filter(p => p.type === 'mug'));
      } else {
        setRecommendedProducts(BASE_PRODUCTS);
      }
    }, 1500);
  };

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setStep(2);
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
      setSelectedProduct(null);
      navigate('/customize');
    }
  };

  // ✅ Function: Add to Cart with Customizations
  const handleAddToCart = () => {
    if (!selectedProduct) return;
    
    // Create a new object with customizations
    const customProduct = {
        ...selectedProduct,
        id: `${selectedProduct.id}-${Date.now()}`, // Unique ID for cart
        name: `Custom ${selectedProduct.name}`,
        options: {
            text: customText,
            color: customColor,
            textColor: textColor
        }
    };

    addToCart(customProduct);
    alert("Custom Design Added to Cart!");
    navigate('/cart');
  };

  return (
    <div className="bg-[#F9F9F9] min-h-screen pb-24 relative">
      
      <CustomizeHeader step={step} onBack={handleBack} />

      {/* STEP 1 */}
      {step === 1 && (
        <div className="p-4 animate-fade-in">
          <AIGenerator 
            prompt={prompt} setPrompt={setPrompt} 
            onGenerate={handleGenerate} isGenerating={isGenerating} 
          />
          <ProductGrid 
            products={recommendedProducts} 
            onSelect={handleSelectProduct} 
          />
        </div>
      )}

      {/* STEP 2 */}
      {step === 2 && selectedProduct && (
        <div className="flex flex-col h-[calc(100vh-80px)]">
          <LivePreview 
            product={selectedProduct}
            customText={customText} textColor={textColor} customColor={customColor}
          />
          
          <ToolsPanel 
            product={selectedProduct}
            customText={customText} setCustomText={setCustomText}
            textColor={textColor} setTextColor={setTextColor}
            customColor={customColor} setCustomColor={setCustomColor}
          />

          {/* ✅ Added Sticky Add to Cart Button */}
          <div className="fixed bottom-20 left-0 w-full p-4 z-30">
            <button 
                onClick={handleAddToCart}
                className="w-full bg-[#FF6B6B] text-white py-3.5 rounded-xl font-bold shadow-lg shadow-[#FF6B6B]/30 flex items-center justify-center gap-2 active:scale-95 transition-transform"
            >
                <ShoppingBag size={20} /> Add to Cart - ₹{selectedProduct.price}
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Customize;