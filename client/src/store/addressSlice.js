import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';
import toast from 'react-hot-toast';

// Helper to get saved ID from local storage
const getSavedSelection = () => localStorage.getItem('selectedAddressId');

// --- ASYNC THUNKS ---

export const fetchAddresses = createAsyncThunk(
  'addresses/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/address'); // Endpoint matches your backend
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch addresses');
    }
  }
);

export const addAddress = createAsyncThunk(
  'addresses/add',
  async (addressData, { rejectWithValue }) => {
    try {
      const response = await api.post('/address', addressData);
      toast.success("Address added");
      return response.data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add address");
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const updateAddress = createAsyncThunk(
  'addresses/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/address/${id}`, data);
      toast.success("Address updated");
      return response.data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const setDefaultAddress = createAsyncThunk(
  'addresses/setDefault',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/address/${id}/default`);
      toast.success("Default address updated");
      return response.data.data;
    } catch (error) {
      toast.error("Failed to change default");
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const deleteAddress = createAsyncThunk(
  'addresses/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/address/${id}`);
      toast.success("Address removed");
      return id;
    } catch (error) {
      toast.error("Failed to remove address");
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

const addressSlice = createSlice({
  name: 'addresses',
  initialState: {
    items: [],
    selectedId: getSavedSelection(), // Initialize from LocalStorage
    loading: false,
    error: null,
  },
  reducers: {
    // Action to manually select an address (UI only)
    selectAddress: (state, action) => {
      state.selectedId = action.payload;
      localStorage.setItem('selectedAddressId', action.payload); // Save to storage
    },
  },
  extraReducers: (builder) => {
    builder
      // --- Fetch ---
      .addCase(fetchAddresses.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];

        // Logic: Verify if our saved 'selectedId' actually exists in the fetched list
        const selectedExists = state.items.find(i => i._id === state.selectedId);

        // If no valid selection exists, default to the address marked isDefault
        if (!selectedExists) {
          const defaultAddr = state.items.find(i => i.isDefault);
          const newId = defaultAddr ? defaultAddr._id : state.items[0]?._id || null;
          
          state.selectedId = newId;
          if (newId) localStorage.setItem('selectedAddressId', newId);
        }
      })
      .addCase(fetchAddresses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // --- Add ---
      .addCase(addAddress.fulfilled, (state, action) => {
        if (action.payload.isDefault) {
          state.items.forEach(i => i.isDefault = false);
        }
        state.items.unshift(action.payload); // Add to top
        
        // Auto-select the newly added address
        state.selectedId = action.payload._id;
        localStorage.setItem('selectedAddressId', action.payload._id);
      })

      // --- Update ---
      .addCase(updateAddress.fulfilled, (state, action) => {
        const index = state.items.findIndex(i => i._id === action.payload._id);
        if (index !== -1) {
          if (action.payload.isDefault) {
            state.items.forEach(i => i.isDefault = false);
          }
          state.items[index] = action.payload;
        }
      })

      // --- Set Default ---
      .addCase(setDefaultAddress.fulfilled, (state, action) => {
        // Just update the flags, DO NOT change selectedId
        state.items.forEach(i => i.isDefault = false);
        const index = state.items.findIndex(i => i._id === action.payload._id);
        if (index !== -1) {
          state.items[index].isDefault = true;
        }
      })

      // --- Delete ---
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.items = state.items.filter(i => i._id !== action.payload);
        
        // If we deleted the currently selected address, pick a new one
        if (state.selectedId === action.payload) {
          const defaultAddr = state.items.find(i => i.isDefault);
          const newId = defaultAddr ? defaultAddr._id : state.items[0]?._id || null;
          
          state.selectedId = newId;
          if (newId) {
            localStorage.setItem('selectedAddressId', newId);
          } else {
            localStorage.removeItem('selectedAddressId');
          }
        }
      });
  }
});

export const { selectAddress } = addressSlice.actions;
export default addressSlice.reducer;