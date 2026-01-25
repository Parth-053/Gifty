import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  updateProfile,
  sendPasswordResetEmail,
  confirmPasswordReset,
  applyActionCode
} from "firebase/auth";
import { auth } from "../config/firebase";
import api from "../api/axios";

// ---------------------------------------
// 1. Register Seller (Direct Flow)
// ---------------------------------------
export const registerSeller = createAsyncThunk(
  "auth/register",
  async ({ fullName, email, password, phone, storeName, gstin }, { rejectWithValue }) => {
    let firebaseUser = null;
    try {
      // Create User
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      firebaseUser = userCredential.user;
      
      const token = await firebaseUser.getIdToken();

      // Update Name
      await updateProfile(firebaseUser, { displayName: fullName });

      // Backend Sync
      const response = await api.post("/auth/sync/seller", {
        fullName,
        email,
        phone,
        storeName,
        gstin: gstin || "",
        role: "seller"
      }, {
        headers: { "Authorization": `Bearer ${token}` }
      });

      return {
        user: response.data.data,
        token: token
      };

    } catch (error) {
      // Rollback
      if (firebaseUser) {
        await firebaseUser.delete().catch(console.error);
      }
      
      if (error.code === 'auth/email-already-in-use') return rejectWithValue("Email already registered.");
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// ---------------------------------------
// 2. Login Seller
// ---------------------------------------
export const loginSeller = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      const token = await firebaseUser.getIdToken();
      
      // Fetch profile
      const response = await api.get("/auth/me"); 
      
      return { user: response.data.data, token };
    } catch (error) {
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        return rejectWithValue("Invalid email or password");
      }
      if (error.response?.status === 404 || error.response?.status === 401) {
         return rejectWithValue("Profile missing. Please register again.");
      }
      return rejectWithValue(error.message);
    }
  }
);

// ---------------------------------------
// 3. Logout
// ---------------------------------------
export const logoutSeller = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const user = auth.currentUser;
      if (user) {
        try { 
          const token = await user.getIdToken();
          await api.post("/auth/logout", {}, { headers: { "Authorization": `Bearer ${token}` } });
        } catch (backendError) { 
          // ESLint Fix: Used the variable
          console.warn("Backend logout skipped:", backendError.message);
        }
      }
      await signOut(auth);
      return true;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ---------------------------------------
// 4. Sync Profile
// ---------------------------------------
export const syncSellerProfile = createAsyncThunk(
  "auth/syncProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/auth/me");
      return response.data.data;
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 404) {
        await signOut(auth);
        return rejectWithValue("Session invalid.");
      }
      return rejectWithValue("Session expired");
    }
  }
);

// ---------------------------------------
// 5. Password Reset & Actions (FIXED: Now using the imports)
// ---------------------------------------
export const sendResetLink = createAsyncThunk(
  "auth/sendResetLink",
  async (email, { rejectWithValue }) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return "Password reset link sent.";
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ oobCode, newPassword }, { rejectWithValue }) => {
    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
      return "Password reset successful.";
    } catch (error) {
      return rejectWithValue(error.message); 
    }
  }
);

export const verifyEmailAction = createAsyncThunk(
  "auth/verifyEmailAction",
  async (oobCode, { rejectWithValue }) => {
    try {
      await applyActionCode(auth, oobCode);
      return "Email verified successfully.";
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ---------------------------------------
// Slice Definition
// ---------------------------------------
const authSlice = createSlice({
  name: "auth",
  initialState: {
    seller: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    setLoading: (state, action) => { state.loading = action.payload; },
    clearError: (state) => { state.error = null; state.successMessage = null; },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerSeller.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(registerSeller.fulfilled, (state, action) => {
        state.loading = false;
        state.seller = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(registerSeller.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Login
      .addCase(loginSeller.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(loginSeller.fulfilled, (state, action) => {
        state.loading = false;
        state.seller = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(loginSeller.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Sync Profile
      .addCase(syncSellerProfile.fulfilled, (state, action) => {
        state.seller = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(syncSellerProfile.rejected, (state) => {
        state.seller = null;
        state.isAuthenticated = false;
      })

      // Logout
      .addCase(logoutSeller.fulfilled, (state) => {
        state.seller = null;
        state.isAuthenticated = false;
      })

      // Password Reset Cases
      .addCase(sendResetLink.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(sendResetLink.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload;
      })
      .addCase(sendResetLink.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(resetPassword.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(verifyEmailAction.pending, (state) => { state.loading = true; })
      .addCase(verifyEmailAction.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload;
      })
      .addCase(verifyEmailAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setLoading, clearError } = authSlice.actions;
export default authSlice.reducer;