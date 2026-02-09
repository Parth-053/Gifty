import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";

// Fetch All Products
export const fetchProducts = createAsyncThunk(
  "products/fetchAll",
  async ({ page = 1, limit = 10 } = {}, { rejectWithValue }) => {
    try {
      const response = await api.get(`/seller/products?page=${page}&limit=${limit}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch products");
    }
  }
);

// Fetch Single Product Details
export const fetchProductDetails = createAsyncThunk(
  "products/fetchOne",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/seller/products/${id}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch product");
    }
  }
);

// Create Product (Supports Images + Data)
export const createProduct = createAsyncThunk(
  "products/create",
  async (formData, { rejectWithValue }) => {
    try {
      // Must set Content-Type to multipart/form-data for image uploads
      const response = await api.post("/seller/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to create product");
    }
  }
);

// Update Product
export const updateProduct = createAsyncThunk(
  "products/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/seller/products/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update product");
    }
  }
);

// Delete Product
export const deleteProduct = createAsyncThunk(
  "products/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/seller/products/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete product");
    }
  }
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    currentProduct: null,
    totalPages: 1,
    currentPage: 1,
    loading: false,
    actionLoading: false, // Specific loading state for Save/Update buttons
    error: null,
    successMessage: null,
  },
  reducers: {
    clearProductErrors: (state) => {
      state.error = null;
      state.successMessage = null;
    },
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchProducts.pending, (state) => { state.loading = true; })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.products || action.payload; 
        state.totalPages = action.payload.totalPages || 1;
        state.currentPage = action.payload.currentPage || 1;
      })
      .addCase(fetchProducts.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      // Fetch One
      .addCase(fetchProductDetails.pending, (state) => { state.loading = true; })
      .addCase(fetchProductDetails.fulfilled, (state, action) => { state.loading = false; state.currentProduct = action.payload; })
      .addCase(fetchProductDetails.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      // Create
      .addCase(createProduct.pending, (state) => { state.actionLoading = true; state.error = null; state.successMessage = null; })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.items.unshift(action.payload);
        state.successMessage = "Product created successfully";
      })
      .addCase(createProduct.rejected, (state, action) => { state.actionLoading = false; state.error = action.payload; })

      // Update
      .addCase(updateProduct.pending, (state) => { state.actionLoading = true; state.error = null; state.successMessage = null; })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.currentProduct = action.payload;
        state.successMessage = "Product updated successfully";
      })
      .addCase(updateProduct.rejected, (state, action) => { state.actionLoading = false; state.error = action.payload; })

      // Delete
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter(p => p._id !== action.payload);
      });
  },
});

export const { clearProductErrors, clearCurrentProduct } = productSlice.actions;
export default productSlice.reducer;