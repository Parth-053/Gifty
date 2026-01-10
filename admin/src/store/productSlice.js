import { createSlice } from '@reduxjs/toolkit';

const initialProducts = [
  { id: 1, name: "Wireless Headphones", category: "Electronics", price: 2999, stock: 45, sellerName: "TechWorld", status: "Pending", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100" },
  { id: 2, name: "Running Shoes", category: "Fashion", price: 1499, stock: 120, sellerName: "ShoeZone", status: "Active", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100" },
  { id: 3, name: "Smart Watch", category: "Electronics", price: 3999, stock: 10, sellerName: "GadgetHub", status: "Rejected", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100" },
];

const productSlice = createSlice({
  name: 'products',
  initialState: {
    list: initialProducts,
    loading: false,
    error: null,
  },
  reducers: {
    setProducts: (state, action) => {
      state.list = action.payload;
    },
    approveProduct: (state, action) => {
      const product = state.list.find(p => p.id === action.payload);
      if (product) product.status = 'Active';
    },
    rejectProduct: (state, action) => {
      const product = state.list.find(p => p.id === action.payload);
      if (product) product.status = 'Rejected';
    },
    deleteProduct: (state, action) => {
      state.list = state.list.filter(p => p.id !== action.payload);
    }
  },
});

export const { setProducts, approveProduct, rejectProduct, deleteProduct } = productSlice.actions;
export default productSlice.reducer;