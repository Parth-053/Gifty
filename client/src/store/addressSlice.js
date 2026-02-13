import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';
import toast from 'react-hot-toast';

// --- ASYNC THUNKS ---

// 1. Fetch All Addresses
// Endpoint: GET /api/v1/user/address
export const fetchAddresses = createAsyncThunk(
  'addresses/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/user/address');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch addresses');
    }
  }
);

// 2. Add New Address
// Endpoint: POST /api/v1/user/address
export const addAddress = createAsyncThunk(
  'addresses/add',
  async (addressData, { rejectWithValue }) => {
    try {
      const response = await api.post('/user/address', addressData);
      toast.success("Address added successfully");
      return response.data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add address");
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// 3. Update Address
// Endpoint: PUT /api/v1/user/address/:id
export const updateAddress = createAsyncThunk(
  'addresses/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/user/address/${id}`, data);
      toast.success("Address updated");
      return response.data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update address");
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// 4. Set Default Address
// Endpoint: PATCH /api/v1/user/address/:id/default
export const setDefaultAddress = createAsyncThunk(
  'addresses/setDefault',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/user/address/${id}/default`);
      toast.success("Default address updated");
      return response.data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to set default address");
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// 5. Delete Address
// Endpoint: DELETE /api/v1/user/address/:id
export const deleteAddress = createAsyncThunk(
  'addresses/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/user/address/${id}`);
      toast.success("Address removed");
      return id;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete address");
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

const addressSlice = createSlice({
  name: 'addresses',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // --- Fetch ---
      .addCase(fetchAddresses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];
        // Ensure default is always first for display convenience
        state.items.sort((a, b) => (b.isDefault ? 1 : 0) - (a.isDefault ? 1 : 0));
      })
      .addCase(fetchAddresses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // --- Add ---
      .addCase(addAddress.fulfilled, (state, action) => {
        if (action.payload.isDefault) {
          // Backend guarantees single default, but we update UI immediately
          state.items.forEach(item => item.isDefault = false);
        }
        state.items.unshift(action.payload);
        state.items.sort((a, b) => (b.isDefault ? 1 : 0) - (a.isDefault ? 1 : 0));
      })

      // --- Update ---
      .addCase(updateAddress.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item._id === action.payload._id);
        if (index !== -1) {
          if (action.payload.isDefault) {
             state.items.forEach(item => item.isDefault = false);
          }
          state.items[index] = action.payload;
          state.items.sort((a, b) => (b.isDefault ? 1 : 0) - (a.isDefault ? 1 : 0));
        }
      })

      // --- Set Default ---
      .addCase(setDefaultAddress.fulfilled, (state, action) => {
        // 1. Set all local items to false
        state.items.forEach(item => item.isDefault = false);
        // 2. Find the updated item and set to true
        const index = state.items.findIndex(item => item._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        // 3. Re-sort so default is at top
        state.items.sort((a, b) => (b.isDefault ? 1 : 0) - (a.isDefault ? 1 : 0));
      })

      // --- Delete ---
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item._id !== action.payload);
      });
  }
});

export default addressSlice.reducer;