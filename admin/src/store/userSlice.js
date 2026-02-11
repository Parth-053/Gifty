// admin/src/store/userSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";

// 1. Fetch All Users
export const fetchUsers = createAsyncThunk(
  "users/fetchAll",
  async ({ page = 1, limit = 10, search = "" }, { rejectWithValue }) => {
    try {
      const response = await api.get("/admin/users", {
        params: { page, limit, search }
      });
      return response.data.data; // { users, total }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch users");
    }
  }
);

// 2. Fetch Single User Details
export const fetchUserDetails = createAsyncThunk(
  "users/fetchDetails",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/admin/users/${id}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch user details");
    }
  }
);

// 3. Block/Unblock User
export const updateUserStatus = createAsyncThunk(
  "users/updateStatus",
  async ({ id, isActive }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/admin/users/${id}/status`, { isActive });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update status");
    }
  }
);

const userSlice = createSlice({
  name: "users",
  initialState: {
    list: [],
    total: 0,
    totalPages: 1,
    currentUser: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrentUser: (state) => {
      state.currentUser = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch List
      .addCase(fetchUsers.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.users || [];
        state.total = action.payload.total || 0;
        state.totalPages = Math.ceil((action.payload.total || 0) / 10);
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch Details
      .addCase(fetchUserDetails.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchUserDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
      })
      .addCase(fetchUserDetails.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
      })

      // Update Status (Block/Unblock)
      .addCase(updateUserStatus.fulfilled, (state, action) => {
        if (state.currentUser?._id === action.payload._id) {
          state.currentUser = action.payload;
        }
        const index = state.list.findIndex(u => u._id === action.payload._id);
        if (index !== -1) state.list[index] = action.payload;
      });
  },
});

export const { clearCurrentUser } = userSlice.actions;
export default userSlice.reducer;