import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios"; // Ensure you created this file in previous turn

// Async Thunk for Login
export const loginAdmin = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/login", credentials);
      // Assuming response.data.data contains { user, accessToken }
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

// Async Thunk for Logout
export const logoutAdmin = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await api.post("/auth/logout");
      return true;
    } catch  {
      return rejectWithValue("Logout failed");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: JSON.parse(localStorage.getItem("adminUser")) || null,
    accessToken: localStorage.getItem("adminToken") || null,
    isAuthenticated: !!localStorage.getItem("adminToken"),
    loading: false,
    error: null,
  },
  reducers: {
    // Manual logout action (for token expiry)
    resetAuth: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      localStorage.removeItem("adminUser");
      localStorage.removeItem("adminToken");
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        
        // Persist (Securely)
        localStorage.setItem("adminUser", JSON.stringify(action.payload.user));
        localStorage.setItem("adminToken", action.payload.accessToken);
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Logout
      .addCase(logoutAdmin.fulfilled, (state) => {
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
        localStorage.removeItem("adminUser");
        localStorage.removeItem("adminToken");
      });
  },
});

export const { resetAuth } = authSlice.actions;
export default authSlice.reducer;