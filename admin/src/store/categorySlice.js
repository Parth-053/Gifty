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
      // FIX: Do NOT set "Content-Type": "multipart/form-data" manually!
      // Axios detects FormData and adds the correct header with the boundary automatically.
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
      // FIX: Do NOT set headers manually here either.
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
    categories: [],      
    rootCategories: [],  
    loading: false,      
    actionLoading: false, 
    error: null,
  },
  reducers: {
    clearCategoryErrors: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All
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

      // Fetch Roots
      .addCase(fetchRootCategories.fulfilled, (state, action) => {
        state.rootCategories = action.payload;
      })

      // Create
      .addCase(createCategory.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.categories.unshift(action.payload);
        if (!action.payload.parentId) {
            state.rootCategories.unshift(action.payload);
        }
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      // Update
      .addCase(updateCategory.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.actionLoading = false;
        const updatedCat = action.payload;

        // 1. Update in main list
        const index = state.categories.findIndex((c) => c._id === updatedCat._id);
        if (index !== -1) {
          state.categories[index] = updatedCat;
        }

        // 2. Handle Root List Synchronization
        const rootIndex = state.rootCategories.findIndex((c) => c._id === updatedCat._id);

        if (!updatedCat.parentId) {
          // It is a root category
          if (rootIndex !== -1) {
            state.rootCategories[rootIndex] = updatedCat;
          } else {
            state.rootCategories.unshift(updatedCat);
          }
        } else {
          // It is now a child category, remove from roots if present
          if (rootIndex !== -1) {
            state.rootCategories.splice(rootIndex, 1);
          }
        }
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      // Delete
      .addCase(deleteCategory.pending, (state) => {
        state.actionLoading = true;
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