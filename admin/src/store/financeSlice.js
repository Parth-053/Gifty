import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";

// Fetch All Transactions (Platform wide)
export const fetchTransactions = createAsyncThunk(
  "finance/fetchTransactions",
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.get("/admin/finance/transactions", { params });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch All Payout Requests
export const fetchPayouts = createAsyncThunk(
  "finance/fetchPayouts",
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.get("/admin/finance/payouts", { params });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Process Payout (Approve/Reject - Optional Feature)
export const processPayout = createAsyncThunk(
  "finance/processPayout",
  async ({ id, status, note }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/admin/finance/payouts/${id}/process`, { status, note });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.message);
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
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Transactions
      .addCase(fetchTransactions.pending, (state) => { state.loading = true; })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload.transactions || action.payload;
        state.totalTransactions = action.payload.totalDocs || 0;
      })
      // Payouts
      .addCase(fetchPayouts.pending, (state) => { state.loading = true; })
      .addCase(fetchPayouts.fulfilled, (state, action) => {
        state.loading = false;
        state.payouts = action.payload.payouts || action.payload;
        state.totalPayouts = action.payload.totalDocs || 0;
      })
      // Process Payout
      .addCase(processPayout.fulfilled, (state, action) => {
        const index = state.payouts.findIndex(p => p._id === action.payload._id);
        if (index !== -1) state.payouts[index] = action.payload;
      });
  },
});

export default financeSlice.reducer;