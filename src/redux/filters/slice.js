import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  status: 'all',
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setStatusFilter(state, action) {
      state.status = action.payload;
    },
    resetFilters(state) {
      state.status = 'all';
    },
  },
});

export const { setStatusFilter, resetFilters } = filtersSlice.actions;
export const selectStatusFilter = state => state.filters.status;
export default filtersSlice.reducer;
