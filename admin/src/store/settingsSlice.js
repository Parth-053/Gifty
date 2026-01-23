import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";

export const fetchSettings = createAsyncThunk(
  "settings/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/admin/settings");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateSettings = createAsyncThunk(
  "settings/update",
  async (settingsData, { rejectWithValue }) => {
    try {
      const response = await api.put("/admin/settings", settingsData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const settingsSlice = createSlice({
  name: "settings",
  initialState: {
    data: null,  
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    resetStatus: (state) => { state.success = false; state.error = null; }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSettings.pending, (state) => { state.loading = true; })
      .addCase(fetchSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(updateSettings.pending, (state) => { state.loading = true; })
      .addCase(updateSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.success = true;
      });
  },
});

export const { resetStatus } = settingsSlice.actions;
export default settingsSlice.reducer;