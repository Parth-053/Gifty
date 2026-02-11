import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";

// --- Thunks ---

// 1. Fetch ALL Active Sellers (For Sellers List)
export const fetchSellers = createAsyncThunk(
  "sellers/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/admin/sellers");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch sellers"
      );
    }
  }
);

// 2. Fetch Pending Sellers (For Approvals Page)
export const fetchPendingSellers = createAsyncThunk(
  "sellers/fetchPending",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/admin/approvals/sellers");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch pending sellers"
      );
    }
  }
);

// 3. Fetch Single Seller Details
export const fetchSellerDetails = createAsyncThunk(
  "sellers/fetchDetails",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/admin/sellers/${id}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch details");
    }
  }
);

// 4. Approve/Reject Seller
export const verifySeller = createAsyncThunk(
  "sellers/verify",
  async ({ id, status, reason }, { rejectWithValue }) => {
    try {
      // Note: adjust route if your backend expects PATCH vs PUT
      const response = await api.patch(`/admin/approvals/sellers/${id}`, { 
        status, 
        reason 
      });
      return { id, status, data: response.data.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Action failed");
    }
  }
);

// 5. Update Seller Status (Ban / Unban)
export const updateSellerStatus = createAsyncThunk(
  "sellers/updateStatus",
  async ({ id, action }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/admin/sellers/${id}/status`, { action });
      return response.data.data; // Returns updated seller object
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update seller status");
    }
  }
);

// 6. Hard Delete Seller & Assets
export const deleteSeller = createAsyncThunk(
  "sellers/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/admin/sellers/${id}`);
      return id; // Return ID to remove from lists locally
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete seller");
    }
  }
);

// --- Slice ---

const sellerSlice = createSlice({
  name: "sellers",
  initialState: {
    sellers: [],        
    pendingSellers: [],
    currentSeller: null,
    loading: false,
    actionLoading: false, // Added for button spinners
    error: null,
  },
  reducers: {
    clearCurrentSeller: (state) => {
      state.currentSeller = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // --- Fetch All Sellers ---
      .addCase(fetchSellers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSellers.fulfilled, (state, action) => {
        state.loading = false;
        state.sellers = action.payload;
      })
      .addCase(fetchSellers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // --- Fetch Pending Sellers ---
      .addCase(fetchPendingSellers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPendingSellers.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingSellers = action.payload;
      })
      .addCase(fetchPendingSellers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // --- Fetch Single Seller ---
      .addCase(fetchSellerDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSellerDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.currentSeller = action.payload;
      })
      .addCase(fetchSellerDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // --- Verify Seller ---
      .addCase(verifySeller.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(verifySeller.fulfilled, (state, action) => {
        state.actionLoading = false;
        // Remove from pending list
        state.pendingSellers = state.pendingSellers.filter(
          (seller) => seller._id !== action.payload.id
        );
        // If approved, push to main list
        if (action.payload.status === 'approved') {
            state.sellers.push(action.payload.data);
        }
      })
      .addCase(verifySeller.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      // --- Update Status (Ban/Unban) ---
      .addCase(updateSellerStatus.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(updateSellerStatus.fulfilled, (state, action) => {
        state.actionLoading = false;
        // Update current viewed seller
        if (state.currentSeller && state.currentSeller._id === action.payload._id) {
            state.currentSeller = { ...state.currentSeller, ...action.payload };
        }
        // Update in sellers array
        const index = state.sellers.findIndex(s => s._id === action.payload._id);
        if (index !== -1) {
            state.sellers[index] = action.payload;
        }
      })
      .addCase(updateSellerStatus.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      // --- Delete Seller ---
      .addCase(deleteSeller.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(deleteSeller.fulfilled, (state, action) => {
        state.actionLoading = false;
        // Clear current view if we deleted the person we are looking at
        if (state.currentSeller && state.currentSeller._id === action.payload) {
            state.currentSeller = null;
        }
        // Remove from sellers list
        state.sellers = state.sellers.filter((s) => s._id !== action.payload);
        // Remove from pending list (just in case)
        state.pendingSellers = state.pendingSellers.filter((s) => s._id !== action.payload);
      })
      .addCase(deleteSeller.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCurrentSeller } = sellerSlice.actions;
export default sellerSlice.reducer;