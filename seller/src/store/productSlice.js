import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';
 
export const fetchSellerProducts = createAsyncThunk('product/fetchAll', async () => {
  const response = await api.get('/seller/inventory');
  return response.data.data; 
});

export const fetchProductById = createAsyncThunk('product/fetchById', async (id) => {
  const response = await api.get(`/seller/inventory/${id}`);
  return response.data.data;
});

export const addProduct = createAsyncThunk('product/add', async (formData) => {
  const response = await api.post('/seller/inventory', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data.data;
});

export const updateProduct = createAsyncThunk('product/update', async ({ id, formData }) => {
  const response = await api.put(`/seller/inventory/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data.data;
});

export const deleteProduct = createAsyncThunk('product/delete', async (id) => {
  await api.delete(`/seller/inventory/${id}`);
  return id;
});

const productSlice = createSlice({
  name: 'product',
  // FIX 1: Added pagination to initial state
  initialState: { 
    items: [], 
    pagination: null, 
    currentProduct: null, 
    loading: false 
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSellerProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSellerProducts.fulfilled, (state, action) => {
        state.loading = false;
        // FIX 2: Correctly extract products array and pagination object
        // The payload is { products: [...], pagination: {...} }
        state.items = action.payload.products || []; 
        state.pagination = action.payload.pagination || null;
      })
      .addCase(fetchSellerProducts.rejected, (state) => {
        state.loading = false;
        state.items = [];
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.currentProduct = action.payload;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        // Optimistically add to list
        state.items.unshift(action.payload);
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        // This filter now works because state.items is guaranteed to be an array
        state.items = state.items.filter(item => item._id !== action.payload);
      });
  }
});

export default productSlice.reducer;