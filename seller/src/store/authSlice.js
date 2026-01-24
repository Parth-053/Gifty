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

// 1. Login Seller (Firebase Auth + Backend Sync)

export const loginSeller = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
  
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      const token = await firebaseUser.getIdToken();

      const response = await api.post("/auth/sync/seller", {
        email: firebaseUser.email,
        role: "seller"
      }); 
      
      return {
        user: response.data.data,  
        token: token 
      };
    } catch (error) {
      if (error.code === 'auth/user-not-found') return rejectWithValue("User not found");
      if (error.code === 'auth/wrong-password') return rejectWithValue("Invalid password");
      if (error.code === 'auth/invalid-credential') return rejectWithValue("Invalid credentials");
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

 
// 2. Register Seller (Firebase Create + Backend Create)
 
export const registerSeller = createAsyncThunk(
  "auth/register",
  async ({ fullName, email, password, phone, storeName, gstin }, { rejectWithValue }) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Firebase Profile Update
      await updateProfile(firebaseUser, { displayName: fullName });

      const response = await api.post("/auth/sync/seller", {
        fullName,
        email,
        phone,
        storeName,
        gstin, 
        role: "seller"
      });

      return {
        user: response.data.data,
        token: await firebaseUser.getIdToken()
      };
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') return rejectWithValue("Email already registered");
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
 
// 3. Logout
 
export const logoutSeller = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const user = auth.currentUser;
 
      if (user) {
        try { 
          const token = await user.getIdToken();
 
          await api.post("/auth/logout", {}, {
            headers: {
              "Authorization": `Bearer ${token}`
            }
          });
        } catch { 
          console.warn("Backend logout skipped (Session invalid or expired).");
        }
      }
 
      await signOut(auth);
      
      return true;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
 
// 4. Sync Profile  
 
export const syncSellerProfile = createAsyncThunk(
  "auth/syncProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/auth/me");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Session expired");
    }
  }
);

// 5. Password Reset & Email Verification Actions

// Send Reset Link
export const sendResetLink = createAsyncThunk(
  "auth/sendResetLink",
  async (email, { rejectWithValue }) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return "Password reset link sent to your email.";
    } catch (error) {
      if (error.code === 'auth/user-not-found') return rejectWithValue("No account found with this email.");
      return rejectWithValue(error.message);
    }
  }
);

// Confirm Reset Password
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ oobCode, newPassword }, { rejectWithValue }) => {
    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
      return "Password has been reset successfully.";
    } catch (error) {
      return rejectWithValue(error.message); 
    }
  }
);

// Verify Email Link
export const verifyEmailAction = createAsyncThunk(
  "auth/verifyEmail",
  async (oobCode, { rejectWithValue }) => {
    try {
      await applyActionCode(auth, oobCode);
      return "Email verified successfully.";
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Slice Definition

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
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    clearError: (state) => {
      state.error = null;
      state.successMessage = null;
    },
    setUser: (state, action) => {
      state.seller = action.payload;
      state.isAuthenticated = !!action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // --- Login ---
      .addCase(loginSeller.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginSeller.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.seller = action.payload.user;
      })
      .addCase(loginSeller.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // --- Register ---
      .addCase(registerSeller.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerSeller.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.seller = action.payload.user;
      })
      .addCase(registerSeller.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // --- Sync Profile ---
      // Removed the empty 'pending' case to fix "unused state" error
      .addCase(syncSellerProfile.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.seller = action.payload;
      })
      .addCase(syncSellerProfile.rejected, (state) => {
        state.isAuthenticated = false;
        state.seller = null;
      })

      // --- Logout ---
      .addCase(logoutSeller.fulfilled, (state) => {
        state.seller = null;
        state.isAuthenticated = false;
      })

      // --- Password Reset ---
      .addCase(sendResetLink.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(sendResetLink.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload;
      })
      .addCase(sendResetLink.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // --- Reset Password Confirm ---
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // --- Verify Email ---
      .addCase(verifyEmailAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
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

export const { setLoading, clearError, setUser } = authSlice.actions;
export default authSlice.reducer;