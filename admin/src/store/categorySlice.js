import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";

// --- THUNKS ---

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

// Fetch Root Categories (Only parents)
export const fetchRootCategories = createAsyncThunk(
  "categories/fetchRoots",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/categories/root");
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
      // Axios automatically sets Content-Type to multipart/form-data when sending FormData
      const response = await api.post("/categories", formData);
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
      const response = await api.put(`/categories/${id}`, formData);
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

// --- SLICE ---

const categorySlice = createSlice({
  name: "categories",
  initialState: {
    categories: [],      // All categories
    rootCategories: [],  // Just root categories (for dropdowns etc)
    loading: false,      // For fetching lists
    actionLoading: false, // For Create/Update/Delete actions (prevents double clicks)
    error: null,
  },
  reducers: {
    clearCategoryErrors: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // --- Fetch All ---
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

      // --- Fetch Roots ---
      .addCase(fetchRootCategories.fulfilled, (state, action) => {
        state.rootCategories = action.payload;
      })

      // --- Create ---
      .addCase(createCategory.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.actionLoading = false;
        // Add to top of list immediately
        state.categories.unshift(action.payload);
        // If it's a root category, add to root list too
        if (!action.payload.parentId) {
            state.rootCategories.unshift(action.payload);
        }
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
        // Update in main list
        const index = state.categories.findIndex((c) => c._id === action.payload._id);
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
        // Update in root list (complex logic skipped, simpler to just refetch or ignore if strict consistency needed)
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      // --- Delete ---
      .addCase(deleteCategory.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.categories = state.categories.filter((c) => c._id !== action.payload);
        state.rootCategories = state.rootCategories.filter((c) => c._id !== action.payload);
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCategoryErrors } = categorySlice.actions;
export default categorySlice.reducer;