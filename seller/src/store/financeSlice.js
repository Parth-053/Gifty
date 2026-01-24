import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";

// 1. Fetch Transaction History
export const fetchTransactions = createAsyncThunk(
  "finance/fetchTransactions",
  async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/seller/finance/transactions?page=${page}&limit=${limit}`);
      return response.data.data;  
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch transactions");
    }
  }
);

// 2. Fetch Payout History
export const fetchPayouts = createAsyncThunk(
  "finance/fetchPayouts",
  async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/seller/finance/payouts?page=${page}&limit=${limit}`);
      return response.data.data;  
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch payouts");
    }
  }
);

// 3. Request New Payout
export const requestPayout = createAsyncThunk(
  "finance/requestPayout",
  async (amount, { rejectWithValue }) => {
    try {
      const response = await api.post("/seller/finance/withdraw", { amount });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to request payout");
    }
  }
);

const financeSlice = createSlice({
  name: "finance",
  initialState: {
    transactions: [],
    payouts: [],
    totalTransactions: 0,
    totalPayouts: 0,
    currentPage: 1,
    totalPages: 1,
    loading: false,
    actionLoading: false, // For button loading state
    error: null,
    successMessage: null,
  },
  reducers: {
    clearFinanceMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Transactions
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        // Handle pagination response structure from backend
        state.transactions = action.payload.docs || action.payload; 
        state.totalTransactions = action.payload.totalDocs || action.payload.length;
        state.totalPages = action.payload.totalPages || 1;
        state.currentPage = action.payload.page || 1;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Payouts
      .addCase(fetchPayouts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPayouts.fulfilled, (state, action) => {
        state.loading = false;
        state.payouts = action.payload.payouts || [];
        state.totalPayouts = action.payload.total || 0;
      })
      .addCase(fetchPayouts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Request Payout
      .addCase(requestPayout.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(requestPayout.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.payouts.unshift(action.payload); // Add new request to top of list
        state.successMessage = "Payout request submitted successfully!";
      })
      .addCase(requestPayout.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearFinanceMessages } = financeSlice.actions;
export default financeSlice.reducer;