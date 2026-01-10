import React from 'react';
import SellersList from './SellersList';

const SellerApproval = () => {
  return (
    <div className="space-y-4">
       <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl">
        <h2 className="text-lg font-bold text-blue-800">New Seller Requests</h2>
        <p className="text-sm text-blue-600">Review KYC and verify new vendors.</p>
      </div>
      <SellersList />
    </div>
  );
};

export default SellerApproval;