import { createSlice } from '@reduxjs/toolkit';
import { register, login, logout, fetchCurrentUser } from './operations';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: { name: null, email: null },
    token: localStorage.getItem('token'),
    isLoggedIn: false,
    isRefreshing: !!localStorage.getItem('token'),
  },
  extraReducers: builder => {
    builder
      .addCase(register.fulfilled, (state, { payload }) => {
        state.user = payload.user;
        state.token = payload.token;
        state.isLoggedIn = true;
      })
      .addCase(login.fulfilled, (state, { payload }) => {
        state.user = payload.user;
        state.token = payload.token;
        state.isLoggedIn = true;
      })
      .addCase(logout.fulfilled, state => {
        state.user = { name: null, email: null };
        state.token = null;
        state.isLoggedIn = false;
        state.isRefreshing = false;
      })
      .addCase(fetchCurrentUser.pending, state => {
        state.isRefreshing = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, { payload }) => {
        state.user = {
          name: payload.name,
          email: payload.email,
        };
        state.isLoggedIn = true;
        state.isRefreshing = false;
      })
      .addCase(fetchCurrentUser.rejected, state => {
        state.isRefreshing = false;
        state.isLoggedIn = false;
        state.token = null;
      });
  },
});

export default authSlice.reducer;
