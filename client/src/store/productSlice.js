import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';

// 1. Fetch Trending Products (Horizontal Rail)
export const fetchTrendingProducts = createAsyncThunk(
  "products/fetchTrending",
  async ({ limit = 10 } = {}, { rejectWithValue }) => {
    try {
      const response = await api.get("/products", { params: { limit, sort: 'trending' } });
      return response.data.data; 
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch trending");
    }
  }
);

// 2. Fetch Suggested Products (Vertical Grid)
export const fetchSuggestedProducts = createAsyncThunk(
  "products/fetchSuggested",
  async ({ limit = 10 } = {}, { rejectWithValue }) => {
    try {
      const response = await api.get("/products", { params: { limit, sort: 'recommended' } });
      return response.data.data; 
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch suggestions");
    }
  }
);

// 3. General Fetch (for Shop Page)
export const fetchProducts = createAsyncThunk(
  "products/fetchAll",
  async ({ limit = 10, sort = 'newest' } = {}, { rejectWithValue }) => {
    try {
      const response = await api.get("/products", { params: { limit, sort } });
      return response.data.data;
    } catch {
      return rejectWithValue("Failed to fetch products");
    }
  }
);

// 4. FIX: Fetch Single Product by ID (Restored)
export const fetchProductById = createAsyncThunk(
  "products/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch product details");
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState: {
    list: [],         // General Shop List
    trendingList: [], // Home Page Trending
    suggestedList: [], // Home Page Suggested
    product: null,    // Single Product Details
    loading: false,
    error: null
  },
  reducers: {
    clearCurrentProduct: (state) => { state.product = null; }
  },
  extraReducers: (builder) => {
    builder
      // Trending
      .addCase(fetchTrendingProducts.fulfilled, (state, action) => {
        state.trendingList = action.payload || [];
      })
      // Suggested
      .addCase(fetchSuggestedProducts.fulfilled, (state, action) => {
        state.suggestedList = action.payload || [];
      })
      // General List
      .addCase(fetchProducts.pending, (state) => { state.loading = true; })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload || []; 
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Single Product (Fetch By ID)
      .addCase(fetchProductById.pending, (state) => { 
        state.loading = true; 
        state.error = null; 
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCurrentProduct } = productSlice.actions;
export default productSlice.reducer;