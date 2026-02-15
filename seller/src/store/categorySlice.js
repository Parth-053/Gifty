import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";

export const fetchCategories = createAsyncThunk(
  "categories/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/categories/sub");
      // Handle standard response.data.data OR fallback to response.data
      return response.data.data || response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch categories"
      );
    }
  }
);

const categorySlice = createSlice({
  name: "category",
  initialState: {
    categories: [],
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
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default categorySlice.reducer;