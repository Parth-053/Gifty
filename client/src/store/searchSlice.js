import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';

// Fetch Trending Searches
export const fetchTrending = createAsyncThunk(
  'search/fetchTrending',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/search/trending');
      return response.data.data; 
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch trends');
    }
  }
);

// Fetch Suggestions (Autocomplete)
export const fetchSuggestions = createAsyncThunk(
  'search/fetchSuggestions',
  async (query, { rejectWithValue }) => {
    try {
      const response = await api.get(`/search/suggestions?q=${encodeURIComponent(query)}`);
      return response.data.data; 
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// Perform Full Search
export const performSearch = createAsyncThunk(
  'search/performSearch',
  async ({ query, page = 1 }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/search?q=${encodeURIComponent(query)}&page=${page}`);
      return response.data.data; 
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Search failed');
    }
  }
);

const searchSlice = createSlice({
  name: 'search',
  initialState: {
    trending: [],
    suggestions: [],
    results: [],
    totalResults: 0,
    loading: false,
    error: null,
  },
  reducers: {
    clearResults: (state) => {
      state.results = [];
      state.totalResults = 0;
      state.suggestions = [];
    },
    clearSuggestions: (state) => {
      state.suggestions = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // Trending
      .addCase(fetchTrending.fulfilled, (state, action) => {
        state.trending = action.payload;
      })

      // Suggestions
      .addCase(fetchSuggestions.fulfilled, (state, action) => {
        state.suggestions = action.payload;
      })
      
      // Perform Search
      .addCase(performSearch.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.suggestions = []; // Clear suggestions when full search starts
      })
      .addCase(performSearch.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload.products;
        state.totalResults = action.payload.total;
      })
      .addCase(performSearch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearResults, clearSuggestions } = searchSlice.actions;
export default searchSlice.reducer;