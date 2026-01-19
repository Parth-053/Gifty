import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";

// Fetch Transactions
export const fetchTransactions = createAsyncThunk(
  "finance/transactions",
  async ({ page = 1 }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/admin/finance/transactions?page=${page}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// Fetch Payouts
export const fetchPayouts = createAsyncThunk(
  "finance/payouts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`/admin/finance/payouts`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

const financeSlice = createSlice({
  name: "finance",
  initialState: {
    transactions: [],
    payouts: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => { state.loading = true; })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload.transactions;
      })
      .addCase(fetchPayouts.pending, (state) => { state.loading = true; })
      .addCase(fetchPayouts.fulfilled, (state, action) => {
        state.loading = false;
        state.payouts = action.payload;
      });
  },
});

export default financeSlice.reducer;