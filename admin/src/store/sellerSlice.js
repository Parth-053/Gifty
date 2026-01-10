import { createSlice } from '@reduxjs/toolkit';

const initialSellers = [
  { id: 1, storeName: "TechWorld", ownerName: "Rahul Kumar", email: "rahul@tech.com", status: "Verified", sales: 120000 },
  { id: 2, storeName: "FashionHub", ownerName: "Sita Verma", email: "sita@hub.com", status: "Pending", sales: 0 },
  { id: 3, storeName: "GadgetStore", ownerName: "Amit Singh", email: "amit@gadget.com", status: "Rejected", sales: 0 },
];

const sellerSlice = createSlice({
  name: 'sellers',
  initialState: {
    list: initialSellers,
    loading: false,
    error: null,
  },
  reducers: {
    setSellers: (state, action) => {
      state.list = action.payload;
    },
    verifySeller: (state, action) => {
      const seller = state.list.find(s => s.id === action.payload);
      if (seller) seller.status = 'Verified';
    },
    rejectSeller: (state, action) => {
      const seller = state.list.find(s => s.id === action.payload);
      if (seller) seller.status = 'Rejected';
    },
    deleteSeller: (state, action) => {
      state.list = state.list.filter(s => s.id !== action.payload);
    }
  },
});

export const { setSellers, verifySeller, rejectSeller, deleteSeller } = sellerSlice.actions;
export default sellerSlice.reducer;