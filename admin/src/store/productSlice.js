import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";

// 1. Fetch All Products (Admin View)
export const fetchProducts = createAsyncThunk(
  "products/fetchAll",
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.get("/admin/products", { params });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch products");
    }
  }
);

// 2. Fetch Pending Products
export const fetchPendingProducts = createAsyncThunk(
  "products/fetchPending",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/admin/approvals/products");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch pending products");
    }
  }
);

// 3. Fetch Single Product Details (FIXED for Admin)
export const fetchProductDetails = createAsyncThunk(
  "products/fetchDetails",
  async (id, { rejectWithValue }) => {
    try {
      // --- FIX: Use ADMIN route to avoid 404 on pending/deleted items ---
      const response = await api.get(`/admin/products/${id}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch product details");
    }
  }
);

export const updateProductStatus = createAsyncThunk(
  "products/updateStatus",
  async ({ id, status, reason }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/admin/approvals/products/${id}`, { status, reason });
      // Ensure we return the FULL updated object from backend to update state correctly
      return response.data.data; 
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update status");
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "products/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/admin/products/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Delete failed");
    }
  }
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    products: [],      
    pendingList: [],   
    currentProduct: null,
    totalProducts: 0,
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.totalProducts = action.payload.total || 0;
      })
      
      // Fetch Pending
      .addCase(fetchPendingProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingList = action.payload;
      })

      // Fetch Details
      .addCase(fetchProductDetails.pending, (state) => { state.loading = true; })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProduct = action.payload;
      })

      // Update Status (Optimistic/Immediate UI Update)
      .addCase(updateProductStatus.fulfilled, (state, action) => {
        const updatedProduct = action.payload;
        
        // 1. Remove from Pending List if it was there
        state.pendingList = state.pendingList.filter(p => p._id !== updatedProduct._id);
        
        // 2. Update in Main Product List if it exists there
        const index = state.products.findIndex(p => p._id === updatedProduct._id);
        if (index !== -1) {
          state.products[index] = updatedProduct; 
        }
        
        // 3. Update Current Product View if open
        if (state.currentProduct?._id === updatedProduct._id) {
          state.currentProduct = updatedProduct;
        }
      })

      // Delete Product (Immediate UI Update)
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter(p => p._id !== action.payload);
        state.totalProducts -= 1;
        if (state.currentProduct?._id === action.payload) {
            state.currentProduct = null;
        }
      });
  },
});

export const { clearCurrentProduct } = productSlice.actions;
export default productSlice.reducer;