// src/store/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: { 
    user: null, 
    token: null, 
    isAuthenticated: false,
    isEmailVerified: false,
    isPending: false
  },
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      state.isEmailVerified = user?.isEmailVerified || auth?.currentUser?.emailVerified;
      state.isPending = user?.status === 'pending';
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isEmailVerified = false;
      state.isPending = false;
    }
  }
});
 
export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;