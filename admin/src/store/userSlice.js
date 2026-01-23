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
      return response.data.data; // { users, total, pages }
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

// 4. Delete User
export const deleteUser = createAsyncThunk(
  "users/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/admin/users/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Delete failed");
    }
  }
);

const userSlice = createSlice({
  name: "users",
  initialState: {
    list: [],
    currentUser: null,
    total: 0,
    totalPages: 0,
    currentPage: 1,
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
      .addCase(fetchUsers.pending, (state) => { state.loading = true; })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.users;
        state.total = action.payload.total;
        state.totalPages = Math.ceil(action.payload.total / 10); // Approx if backend doesn't send pages
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Details
      .addCase(fetchUserDetails.pending, (state) => { state.loading = true; })
      .addCase(fetchUserDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
      })
      // Update Status
      .addCase(updateUserStatus.fulfilled, (state, action) => {
        if (state.currentUser?._id === action.payload._id) {
          state.currentUser = action.payload;
        }
        const index = state.list.findIndex(u => u._id === action.payload._id);
        if (index !== -1) state.list[index] = action.payload;
      })
      // Delete
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.list = state.list.filter(user => user._id !== action.payload);
        state.total -= 1;
      });
  },
});

export const { clearCurrentUser } = userSlice.actions;
export default userSlice.reducer;