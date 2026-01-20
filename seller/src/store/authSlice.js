import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';

/**
 * 1. Register Seller Thunk
 */
export const registerSeller = createAsyncThunk(
  'auth/register',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/register', formData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Registration failed");
    }
  }
);

/**
 * 2. Login Seller Thunk
 */
export const loginSeller = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/login', credentials);
      if (response.data.data.accessToken) {
        localStorage.setItem('sellerToken', response.data.data.accessToken);
      }
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

/**
 * 3. Forgot Password Thunk
 */
export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to send reset link");
    }
  }
);

/**
 * 4. Verify Email Thunk
 */
export const verifySellerEmail = createAsyncThunk(
  'auth/verifyEmail',
  async (otpData, { rejectWithValue }) => {
    try {
      const response = await api.post(`/auth/verify-email`, otpData); 
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Verification failed");
    }
  }
);

/**
 * 5. Update Profile Thunk
 */
export const updateProfile = createAsyncThunk(
  'auth/updateProfile', 
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.put('/seller/profile/me', userData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update profile");
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: { 
    user: null, 
    token: localStorage.getItem('sellerToken') || null, 
    loading: false,
    error: null,
    isAuthenticated: !!localStorage.getItem('sellerToken'),
    isEmailVerified: !!localStorage.getItem('sellerToken'),
    isPending: false
  },
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isEmailVerified = false;
      state.isPending = false;
      localStorage.removeItem('sellerToken');
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginSeller.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(loginSeller.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.accessToken;
        state.isEmailVerified = action.payload.user?.isEmailVerified || true;
        state.isPending = action.payload.sellerStatus === 'pending';
      })
      .addCase(loginSeller.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      // Register
      .addCase(registerSeller.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(registerSeller.fulfilled, (state) => { state.loading = false; })
      .addCase(registerSeller.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      // Verify Email
      .addCase(verifySellerEmail.fulfilled, (state) => { state.isEmailVerified = true; })
      
      // Update Profile
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.user = { ...state.user, ...action.payload };
      });
  }
});
 
export const { logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;