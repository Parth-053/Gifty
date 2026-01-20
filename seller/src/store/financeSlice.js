import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';

/**
 * Fetch Seller Wallet and Stats
 */
export const fetchFinanceStats = createAsyncThunk(
  'finance/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/seller/finance/stats');
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to load wallet stats");
    }
  }
);

/**
 * Fetch Payout History
 */
export const fetchPayoutHistory = createAsyncThunk(
  'finance/fetchPayouts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/seller/finance/payouts');
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch payouts");
    }
  }
);

const financeSlice = createSlice({
  name: 'finance',
  initialState: {
    wallet: {
      totalEarnings: 0,
      availableBalance: 0,
      pendingSettlements: 0,
    },
    payouts: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearFinanceError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Wallet Stats Handlers
      .addCase(fetchFinanceStats.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFinanceStats.fulfilled, (state, action) => {
        state.loading = false;
        state.wallet = action.payload;
      })
      .addCase(fetchFinanceStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Payout History Handlers
      .addCase(fetchPayoutHistory.fulfilled, (state, action) => {
        state.payouts = action.payload;
      });
  },
});

export const { clearFinanceError } = financeSlice.actions;
export default financeSlice.reducer;