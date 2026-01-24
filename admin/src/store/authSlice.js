import { createSlice } from "@reduxjs/toolkit";

// 1. Initial State: Load from LocalStorage to prevent logout on refresh
const token = localStorage.getItem("adminToken");
const user = localStorage.getItem("adminUser") ? JSON.parse(localStorage.getItem("adminUser")) : null;

const initialState = {
  user: user,             // Load user if exists in storage
  token: token,           // Load token if exists
  isAuthenticated: !!token, // Set true if token exists
  loading: true,          // Initial loading state
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      
      // 2. Save to LocalStorage when login succeeds
      localStorage.setItem("adminToken", action.payload.token);
      localStorage.setItem("adminUser", JSON.stringify(action.payload.user));
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      
      // 3. Clear LocalStorage on logout
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminUser");
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    }
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, setLoading } = authSlice.actions;
export default authSlice.reducer;