import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Sparkles } from 'lucide-react';

// Components
import ProductImages from '../../components/product/ProductImages';
import ProductInfo from '../../components/product/ProductInfo';
import ReviewsList from '../../components/product/ReviewsList';
import ProductGrid from '../../components/product/ProductGrid';
import Loader from '../../components/common/Loader';

// Actions
import { fetchProductById, clearCurrentProduct, fetchProducts } from '../../store/productSlice';

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  
  // Get Current Product & List (for related items)
  const { currentProduct, items: relatedProducts, loading } = useSelector((state) => state.products);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (id) {
      dispatch(fetchProductById(id));
    }
    // Cleanup on unmount
    return () => {
      dispatch(clearCurrentProduct());
    };
  }, [dispatch, id]);

  // Fetch related products when current product loads
  useEffect(() => {
    if (currentProduct?.category?._id) {
      dispatch(fetchProducts({ 
        category: currentProduct.category._id, 
        limit: 4 
      }));
    }
  }, [dispatch, currentProduct]);

  if (loading || !currentProduct) {
    return <Loader fullScreen text="Loading product..." />;
  }

  // Filter out the current product from related list
  const filteredRelated = relatedProducts.filter(p => p._id !== currentProduct._id).slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 pb-24 md:pb-12">
      
      {/* 1. Main Details Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 mb-16">
        {/* Left: Gallery */}
        <ProductImages images={currentProduct.images} />
        
        {/* Right: Info & Actions */}
        <ProductInfo product={currentProduct} />
      </div>

      {/* 2. Reviews Section */}
      <div className="max-w-4xl mx-auto mb-16">
        <ReviewsList reviews={currentProduct.reviews} />
      </div>

      {/* 3. Related Products */}
      {filteredRelated.length > 0 && (
        <div className="border-t border-gray-100 pt-12">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="text-yellow-500" size={20} />
            <h2 className="text-xl font-black text-gray-900">You might also like</h2>
          </div>
          <ProductGrid products={filteredRelated} />
        </div>
      )}
    </div>
  );
};

export default ProductDetails;