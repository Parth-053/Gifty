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
  initialState: { items: [], currentProduct: null, loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSellerProducts.fulfilled, (state, action) => { state.items = action.payload; })
      .addCase(fetchProductById.fulfilled, (state, action) => { state.currentProduct = action.payload; })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item._id !== action.payload);
      });
  }
});

export default productSlice.reducer;