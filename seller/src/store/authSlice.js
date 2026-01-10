import { createSlice } from '@reduxjs/toolkit';

// Initial State (Try loading from LocalStorage)
const initialState = {
  user: JSON.parse(localStorage.getItem('sellerUser')) || null,
  token: localStorage.getItem('sellerToken') || null,
  isAuthenticated: !!localStorage.getItem('sellerToken'),
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
      state.user = action.payload.user;
      state.token = action.payload.token;
      
      // Persist
      localStorage.setItem('sellerToken', action.payload.token);
      localStorage.setItem('sellerUser', JSON.stringify(action.payload.user));
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      
      // Clear Storage
      localStorage.removeItem('sellerToken');
      localStorage.removeItem('sellerUser');
    },
    updateProfile: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem('sellerUser', JSON.stringify(state.user));
    }
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, updateProfile } = authSlice.actions;
export default authSlice.reducer;