import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  fetchCart, 
  addToCart as addToCartAction, 
  removeFromCart as removeFromCartAction, 
  updateCartItem as updateCartItemAction,
  clearCart as clearCartAction
} from '../store/cartSlice';
import toast from 'react-hot-toast';

export const useCart = () => {
  const dispatch = useDispatch();
  const { items, totalAmount, totalItems, loading } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);

  // Sync cart with backend when user logs in
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart());
    }
  }, [isAuthenticated, dispatch]);

  const addToCart = async (product, quantity = 1, variant = null) => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart");
      return;
    }
    
    try {
      await dispatch(addToCartAction({ 
        productId: product._id, 
        quantity, 
        variant 
      })).unwrap();
      toast.success("Added to cart");
    } catch (error) {
      toast.error(error || "Failed to add item");
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      await dispatch(removeFromCartAction(itemId)).unwrap();
      toast.success("Item removed");
    } catch  {
      toast.error("Failed to remove item");
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    if (quantity < 1) return;
    try {
      await dispatch(updateCartItemAction({ itemId, quantity })).unwrap();
    } catch {
      toast.error("Failed to update quantity");
    }
  };

  const clearCart = () => {
    dispatch(clearCartAction());
  };

  return {
    cartItems: items,
    cartTotal: totalAmount,
    cartCount: totalItems,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart
  };
};

export default useCart;