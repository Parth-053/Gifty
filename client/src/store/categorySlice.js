import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';

// Backend se Categories lana
export const fetchCategories = createAsyncThunk(
  'categories/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      // API call: GET /api/v1/categories
      const response = await api.get('/categories');
      // Return empty array if data is missing to prevent .map crashes
      return response.data.data || []; 
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch categories');
    }
  }
);

const categorySlice = createSlice({
  name: 'categories',
  initialState: {
    items: [], // Ensures .map always works initially
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        // Fix: Use 'items' to match component selector
        state.items = action.payload || []; 
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        // Keep existing items if fetch fails, or set to empty array? 
        // Better to keep existing to avoid UI flash, or [] if strict.
        // state.items = []; 
      });
  },
});

export default categorySlice.reducer;