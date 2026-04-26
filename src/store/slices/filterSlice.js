import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  category: 'All',
  type: 'All',
  dateRange: 'All', // 'All', '7days', 'thisMonth', 'custom'
  searchTerm: '',
  sortBy: 'date-desc' // 'date-desc', 'date-asc', 'amount-desc', 'amount-asc'
};

const filterSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      return { ...state, ...action.payload };
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    resetFilters: () => initialState
  }
});

export const { setFilters, setSearchTerm, setSortBy, resetFilters } = filterSlice.actions;

export default filterSlice.reducer;
