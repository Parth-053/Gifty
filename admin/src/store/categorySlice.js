import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";

// Fetch All Categories
export const fetchCategories = createAsyncThunk(
  "categories/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/categories");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Create Category
export const createCategory = createAsyncThunk(
  "categories/create",
  async (formData, { rejectWithValue }) => {
    try {
      // Force Content-Type header just in case, though axios usually handles FormData automatically
      const response = await api.post("/categories", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Update Category
export const updateCategory = createAsyncThunk(
  "categories/update",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/categories/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Delete Category
export const deleteCategory = createAsyncThunk(
  "categories/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/categories/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const categorySlice = createSlice({
  name: "categories",
  initialState: {
    categories: [],
    loading: false,
    error: null,
    actionLoading: false, // New state specifically for Create/Update/Delete actions
  },
  reducers: {
    clearCategoryErrors: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // --- Fetch ---
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
      })

      // --- Create ---
      .addCase(createCategory.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.actionLoading = false;
        // Use unshift to add to the TOP of the list immediately
        state.categories.unshift(action.payload); 
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      // --- Update ---
      .addCase(updateCategory.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.actionLoading = false;
        const index = state.categories.findIndex(c => c._id === action.payload._id);
        if (index !== -1) state.categories[index] = action.payload;
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      // --- Delete ---
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter(c => c._id !== action.payload);
      });
  },
});

export const { clearCategoryErrors } = categorySlice.actions;
export default categorySlice.reducer;