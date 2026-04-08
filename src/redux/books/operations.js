import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../axios/api';

export const fetchOwnBooks = createAsyncThunk(
  'books/fetchOwnBooks',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const res = await api.get('/books/own', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to load books'
      );
    }
  }
);

export const addBook = createAsyncThunk(
  'books/addBook',
  async (bookData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const res = await api.post('/books/add', bookData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Add book failed'
      );
    }
  }
);

export const addBookById = createAsyncThunk(
  'books/addById',
  async (bookId, thunkAPI) => {
    try {
      const response = await api.post(`/books/add/${bookId}`);
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Error');
    }
  }
);

export const deleteBook = createAsyncThunk(
  'books/deleteBook',
  async (bookId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      await api.delete(`/books/remove/${bookId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return bookId;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Delete failed'
      );
    }
  }
);

export const fetchBookById = createAsyncThunk(
  'books/fetchById',
  async (bookId, thunkAPI) => {
    try {
      const res = await api.get(`/books/${bookId}`);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to fetch book info'
      );
    }
  }
);

export const startReading = createAsyncThunk(
  'books/startReading',
  async ({ bookId, page }, thunkAPI) => {
    try {
      if (!bookId) {
        throw new Error('Book ID is required');
      }
      if (!page || isNaN(Number(page)) || Number(page) <= 0) {
        throw new Error('Valid positive page number is required');
      }

      const res = await api.post('/books/reading/start', {
        id: bookId,
        page: Number(page),
      });

      return { bookId, ...res.data };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Failed to start reading';

      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const stopReading = createAsyncThunk(
  'books/stopReading',
  async ({ bookId, page }, thunkAPI) => {
    try {
      if (!bookId) throw new Error('Book ID is required');
      if (!page || isNaN(Number(page)) || Number(page) <= 0) {
        throw new Error('Valid positive page number is required');
      }

      const res = await api.post('/books/reading/finish', {
        id: bookId,
        page: Number(page),
      });

      return { bookId, ...res.data };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Failed to stop reading';

      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const deleteReadingEvent = createAsyncThunk(
  'books/deleteReadingEvent',
  async ({ bookId, readingId }, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const token = state.auth.token;

      if (!token) {
        return thunkAPI.rejectWithValue('No token found in Redux state');
      }

      const res = await api({
        method: 'delete',
        url: '/books/reading',
        params: {
          bookId,
          readingId,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return { bookId, readingId };
    } catch (error) {
      if (error.response?.status === 401) {
        console.error('401 Unauthorized');
      }
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Delete failed'
      );
    }
  }
);
