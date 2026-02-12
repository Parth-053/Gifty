import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';
import toast from 'react-hot-toast';

// --- ASYNC THUNKS ---

// 1. Fetch All Addresses
export const fetchAddresses = createAsyncThunk(
  'addresses/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      // FIX: Endpoint changed to '/address' (singular) to match backend
      const response = await api.get('/address');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch addresses');
    }
  }
);

// 2. Add New Address
export const addAddress = createAsyncThunk(
  'addresses/add',
  async (addressData, { rejectWithValue }) => {
    try {
      const response = await api.post('/address', addressData);
      toast.success("Address added successfully");
      return response.data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add address");
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// 3. Update Address
export const updateAddress = createAsyncThunk(
  'addresses/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/address/${id}`, data);
      toast.success("Address updated");
      return response.data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update address");
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// 4. Delete Address
export const deleteAddress = createAsyncThunk(
  'addresses/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/address/${id}`);
      toast.success("Address removed");
      return id; 
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete address");
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// 5. Set Default Address
export const setDefaultAddress = createAsyncThunk(
  'addresses/setDefault',
  async (id, { rejectWithValue }) => {
    try {
      // Using PUT to update isDefault flag
      const response = await api.put(`/address/${id}`, { isDefault: true });
      toast.success("Default address updated");
      return response.data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to set default address");
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
      // Fetch
      .addCase(fetchAddresses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];
      })
      .addCase(fetchAddresses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add
      .addCase(addAddress.fulfilled, (state, action) => {
        if (action.payload.isDefault) {
          state.items.forEach(item => item.isDefault = false);
        }
        state.items.unshift(action.payload);
      })

      // Update & Set Default
      .addCase(updateAddress.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item._id === action.payload._id);
        if (index !== -1) {
          if (action.payload.isDefault) {
             state.items.forEach(item => item.isDefault = false);
          }
          state.items[index] = action.payload;
        }
      })
      .addCase(setDefaultAddress.fulfilled, (state, action) => {
        state.items.forEach(item => item.isDefault = false);
        const index = state.items.findIndex(item => item._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })

      // Delete
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item._id !== action.payload);
      });
  },
});

export default addressSlice.reducer;