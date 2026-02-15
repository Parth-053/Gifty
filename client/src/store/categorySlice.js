import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';

// Fetch ALL categories (For Categories Page / Admin)
export const fetchCategories = createAsyncThunk(
  'categories/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/categories');
      return response.data.data || []; 
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch categories');
    }
  }
);

// Fetch ROOT categories (For Home Page Rail / Dropdowns)
export const fetchRootCategories = createAsyncThunk(
  'categories/fetchRoots',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/categories/root');
      return response.data.data || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch root categories');
    }
  }
);

const categorySlice = createSlice({
  name: 'categories',
  initialState: {
    items: [],      // All categories
    rootItems: [],  // Root categories only
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || []; 
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch Roots
      .addCase(fetchRootCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRootCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.rootItems = action.payload || []; 
      })
      .addCase(fetchRootCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default categorySlice.reducer;