import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";

// 1. Fetch All Products (Inventory)
export const fetchProducts = createAsyncThunk(
  "products/fetchAll",
  async ({ page = 1, limit = 10, search = "", category = "" } = {}, { rejectWithValue }) => {
    try {
      let query = `/seller/inventory?page=${page}&limit=${limit}`;
      if (search) query += `&search=${search}`;
      if (category) query += `&category=${category}`;
      
      const response = await api.get(query);
      return response.data.data;  
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch inventory");
    }
  }
);

// 2. Fetch Single Product (For Edit/View)
export const fetchProductDetails = createAsyncThunk(
  "products/fetchOne",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/seller/inventory/${id}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch product details");
    }
  }
);

// 3. Create Product (Multipart Form Data)
export const createProduct = createAsyncThunk(
  "products/create",
  async (productData, { rejectWithValue }) => {
    try {
      // productData should be a FormData object
      const response = await api.post("/seller/inventory", productData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to create product");
    }
  }
);

// 4. Update Product
export const updateProduct = createAsyncThunk(
  "products/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      // data should be FormData
      const response = await api.put(`/seller/inventory/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update product");
    }
  }
);

// 5. Delete Product
export const deleteProduct = createAsyncThunk(
  "products/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/seller/inventory/${id}`);
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
    totalProducts: 0,
    currentPage: 1,
    totalPages: 1,
    loading: false,
    actionLoading: false,  
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
        state.items = action.payload.products;
        state.totalProducts = action.payload.total;
        // Calculate pagination if backend sends total docs
        state.totalPages = Math.ceil(action.payload.total / 10) || 1;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch One
      .addCase(fetchProductDetails.pending, (state) => { state.loading = true; })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProduct = action.payload;
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create
      .addCase(createProduct.pending, (state) => { state.actionLoading = true; state.error = null; })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.items.unshift(action.payload); // Add to top
        state.successMessage = "Product created successfully!";
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      // Update
      .addCase(updateProduct.pending, (state) => { state.actionLoading = true; state.error = null; })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.items = state.items.map(p => p._id === action.payload._id ? action.payload : p);
        state.currentProduct = action.payload;
        state.successMessage = "Product updated successfully!";
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      // Delete
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter(p => p._id !== action.payload);
        state.successMessage = "Product deleted.";
      });
  },
});

export const { clearProductErrors, clearCurrentProduct } = productSlice.actions;
export default productSlice.reducer;