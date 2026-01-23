import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";

// Fetch All Return Requests
export const fetchReturns = createAsyncThunk(
  "returns/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/admin/returns"); 
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Update Return Status (Approve/Reject)
export const updateReturnStatus = createAsyncThunk(
  "returns/updateStatus",
  async ({ id, status, adminComment }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/admin/returns/${id}`, { status, adminComment });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const returnSlice = createSlice({
  name: "returns",
  initialState: {
    requests: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReturns.pending, (state) => { state.loading = true; })
      .addCase(fetchReturns.fulfilled, (state, action) => {
        state.loading = false;
        state.requests = action.payload;
      })
      .addCase(updateReturnStatus.fulfilled, (state, action) => {
        const index = state.requests.findIndex(r => r._id === action.payload._id);
        if (index !== -1) state.requests[index] = action.payload;
      });
  },
});

export default returnSlice.reducer;