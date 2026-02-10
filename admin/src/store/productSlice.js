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

// 2. Fetch Pending Products (Approvals Page)
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

// 3. Fetch Single Product Details
export const fetchProductDetails = createAsyncThunk(
  "products/fetchDetails",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/admin/products/${id}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch product details");
    }
  }
);

// 4. Update Product Status (Approve/Reject)
export const updateProductStatus = createAsyncThunk(
  "products/updateStatus",
  async ({ id, status, reason }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/admin/approvals/products/${id}`, { status, reason });
      return response.data.data; // Returns full product object
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update status");
    }
  }
);

// 5. Edit Product (Admin Edit Page)
export const editProduct = createAsyncThunk(
  "products/edit",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/admin/products/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to edit product");
    }
  }
);

// 6. Hard Delete Product
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
      // --- Fetch All ---
      .addCase(fetchProducts.pending, (state) => { state.loading = true; })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.totalProducts = action.payload.total || 0;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // --- Fetch Pending ---
      .addCase(fetchPendingProducts.pending, (state) => { state.loading = true; })
      .addCase(fetchPendingProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingList = action.payload;
      })

      // --- Fetch Details ---
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.currentProduct = action.payload;
      })

      // --- Update Status ---
      .addCase(updateProductStatus.fulfilled, (state, action) => {
        const updatedProduct = action.payload;
        
        // 1. Remove from Pending List
        state.pendingList = state.pendingList.filter(p => p._id !== updatedProduct._id);
        
        // 2. Update in Main Product List
        const index = state.products.findIndex(p => p._id === updatedProduct._id);
        if (index !== -1) {
          state.products[index] = updatedProduct; 
        }
        
        // 3. Update Current Product View
        if (state.currentProduct?._id === updatedProduct._id) {
          state.currentProduct = updatedProduct;
        }
      })

      // --- Edit Product ---
      .addCase(editProduct.fulfilled, (state, action) => {
        state.currentProduct = action.payload;
        // Also update in list if present
        const index = state.products.findIndex(p => p._id === action.payload._id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })

      // --- Delete Product ---
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