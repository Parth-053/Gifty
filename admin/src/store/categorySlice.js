import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios"; 

/**
 * 1. Fetch All Categories (Tree Structure)
 * Backend should return nested categories or flat list (we can handle both)
 */
export const fetchCategories = createAsyncThunk(
  "categories/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      // Assuming GET /categories returns the full tree
      const response = await api.get("/categories"); 
      return response.data.data; // Expecting array of categories
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch categories");
    }
  }
);

/**
 * 2. Add New Category
 * Supports Image Upload (FormData)
 */
export const createCategory = createAsyncThunk(
  "categories/add",
  async (formData, { rejectWithValue }) => {
    try {
      // Content-Type: multipart/form-data is handled automatically by axios when passing FormData
      const response = await api.post("/categories", formData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to create category");
    }
  }
);

/**
 * 3. Update Category
 * Supports Image Update
 */
export const updateCategory = createAsyncThunk(
  "categories/update",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/categories/${id}`, formData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update category");
    }
  }
);

/**
 * 4. Delete Category
 */
export const deleteCategory = createAsyncThunk(
  "categories/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/categories/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete category");
    }
  }
);

// ==========================================
// Helper: Recursive Update Logic
// ==========================================

const deleteFromTree = (categories, idToDelete) => {
  return categories
    .filter((cat) => cat._id !== idToDelete)
    .map((cat) => ({
      ...cat,
      children: cat.children ? deleteFromTree(cat.children, idToDelete) : [],
    }));
};

const updateInTree = (categories, updatedCat) => {
  return categories.map((cat) => {
    if (cat._id === updatedCat._id) return updatedCat;
    if (cat.children) {
      return { ...cat, children: updateInTree(cat.children, updatedCat) };
    }
    return cat;
  });
};

// ==========================================
//  Slice Definition
// ==========================================

const categorySlice = createSlice({
  name: "categories",
  initialState: {
    list: [], // The Category Tree
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearMessages: (state) => {
      state.successMessage = null;
      state.error = null;
    }
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
        state.list = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // --- Add Category ---
      .addCase(createCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = "Category added successfully";
        // Option A: Refetch list (Easiest) -> dispatch(fetchCategories()) in UI
        // Option B: Push to list (if it's a root category)
        // Since it's a tree, refetching is safer.
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // --- Update Category ---
      .addCase(updateCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = "Category updated successfully";
        // Update local state recursively
        state.list = updateInTree(state.list, action.payload);
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // --- Delete Category ---
      .addCase(deleteCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = "Category deleted successfully";
        // Remove from local state recursively
        state.list = deleteFromTree(state.list, action.payload);
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearMessages } = categorySlice.actions;
export default categorySlice.reducer;