import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, MapPin, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

// Components
import CheckoutSteps from '../../components/checkout/CheckoutSteps';
import AddressCard from '../../components/user/AddressCard';
import PaymentForm from '../../components/checkout/PaymentForm';
import BillDetails from '../../components/cart/BillDetails';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';

// API & Actions
import api from '../../api/axios';
import { clearCart } from '../../store/cartSlice';

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // State
  const [step, setStep] = useState(2); // Start at Step 2 (Address)
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [loadingAddress, setLoadingAddress] = useState(true);
  const [processingOrder, setProcessingOrder] = useState(false);

  // Redux Data
  const { items, totalAmount } = useSelector((state) => state.cart);

  // 1. Fetch Saved Addresses on Mount
  useEffect(() => {
    // Redirect if cart is empty
    if (items.length === 0) {
      navigate('/cart');
      return;
    }

    const fetchAddresses = async () => {
      try {
        const response = await api.get('/user/addresses');
        const list = response.data.data || [];
        setAddresses(list);
        
        // Auto-select default address or first available
        const defaultAddr = list.find(a => a.isDefault) || list[0];
        if (defaultAddr) setSelectedAddress(defaultAddr);
      } catch  {
        toast.error("Could not load addresses");
      } finally {
        setLoadingAddress(false);
      }
    };
    
    fetchAddresses();
  }, [items.length, navigate]);

  // 2. Handle Order Placement
  const handlePlaceOrder = async (paymentMethod) => {
    if (!selectedAddress) {
      toast.error("Please select a delivery address");
      return;
    }

    setProcessingOrder(true);
    try {
      // Prepare payload for backend
      const orderData = {
        shippingAddress: selectedAddress._id,
        paymentMethod: paymentMethod, // 'cod' or 'online'
        items: items.map(item => ({
          product: item.product._id,
          quantity: item.quantity,
          variant: item.variant,
          price: item.price,
          // customization: item.customization // Pass customization if exists
        }))
      };

      // Call API
      const response = await api.post('/orders', orderData);
      
      if (response.data.success) {
        // Clear Redux Cart
        dispatch(clearCart());
        // Redirect to Success Page
        navigate('/checkout/success', { state: { orderId: response.data.data._id } });
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Order failed. Please try again.");
    } finally {
      setProcessingOrder(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 pb-24 md:pb-12">
      <CheckoutSteps currentStep={step} />

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* LEFT COLUMN: Main Flow */}
        <div className="flex-1">
          
          {/* STEP 2: ADDRESS SELECTION */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                  <MapPin className="text-blue-600" /> Select Delivery Address
                </h2>
                <button 
                  onClick={() => navigate('/user/addresses')}
                  className="text-sm font-bold text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                >
                  <Plus size={16} /> Manage Addresses
                </button>
              </div>

              {loadingAddress ? (
                <div className="py-12 flex justify-center"><Loader /></div>
              ) : addresses.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                  <AlertCircle className="mx-auto h-10 w-10 text-gray-400 mb-3" />
                  <p className="text-gray-500 font-bold mb-4">No saved addresses found</p>
                  <Button onClick={() => navigate('/user/addresses')}>Add New Address</Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addresses.map((addr) => (
                    <AddressCard 
                      key={addr._id} 
                      address={addr} 
                      selected={selectedAddress?._id === addr._id}
                      onSelect={() => setSelectedAddress(addr)}
                    />
                  ))}
                </div>
              )}

              <div className="pt-6 border-t border-gray-100">
                <Button 
                  onClick={() => setStep(3)} 
                  disabled={!selectedAddress}
                  fullWidth 
                  size="lg"
                >
                  Deliver Here
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3: PAYMENT METHOD */}
          {step === 3 && (
             <div className="space-y-6 animate-fade-in">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-black text-gray-900">Payment Method</h2>
                  <button 
                    onClick={() => setStep(2)} 
                    className="text-sm text-gray-500 hover:text-gray-900 underline"
                  >
                    Back to Address
                  </button>
                </div>
                
                {/* Selected Address Preview */}
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex justify-between items-center mb-6">
                  <div className="flex items-center gap-3">
                    <div className="bg-white p-2 rounded-full text-blue-600"><MapPin size={18} /></div>
                    <div>
                      <p className="text-xs font-bold text-blue-500 uppercase">Delivering To</p>
                      <p className="text-sm font-bold text-gray-900 line-clamp-1">
                        {selectedAddress?.fullName}, {selectedAddress?.postalCode}
                      </p>
                    </div>
                  </div>
                  <button onClick={() => setStep(2)} className="text-blue-600 text-xs font-bold hover:underline">
                    Change
                  </button>
                </div>

                <PaymentForm 
                  onPaymentSubmit={handlePlaceOrder} 
                  loading={processingOrder} 
                  totalAmount={totalAmount}
                />
             </div>
          )}
        </div>

        {/* RIGHT COLUMN: Bill Summary (Sticky) */}
        <div className="lg:w-[350px] flex-shrink-0 h-fit lg:sticky lg:top-24">
          <BillDetails />
        </div>

      </div>
    </div>
  );
};

export default Checkout;