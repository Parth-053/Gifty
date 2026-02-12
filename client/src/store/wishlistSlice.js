import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';
import toast from 'react-hot-toast';

// 1. Fetch Wishlist
export const fetchWishlist = createAsyncThunk(
  'wishlist/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/wishlist');
      return response.data.data; // Expecting array of items
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch wishlist');
    }
  }
);

// 2. Toggle Wishlist Item (Add/Remove)
export const toggleWishlistItem = createAsyncThunk(
  'wishlist/toggle',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await api.post(`/wishlist/toggle/${productId}`);
      const isAdded = response.data.message.toLowerCase().includes("added");
      
      // Optional: Show toast
      if (isAdded) toast.success("Added to Wishlist");
      else toast.success("Removed from Wishlist");

      return { 
        productId, 
        added: isAdded,
        wishlist: response.data.data // Expecting updated list
      };
    } catch (error) {
      toast.error("Failed to update wishlist");
      return rejectWithValue(error.response?.data?.message || 'Failed to update wishlist');
    }
  }
);

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    // Optional: Manual remove if needed directly
    removeFromWishlist: (state, action) => {
      const productId = action.payload;
      state.items = state.items.filter(item => item._id !== productId);
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Toggle
      .addCase(toggleWishlistItem.fulfilled, (state, action) => {
        // If backend returns the full list, use it
        if (action.payload.wishlist) {
            state.items = action.payload.wishlist;
        } 
      });
  },
});

export const { removeFromWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;