import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";
import { auth } from "../config/firebase";
import { signOut } from "firebase/auth";

// renamed to 'syncSeller' to match Login.jsx import
export const syncSeller = createAsyncThunk(
  "auth/syncSeller",
  async (_, { rejectWithValue }) => {
    try {
      // Tries to fetch the profile (usually on page reload)
      const response = await api.get("/auth/me");
      return response.data.data; 
    } catch (error) {
      const status = error.response?.status;
      const message = error.response?.data?.message || "Failed to load seller profile";
      return rejectWithValue({ status, message });
    }
  }
);

// renamed to 'logout' to match Navbar.jsx import
export const logout = createAsyncThunk("auth/logout", async () => {
    await signOut(auth);
    localStorage.clear(); // Optional: clear local storage on logout
    return true;
});

const initialState = {
  seller: null,
  isAuthenticated: false,
  loading: true, 
  error: null
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoading: (state, action) => { state.loading = action.payload; },
    clearAuthError: (state) => { state.error = null; }
  },
  extraReducers: (builder) => {
    builder
      // --- SYNC SELLER CASES ---
      .addCase(syncSeller.pending, (state) => {
        state.error = null;
      })
      .addCase(syncSeller.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.seller = action.payload;
      })
      .addCase(syncSeller.rejected, (state, action) => {
        state.loading = false;
        
        // Handle 404: User is in Firebase but has no MongoDB profile yet
        if (action.payload?.status === 404) {
             state.isAuthenticated = true; 
             state.seller = null; 
        } else {
             state.isAuthenticated = false;
             state.seller = null;
             state.error = action.payload?.message;
        }
      })

      // --- LOGOUT CASES ---
      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.seller = null;
        state.loading = false;
      });
  },
});

export const { setLoading, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
