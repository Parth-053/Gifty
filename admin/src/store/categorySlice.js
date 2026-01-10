import { createSlice } from '@reduxjs/toolkit';

// Dummy Data (Recursive Structure for Tree View)
const initialCategories = [
  {
    id: '1',
    name: 'Electronics',
    productsCount: 150,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1498049860654-af5a11f28d05?w=100',
    children: [
      { id: '1-1', name: 'Mobiles', productsCount: 80, status: 'Active', children: [] },
      { id: '1-2', name: 'Laptops', productsCount: 50, status: 'Active', children: [] },
    ]
  },
  {
    id: '2',
    name: 'Fashion',
    productsCount: 300,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1445205170230-05328324f37f?w=100',
    children: [
      { id: '2-1', name: 'Men', productsCount: 150, status: 'Active', children: [] },
      { id: '2-2', name: 'Women', productsCount: 150, status: 'Active', children: [] },
    ]
  }
];

const categorySlice = createSlice({
  name: 'categories',
  initialState: {
    list: initialCategories,
    loading: false,
    error: null,
  },
  reducers: {
    setCategories: (state, action) => {
      state.list = action.payload;
    },
    addCategory: (state, action) => {
      // In a real app, you would handle tree insertion logic or refetch from API
      state.list.push({ ...action.payload, id: Date.now().toString(), children: [] });
    },
    updateCategory: (state, action) => {
      // Simplistic update for root level (Deep update requires recursive logic)
      const index = state.list.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.list[index] = { ...state.list[index], ...action.payload };
      }
    },
    deleteCategory: (state, action) => {
      state.list = state.list.filter(c => c.id !== action.payload);
    }
  },
});

export const { setCategories, addCategory, updateCategory, deleteCategory } = categorySlice.actions;
export default categorySlice.reducer;