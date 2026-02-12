import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';

export const fetchBanners = createAsyncThunk(
  "banners/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/banners");  
      return response.data.data; 
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch banners");
    }
  }
);

const bannerSlice = createSlice({
  name: 'banners',
  initialState: {
    list: [],  
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBanners.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBanners.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload || []; // Fallback to empty array if payload is null
      })
      .addCase(fetchBanners.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default bannerSlice.reducer;