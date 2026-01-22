import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ShieldCheck, ShoppingBag } from 'lucide-react';

// Components
import CartItem from '../../components/cart/CartItem';
import BillDetails from '../../components/cart/BillDetails';
import CouponInput from '../../components/cart/CouponInput';
import EmptyCart from '../../components/cart/EmptyCart';
import CheckoutSteps from '../../components/checkout/CheckoutSteps';
import Button from '../../components/common/Button';

const Cart = () => {
  const navigate = useNavigate();
  // Get real cart data from Redux Store
  const { items } = useSelector((state) => state.cart);

  if (!items || items.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 pb-24 md:pb-12">
      {/* Visual Step Indicator: Step 1 */}
      <CheckoutSteps currentStep={1} />

      <div className="flex items-center gap-2 mb-6">
        <ShoppingBag className="text-blue-600" />
        <h1 className="text-2xl font-black text-gray-900">My Shopping Bag ({items.length})</h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 relative">
        
        {/* Left Column: Cart Items */}
        <div className="flex-1 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-100">
            {items.map((item) => (
              <CartItem key={item._id} item={item} />
            ))}
          </div>

          {/* Trust Badge */}
          <div className="flex items-center justify-center gap-2 text-gray-500 text-xs bg-blue-50/50 p-4 rounded-xl border border-blue-100">
            <ShieldCheck className="text-green-600" size={16} />
            <span>Generic SSL Secure Payment. 100% Authentic Products.</span>
          </div>
        </div>

        {/* Right Column: Summary & Coupon */}
        <div className="lg:w-[380px] flex-shrink-0 space-y-6 h-fit lg:sticky lg:top-24">
          <CouponInput />
          
          <BillDetails />
          
          <Button 
            onClick={() => navigate('/checkout')} 
            fullWidth 
            size="lg" 
            className="shadow-xl shadow-blue-200"
            icon={ArrowRight}
          >
            Proceed to Checkout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Cart;