import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";

// 1. Fetch All Products (Public/General List)
export const fetchProducts = createAsyncThunk(
  "products/fetchAll",
  async (params, { rejectWithValue }) => {
    try {
      // Using public route since Admin route doesn't exist yet for "all"
      // Params: { page, limit, sort, search }
      const response = await api.get("/products", { params });
      return response.data.data; // { products: [], totalDocs: 100 }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch products");
    }
  }
);

// 2. Fetch Pending Products (For Approval Page)
export const fetchPendingProducts = createAsyncThunk(
  "products/fetchPending",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/admin/approvals/products");
      return response.data.data; // Expecting array of pending products
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch pending products");
    }
  }
);

// 3. Fetch Single Product Details
export const fetchProductDetails = createAsyncThunk(
  "products/fetchDetails",
  async (slugOrId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/products/${slugOrId}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch product details");
    }
  }
);

// 4. Approve or Reject Product
export const updateProductStatus = createAsyncThunk(
  "products/updateStatus",
  async ({ id, status, reason }, { rejectWithValue }) => {
    try {
      // Backend expects: { status: 'approved' | 'rejected', reason: '...' }
      // Route: PATCH /admin/approvals/products/:id
      const response = await api.patch(`/admin/approvals/products/${id}`, { 
        status, 
        reason 
      });
      return { id, status, product: response.data.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Update failed");
    }
  }
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    products: [],      // General List
    pendingList: [],   // Approval List
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
      // --- Fetch All ---
      .addCase(fetchProducts.pending, (state) => { state.loading = true; })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.totalProducts = action.payload.totalDocs;
      })
      
      // --- Fetch Pending ---
      .addCase(fetchPendingProducts.pending, (state) => { state.loading = true; })
      .addCase(fetchPendingProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingList = action.payload;
      })

      // --- Fetch Details ---
      .addCase(fetchProductDetails.pending, (state) => { state.loading = true; })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProduct = action.payload;
      })

      // --- Update Status ---
      .addCase(updateProductStatus.fulfilled, (state, action) => {
        // Remove from pending list
        state.pendingList = state.pendingList.filter(p => p._id !== action.payload.id);
        
        // Update in general list if exists
        const index = state.products.findIndex(p => p._id === action.payload.id);
        if (index !== -1) {
          state.products[index].verificationStatus = action.payload.status;
        }
        
        // Update current product view
        if (state.currentProduct?._id === action.payload.id) {
          state.currentProduct.verificationStatus = action.payload.status;
        }
      });
  },
});

export const { clearCurrentProduct } = productSlice.actions;
export default productSlice.reducer;