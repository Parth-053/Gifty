import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";

// Fetch All Banners
export const fetchBanners = createAsyncThunk(
  "banners/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/banners");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch Single Banner
export const fetchBannerDetails = createAsyncThunk(
  "banners/fetchOne",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/banners/${id}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Create Banner
export const createBanner = createAsyncThunk(
  "banners/create",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post("/banners", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Update Banner
export const updateBanner = createAsyncThunk(
  "banners/update",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/banners/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
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
    selectedBanner: null, // Store for the details/edit page
    loading: false,
    error: null,
  },
  reducers: {
    clearSelectedBanner: (state) => {
      state.selectedBanner = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchBanners.pending, (state) => { state.loading = true; })
      .addCase(fetchBanners.fulfilled, (state, action) => {
        state.loading = false;
        state.banners = action.payload;
      })
      .addCase(fetchBanners.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch One
      .addCase(fetchBannerDetails.pending, (state) => { state.loading = true; })
      .addCase(fetchBannerDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedBanner = action.payload;
      })
      .addCase(fetchBannerDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create
      .addCase(createBanner.fulfilled, (state, action) => {
        state.banners.push(action.payload);
      })
      // Update
      .addCase(updateBanner.fulfilled, (state, action) => {
        state.selectedBanner = action.payload;
        const index = state.banners.findIndex(b => b._id === action.payload._id);
        if (index !== -1) state.banners[index] = action.payload;
      })
      // Delete
      .addCase(deleteBanner.fulfilled, (state, action) => {
        state.banners = state.banners.filter((b) => b._id !== action.payload);
      });
  },
});

export const { clearSelectedBanner } = bannerSlice.actions;
export default bannerSlice.reducer;