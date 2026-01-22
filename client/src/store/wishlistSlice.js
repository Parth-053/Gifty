import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';

// Fetch Wishlist
export const fetchWishlist = createAsyncThunk(
  'wishlist/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/wishlist');
      return response.data.data; // Array of items
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// Toggle Wishlist Item (Add/Remove)
export const toggleWishlistItem = createAsyncThunk(
  'wishlist/toggle',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await api.post(`/wishlist/toggle/${productId}`);
      return { 
        productId, 
        added: response.data.message.includes("added"), // Helper to know if added or removed
        wishlist: response.data.data 
      };
    } catch   {
      return rejectWithValue('Failed to update wishlist');
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
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];
      })
      .addCase(toggleWishlistItem.fulfilled, (state, action) => {
        // Option A: Use the list returned from backend
        if(action.payload.wishlist) {
            state.items = action.payload.wishlist;
        } 
        // Option B: Optimistic update if backend didn't return full list (commented out)
        /*
        if (action.payload.added) {
           // We need product details for optimistic add, usually better to refetch or use returned list
        } else {
           state.items = state.items.filter(item => item.product._id !== action.payload.productId);
        }
        */
      });
  },
});

export default wishlistSlice.reducer;