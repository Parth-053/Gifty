import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";

// Fetch All Banners
export const fetchBanners = createAsyncThunk(
  "banners/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/banners");
      return response.data.data; // Expecting array of banners
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Create Banner (Supports Image Upload)
export const createBanner = createAsyncThunk(
  "banners/create",
  async (formData, { rejectWithValue }) => {
    try {
      // Axios automatically detects FormData and sets 'multipart/form-data'
      const response = await api.post("/banners", formData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Delete Banner
export const deleteBanner = createAsyncThunk(
  "banners/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/banners/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const bannerSlice = createSlice({
  name: "banners",
  initialState: {
    banners: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchBanners.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBanners.fulfilled, (state, action) => {
        state.loading = false;
        state.banners = action.payload;
      })
      .addCase(fetchBanners.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create
      .addCase(createBanner.fulfilled, (state, action) => {
        state.banners.push(action.payload);
      })
      // Delete
      .addCase(deleteBanner.fulfilled, (state, action) => {
        state.banners = state.banners.filter((b) => b._id !== action.payload);
      });
  },
});

export default bannerSlice.reducer;