import { createSlice } from '@reduxjs/toolkit';

// Check LocalStorage for existing session
const initialState = {
  admin: JSON.parse(localStorage.getItem('adminUser')) || null,
  token: localStorage.getItem('adminToken') || null,
  isAuthenticated: !!localStorage.getItem('adminToken'),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.admin = action.payload.user;
      state.token = action.payload.token;
      
      // Save to Storage
      localStorage.setItem('adminToken', action.payload.token);
      localStorage.setItem('adminUser', JSON.stringify(action.payload.user));
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.admin = null;
      state.token = null;
      state.isAuthenticated = false;
      
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
    }
  },
});

export const { loginStart, loginSuccess, loginFailure, logout } = authSlice.actions;
export default authSlice.reducer;