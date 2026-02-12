import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';
import toast from 'react-hot-toast';

// --- ASYNC THUNKS ---

// 1. Fetch Cart (Was missing)
export const fetchCart = createAsyncThunk(
  'cart/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/cart');
      return response.data; // Expecting { data: { items: [], totalQty: 0, totalAmount: 0 } }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch cart');
    }
  }
);

// 2. Add to Cart
export const addToCart = createAsyncThunk(
  'cart/add',
  async ({ productId, quantity = 1, variant = '', customization = {} }, { rejectWithValue }) => {
    try {
      const response = await api.post('/cart/add', { productId, quantity, variant, customization });
      return response.data; 
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add to cart');
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    totalQty: 0,
    totalAmount: 0,
    loading: false,
    error: null,
  },
  reducers: {
    // 3. Update Cart Item (Matches useCart hook)
    updateCartItem: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((i) => i._id === id);
      
      if (item) {
        item.quantity = Math.max(1, quantity);
        
        // Recalculate totals client-side
        state.totalQty = state.items.reduce((acc, i) => acc + i.quantity, 0);
        state.totalAmount = state.items.reduce((acc, i) => acc + (i.price * i.quantity), 0);
      }
    },

    // 4. Update Quantity (Alias for consistency)
    updateQuantity: (state, action) => {
      cartSlice.caseReducers.updateCartItem(state, action);
    },

    // 5. Remove Item
    removeFromCart: (state, action) => {
      const id = action.payload;
      state.items = state.items.filter((i) => i._id !== id);
      
      // Recalculate totals
      state.totalQty = state.items.reduce((acc, i) => acc + i.quantity, 0);
      state.totalAmount = state.items.reduce((acc, i) => acc + (i.price * i.quantity), 0);
      toast.success("Item removed");
    },

    // 6. Clear Cart
    clearCart: (state) => {
      state.items = [];
      state.totalQty = 0;
      state.totalAmount = 0;
    }
  },
  extraReducers: (builder) => {
    builder
      // --- Fetch Cart Handlers ---
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        const cartData = action.payload.data || action.payload || {};
        state.items = cartData.items || [];
        state.totalQty = cartData.totalQty || 0;
        state.totalAmount = cartData.totalAmount || 0;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // --- Add to Cart Handlers ---
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        const cartData = action.payload.data || action.payload || {};
        state.items = cartData.items || [];
        state.totalQty = cartData.totalQty || 0;
        state.totalAmount = cartData.totalAmount || 0;
        toast.success("Added to cart!");
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(typeof action.payload === 'string' ? action.payload : 'Failed to add item');
      });
  },
});

// EXPORT EVERYTHING
export const { updateCartItem, updateQuantity, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;