import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";

// 1. Fetch All Banners
export const fetchBanners = createAsyncThunk(
  "banners/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/banners"); // Public or Admin route
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch banners");
    }
  }
);

// 2. Add New Banner (With Image)
export const createBanner = createAsyncThunk(
  "banners/add",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post("/admin/banners", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to add banner");
    }
  }
);

// 3. Delete Banner
export const deleteBanner = createAsyncThunk(
  "banners/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/admin/banners/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete banner");
    }
  }
);

const bannerSlice = createSlice({
  name: "banners",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchBanners.pending, (state) => { state.loading = true; })
      .addCase(fetchBanners.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchBanners.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create
      .addCase(createBanner.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      // Delete
      .addCase(deleteBanner.fulfilled, (state, action) => {
        state.list = state.list.filter(b => b._id !== action.payload);
      });
  },
});

export default bannerSlice.reducer;