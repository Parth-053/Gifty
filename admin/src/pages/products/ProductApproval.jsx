import React from 'react';
import ProductsList from './ProductsList'; // Reuse List but pre-filtered

const ProductApproval = () => {
  return (
    <div className="space-y-4">
      <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl">
        <h2 className="text-lg font-bold text-orange-800">Review Queue</h2>
        <p className="text-sm text-orange-600">These products require admin approval before going live.</p>
      </div>
      {/* We reuse the list but conceptually this page would force the filter to 'Pending' */}
      <ProductsList />
    </div>
  );
};

export default ProductApproval;