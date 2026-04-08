import api from '../../axios/api';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { setAuthHeader, clearAuthHeader } from '../../axios/api';

export const register = createAsyncThunk(
  'auth/register',
  async (credentials, thunkAPI) => {
    try {
      const response = await api.post('/users/signup', credentials);
      if (response.data.token) {
        setAuthHeader(response.data.token);
      }
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Registration failed'
      );
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (credentials, thunkAPI) => {
    try {
      const response = await api.post('/users/signin', credentials);
      setAuthHeader(response.data.token);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Login failed' 
      );
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
  try {
    await api.post('/users/signout');
    clearAuthHeader();
    
    return;
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || 'Logout failed' 
    );
  }
});

export const refreshUser = createAsyncThunk(
  'auth/refreshUser',
  async (_, thunkAPI) => {
    const state = thunkAPI.getState();
    const persistedToken = state.auth.token;

    if (!persistedToken) {
      return thunkAPI.rejectWithValue('Unable to fetch user');
    }

    try {
      setAuthHeader(persistedToken);
      const res = await api.get('/users/current/refresh');
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, thunkAPI) => {
    const state = thunkAPI.getState();
    const persistedToken = state.auth.token;

    if (!persistedToken) {
      return thunkAPI.rejectWithValue('No token found');
    }

    try {
      setAuthHeader(persistedToken);
      const res = await api.get('/users/current');
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
