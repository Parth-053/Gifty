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
      const response = await api.put(`/admin/approvals/sellers/${id}`, { 
        status, 
        reason 
      });
      return { id, status, data: response.data.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Action failed");
    }
  }
);

// --- Slice ---

const sellerSlice = createSlice({
  name: "sellers",
  initialState: {
    sellers: [],        // <--- This was missing!
    pendingSellers: [],
    currentSeller: null,
    loading: false,
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
      .addCase(verifySeller.fulfilled, (state, action) => {
        // Remove from pending
        state.pendingSellers = state.pendingSellers.filter(
          (seller) => seller._id !== action.payload.id
        );
        // If approved, add to main list (optional, but good for UX)
        if (action.payload.status === 'approved') {
            state.sellers.push(action.payload.data);
        }
      });
  },
});

export const { clearCurrentSeller } = sellerSlice.actions;
export default sellerSlice.reducer;