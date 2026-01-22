import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    isSidebarOpen: false,
    isSearchModalOpen: false,
    isCartOpen: false,
  },
  reducers: {
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    toggleSearchModal: (state) => {
      state.isSearchModalOpen = !state.isSearchModalOpen;
    },
    toggleCartDrawer: (state) => {
      state.isCartOpen = !state.isCartOpen;
    },
    closeAllModals: (state) => {
      state.isSidebarOpen = false;
      state.isSearchModalOpen = false;
      state.isCartOpen = false;
    }
  },
});

export const { 
  toggleSidebar, 
  toggleSearchModal, 
  toggleCartDrawer, 
  closeAllModals 
} = uiSlice.actions;

export default uiSlice.reducer;