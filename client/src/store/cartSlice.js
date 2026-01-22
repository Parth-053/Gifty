import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';
import toast from 'react-hot-toast';

// 1. Fetch Cart
export const fetchCart = createAsyncThunk(
  'cart/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/cart');
      return response.data.data; // Expecting { items: [], totalAmount: 0 }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch cart');
    }
  }
);

// 2. Add to Cart
export const addToCart = createAsyncThunk(
  'cart/add',
  async ({ productId, quantity, variant, customization }, { rejectWithValue }) => {
    try {
      const response = await api.post('/cart', { 
        productId, 
        quantity, 
        variant,
        customization 
      });
      toast.success("Added to bag!");
      return response.data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add item');
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// 3. Update Quantity
export const updateCartItem = createAsyncThunk(
  'cart/update',
  async ({ itemId, quantity }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/cart/${itemId}`, { quantity });
      return response.data.data;
    } catch (error) {
      toast.error('Failed to update quantity');
      return rejectWithValue(error.message);
    }
  }
);

// 4. Remove Item
export const removeFromCart = createAsyncThunk(
  'cart/remove',
  async (itemId, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/cart/${itemId}`);
      toast.success("Item removed");
      return response.data.data;
    } catch (error) {
      toast.error('Failed to remove item');
      return rejectWithValue(error.message);
    }
  }
);

// 5. Clear Cart (After Order)
export const clearCart = createSlice({
  name: 'cart',
  initialState: { items: [], totalAmount: 0 },
  reducers: {
    resetCart: (state) => {
      state.items = [];
      state.totalAmount = 0;
    }
  }
}).actions.resetCart;

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    totalAmount: 0,
    loading: false,
    error: null,
  },
  reducers: {
    // Optimistic clear (can be used before API confirmation if needed)
    localClearCart: (state) => {
      state.items = [];
      state.totalAmount = 0;
    }
  },
  extraReducers: (builder) => {
    builder
      // --- Fetch Cart ---
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.totalAmount = action.payload.totalAmount;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // --- Add to Cart ---
      .addCase(addToCart.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.totalAmount = action.payload.totalAmount;
      })

      // --- Update Item ---
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.totalAmount = action.payload.totalAmount;
      })

      // --- Remove Item ---
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.totalAmount = action.payload.totalAmount;
      });
      
      // NOTE: If you add .addMatcher() here, it MUST come AFTER all .addCase() calls above.
  },
});

export const { localClearCart } = cartSlice.actions;
export default cartSlice.reducer;