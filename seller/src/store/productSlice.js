import { createSlice } from '@reduxjs/toolkit';

// Dummy Initial Data
const initialProducts = [
  { id: 1, name: "Personalized Mug", price: 499, stock: 120, category: "Gifts", image: "https://via.placeholder.com/150", status: "Active" },
  { id: 2, name: "Wireless Earbuds", price: 1999, stock: 45, category: "Electronics", image: "https://via.placeholder.com/150", status: "Active" },
];

const productSlice = createSlice({
  name: 'products',
  initialState: {
    items: initialProducts,
    loading: false,
    error: null,
  },
  reducers: {
    setProducts: (state, action) => {
      state.items = action.payload;
    },
    addProduct: (state, action) => {
      state.items.push({ id: Date.now(), ...action.payload, status: "Active" });
    },
    updateProduct: (state, action) => {
      const index = state.items.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    deleteProduct: (state, action) => {
      state.items = state.items.filter(p => p.id !== action.payload);
    },
  },
});

export const { setProducts, addProduct, updateProduct, deleteProduct } = productSlice.actions;
export default productSlice.reducer;