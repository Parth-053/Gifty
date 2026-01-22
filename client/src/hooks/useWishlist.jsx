import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  fetchWishlist, 
  toggleWishlistItem 
} from '../store/wishlistSlice'; 
import toast from 'react-hot-toast';

export const useWishlist = () => {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.wishlist);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchWishlist());
    }
  }, [isAuthenticated, dispatch]);

  const isInWishlist = (productId) => {
    return items.some(item => item.product._id === productId);
  };

  const toggleWishlist = async (productId) => {
    if (!isAuthenticated) {
      toast.error("Please login to use wishlist");
      return;
    }

    try {
      const result = await dispatch(toggleWishlistItem(productId)).unwrap();
      toast.success(result.added ? "Added to wishlist" : "Removed from wishlist");
    } catch  {
      toast.error("Failed to update wishlist");
    }
  };

  return {
    wishlistItems: items,
    loading,
    isInWishlist,
    toggleWishlist
  };
};

export default useWishlist;